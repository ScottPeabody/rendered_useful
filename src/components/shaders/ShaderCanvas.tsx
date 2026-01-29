import { useRef, useEffect, useCallback, useState } from 'react';

interface ShaderCanvasProps {
  fragmentShader: string;
  onError?: (error: string | null) => void;
  className?: string;
}

const DEFAULT_VERTEX_SHADER = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

export function ShaderCanvas({ fragmentShader, onError, className = '' }: ShaderCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const animationRef = useRef<number>(0);
  const startTimeRef = useRef<number | null>(null);
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPlaying, setIsPlaying] = useState(true);
  const [webglSupported, setWebglSupported] = useState<boolean | null>(null);
  // Check WebGL support on mount
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      // Wait for canvas to have dimensions before checking WebGL support
      if (canvas.clientWidth === 0 || canvas.clientHeight === 0) {
        const checkDimensions = setInterval(() => {
          if (canvas.clientWidth > 0 && canvas.clientHeight > 0) {
            clearInterval(checkDimensions);
            const gl = canvas.getContext('webgl');
            setWebglSupported(!!gl);
          }
        }, 50);
        // Timeout after 2 seconds
        setTimeout(() => {
          clearInterval(checkDimensions);
          if (canvas.clientWidth === 0 || canvas.clientHeight === 0) {
            setWebglSupported(false);
          }
        }, 2000);
      } else {
        const gl = canvas.getContext('webgl');
        setWebglSupported(!!gl);
      }
    } else {
      setWebglSupported(null);
    }
  }, []);

  const compileShader = useCallback((gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null => {
    const shader = gl.createShader(type);
    if (!shader) return null;

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const error = gl.getShaderInfoLog(shader);
      gl.deleteShader(shader);
      onError?.(error || 'Shader compilation failed');
      return null;
    }

    return shader;
  }, [onError]);

  const createProgram = useCallback((gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram | null => {
    const program = gl.createProgram();
    if (!program) return null;

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const error = gl.getProgramInfoLog(program);
      gl.deleteProgram(program);
      onError?.(error || 'Program linking failed');
      return null;
    }

    return program;
  }, [onError]);

  const initGL = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Ensure canvas has dimensions before initializing WebGL
    // This is critical on mobile where layout might not be complete
    if (canvas.clientWidth === 0 || canvas.clientHeight === 0) {
      // Retry after a short delay
      setTimeout(() => initGL(), 50);
      return;
    }

    const gl = canvas.getContext('webgl', {
      alpha: false,
      antialias: true,
      preserveDrawingBuffer: false
    }) || canvas.getContext('experimental-webgl', {
      alpha: false,
      antialias: true,
      preserveDrawingBuffer: false
    }) as WebGLRenderingContext;

    if (!gl) {
      onError?.('WebGL not supported');
      setWebglSupported(false);
      return;
    }

    glRef.current = gl;

    // Create geometry (full-screen quad)
    const positions = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
       1,  1,
    ]);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
  }, [onError]);

  const updateShader = useCallback(() => {
    const gl = glRef.current;
    if (!gl) return;

    // Clean up old program
    if (programRef.current) {
      gl.deleteProgram(programRef.current);
      programRef.current = null;
    }

    // Compile shaders
    const vertexShader = compileShader(gl, gl.VERTEX_SHADER, DEFAULT_VERTEX_SHADER);
    if (!vertexShader) return;

    const fragShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentShader);
    if (!fragShader) {
      gl.deleteShader(vertexShader);
      return;
    }

    // Create program
    const program = createProgram(gl, vertexShader, fragShader);
    if (!program) {
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragShader);
      return;
    }

    programRef.current = program;
    onError?.(null);

    // Set up attributes
    const positionLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
  }, [fragmentShader, compileShader, createProgram, onError]);

  // Use a ref to always have the latest render function
  const renderRef = useRef<() => void>(() => {});
  const render = useCallback(() => {
    const gl = glRef.current;
    const program = programRef.current;
    const canvas = canvasRef.current;

    if (!gl || !program || !canvas || startTimeRef.current === null) return;

    // Resize canvas if needed
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;

    if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
      canvas.width = displayWidth;
      canvas.height = displayHeight;
      gl.viewport(0, 0, displayWidth, displayHeight);
    }

    gl.useProgram(program);

    // Set uniforms
    const timeLocation = gl.getUniformLocation(program, 'u_time');
    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
    const mouseLocation = gl.getUniformLocation(program, 'u_mouse');

    const time = (Date.now() - startTimeRef.current) / 1000;
    gl.uniform1f(timeLocation, time);
    gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
    gl.uniform2f(mouseLocation, mouseRef.current.x, mouseRef.current.y);

    // Clear and draw
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    if (isPlaying) {
      animationRef.current = requestAnimationFrame(renderRef.current);
    }
  }, [isPlaying]);

  // Always keep the latest render in the ref (in effect, not render)
  useEffect(() => {
    renderRef.current = render;
  }, [render]);

  // Initialize WebGL and set start time on mount
  useEffect(() => {
    if (startTimeRef.current === null) {
      startTimeRef.current = Date.now();
    }
    initGL();
  }, [initGL]);

  // Update shader when code changes
  useEffect(() => {
    updateShader();
  }, [updateShader]);

  // Animation loop
  useEffect(() => {
    if (isPlaying && programRef.current) {
      animationRef.current = requestAnimationFrame(render);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, render]);

  // Mouse tracking
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    mouseRef.current = {
      x: (e.clientX - rect.left) / rect.width,
      y: 1 - (e.clientY - rect.top) / rect.height, // Flip Y
    };
  }, []);

  const togglePlay = useCallback(() => {
    if (!isPlaying) {
      if (startTimeRef.current !== null) {
        startTimeRef.current = Date.now() - (Date.now() - startTimeRef.current);
      } else {
        startTimeRef.current = Date.now();
      }
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const resetTime = useCallback(() => {
    startTimeRef.current = Date.now();
  }, []);

  return (
    <div className={`relative ${className}`} style={{ minHeight: 200, width: '100%', height: '100%' }}>
      <canvas
        ref={canvasRef}
        className="w-full h-full bg-black"
        style={{ minHeight: 200, display: 'block', width: '100%', height: '100%' }}
        onMouseMove={handleMouseMove}
      />
      <div className="absolute bottom-4 left-4 flex gap-2">
        <button
          onClick={togglePlay}
          className="px-3 py-1.5 bg-black/50 hover:bg-black/70 text-white rounded-lg backdrop-blur-sm text-sm font-medium transition-colors"
        >
          {isPlaying ? '⏸ Pause' : '▶ Play'}
        </button>
        <button
          onClick={resetTime}
          className="px-3 py-1.5 bg-black/50 hover:bg-black/70 text-white rounded-lg backdrop-blur-sm text-sm font-medium transition-colors"
        >
          ↺ Reset
        </button>
      </div>
      {/* WebGL error fallback */}
      {webglSupported === false && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 text-red-200 text-center text-sm p-4 z-20">
          WebGL not supported or failed to initialize.
        </div>
      )}
    </div>
  );
}
