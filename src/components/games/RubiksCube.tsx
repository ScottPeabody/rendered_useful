import { useState, useCallback, useEffect, useMemo, useRef, Suspense, Component, type ReactNode } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { OrbitControls, RoundedBox, Environment } from '@react-three/drei'
import * as THREE from 'three'
import { motion, AnimatePresence } from 'framer-motion'
import { Shuffle, Play, RotateCcw, Pause, Info, X, AlertTriangle } from 'lucide-react'

// Error boundary for Three.js canvas
class CanvasErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: ReactNode }) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-[280px] sm:h-[400px] w-full flex items-center justify-center bg-black/50">
          <div className="text-center p-4 sm:p-6">
            <AlertTriangle className="w-10 h-10 sm:w-12 sm:h-12 text-amber-400 mx-auto mb-3 sm:mb-4" />
            <p className="text-white/70 text-xs sm:text-sm">Failed to load 3D scene</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 sm:mt-4 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-xs sm:text-sm transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

// Loading fallback for Suspense
function CanvasLoader() {
  return (
    <div className="h-[280px] sm:h-[400px] w-full flex items-center justify-center bg-black/50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-b-2 border-white/50 mx-auto mb-3 sm:mb-4"></div>
        <p className="text-white/50 text-xs sm:text-sm">Loading 3D scene...</p>
      </div>
    </div>
  )
}

// Face colors - standard Rubik's cube colors
const COLORS = {
  U: '#FFFFFF', // White (up)
  D: '#FFD500', // Yellow (down)
  F: '#009B48', // Green (front)
  B: '#0045AD', // Blue (back)
  R: '#B90000', // Red (right)
  L: '#FF5900', // Orange (left)
  inner: '#1a1a1a', // Inner cube color
}

// Physical faces (absolute)
type PhysicalFace = 'U' | 'D' | 'F' | 'B' | 'R' | 'L'

// Visual directions (relative to camera)
type VisualDirection = 'top' | 'bottom' | 'front' | 'back' | 'right' | 'left'

// Standard moves
type Move = 'U' | 'U\'' | 'U2' | 'D' | 'D\'' | 'D2' | 'F' | 'F\'' | 'F2' | 'B' | 'B\'' | 'B2' | 'R' | 'R\'' | 'R2' | 'L' | 'L\'' | 'L2'

// Face mapping from visual to physical
interface FaceMapping {
  top: PhysicalFace
  bottom: PhysicalFace
  front: PhysicalFace
  back: PhysicalFace
  right: PhysicalFace
  left: PhysicalFace
}

// Cubie position type
interface CubiePosition {
  x: number
  y: number
  z: number
}

// Cubie state with colors for each face
// Colors are stored in WORLD SPACE - they get permuted when the cubie rotates
interface CubieState {
  id: string
  position: CubiePosition
  colors: {
    right: string   // +x face color
    left: string    // -x face color
    top: string     // +y face color
    bottom: string  // -y face color
    front: string   // +z face color
    back: string    // -z face color
  }
}

// Create initial solved cube state
function createSolvedCube(): CubieState[] {
  const cubies: CubieState[] = []
  
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        if (x === 0 && y === 0 && z === 0) continue
        
        cubies.push({
          id: `${x},${y},${z}`,
          position: { x, y, z },
          colors: {
            right: x === 1 ? COLORS.R : COLORS.inner,
            left: x === -1 ? COLORS.L : COLORS.inner,
            top: y === 1 ? COLORS.U : COLORS.inner,
            bottom: y === -1 ? COLORS.D : COLORS.inner,
            front: z === 1 ? COLORS.F : COLORS.inner,
            back: z === -1 ? COLORS.B : COLORS.inner,
          }
        })
      }
    }
  }
  
  return cubies
}

function getAffectedCubies(cubies: CubieState[], move: Move): CubieState[] {
  const face = move.charAt(0) as 'U' | 'D' | 'F' | 'B' | 'R' | 'L'
  
  return cubies.filter(cubie => {
    switch (face) {
      case 'U': return cubie.position.y === 1
      case 'D': return cubie.position.y === -1
      case 'F': return cubie.position.z === 1
      case 'B': return cubie.position.z === -1
      case 'R': return cubie.position.x === 1
      case 'L': return cubie.position.x === -1
      default: return false
    }
  })
}

// Rotate a cubie - permutes both position AND colors
// This is the key insight: when a cubie rotates, its colors move to different faces
function rotateCubie(cubie: CubieState, move: Move): CubieState {
  const face = move.charAt(0) as 'U' | 'D' | 'F' | 'B' | 'R' | 'L'
  const isPrime = move.includes('\'')
  const isDouble = move.includes('2')
  
  const rotations = isDouble ? 2 : 1
  let newCubie = { 
    ...cubie, 
    position: { ...cubie.position }, 
    colors: { ...cubie.colors }
  }
  
  for (let i = 0; i < rotations; i++) {
    const { position, colors } = newCubie
    const newPos = { ...position }
    const newColors = { ...colors }
    
    // Clockwise rotation when looking at the face from outside the cube
    // For each rotation axis, we rotate position AND permute colors
    
    switch (face) {
      case 'U': // Rotate around Y axis (top layer) - clockwise when looking down
      case 'D': { // Rotate around Y axis (bottom layer) - clockwise when looking up
        const cw = (face === 'U') !== isPrime // U = CW from above, D = CW from below
        if (cw) {
          // CW around Y: x->z, z->-x (position), and front->right->back->left (colors)
          newPos.x = -position.z
          newPos.z = position.x
          newColors.front = colors.right
          newColors.right = colors.back
          newColors.back = colors.left
          newColors.left = colors.front
        } else {
          // CCW around Y: x->-z, z->x (position), and front->left->back->right (colors)
          newPos.x = position.z
          newPos.z = -position.x
          newColors.front = colors.left
          newColors.left = colors.back
          newColors.back = colors.right
          newColors.right = colors.front
        }
        break
      }
      case 'R': // Rotate around X axis (right layer) - clockwise when looking from right
      case 'L': { // Rotate around X axis (left layer) - clockwise when looking from left
        const cw = (face === 'R') !== isPrime
        if (cw) {
          // CW around X: y->-z, z->y (position), and front->top->back->bottom (colors)
          newPos.y = position.z
          newPos.z = -position.y
          newColors.front = colors.bottom
          newColors.top = colors.front
          newColors.back = colors.top
          newColors.bottom = colors.back
        } else {
          // CCW around X
          newPos.y = -position.z
          newPos.z = position.y
          newColors.front = colors.top
          newColors.bottom = colors.front
          newColors.back = colors.bottom
          newColors.top = colors.back
        }
        break
      }
      case 'F': // Rotate around Z axis (front layer) - clockwise when looking at front
      case 'B': { // Rotate around Z axis (back layer) - clockwise when looking at back
        const cw = (face === 'F') !== isPrime
        if (cw) {
          // CW around Z: x->-y, y->x (position), and top->right->bottom->left (colors)
          newPos.x = position.y
          newPos.y = -position.x
          newColors.top = colors.left
          newColors.right = colors.top
          newColors.bottom = colors.right
          newColors.left = colors.bottom
        } else {
          // CCW around Z
          newPos.x = -position.y
          newPos.y = position.x
          newColors.top = colors.right
          newColors.left = colors.top
          newColors.bottom = colors.left
          newColors.right = colors.bottom
        }
        break
      }
    }
    
    newCubie = { ...newCubie, position: newPos, colors: newColors }
  }
  
  newCubie.id = `${newCubie.position.x},${newCubie.position.y},${newCubie.position.z}`
  
  return newCubie
}

// Apply a move to the cube state
function applyMove(cubies: CubieState[], move: Move): CubieState[] {
  const affected = getAffectedCubies(cubies, move)
  const affectedIds = new Set(affected.map(c => c.id))
  
  return cubies.map(cubie => {
    if (affectedIds.has(cubie.id)) {
      return rotateCubie(cubie, move)
    }
    return cubie
  })
}

function generateScramble(length: number = 20): Move[] {
  const faces = ['U', 'D', 'F', 'B', 'R', 'L'] as const
  const modifiers = ['', '\'', '2'] as const
  const moves: Move[] = []
  let lastFace = ''
  
  for (let i = 0; i < length; i++) {
    let face: string
    do {
      face = faces[Math.floor(Math.random() * faces.length)]
    } while (face === lastFace)
    
    const modifier = modifiers[Math.floor(Math.random() * modifiers.length)]
    moves.push((face + modifier) as Move)
    lastFace = face
  }
  
  return moves
}

function reverseMove(move: Move): Move {
  if (move.includes('2')) return move
  if (move.includes('\'')) return move.replace('\'', '') as Move
  return (move + '\'') as Move
}

// Individual Cubie component - renders at position
// Colors are now in world space (permuted during rotation), so no quaternion needed
interface CubieProps {
  cubie: CubieState
}

function Cubie({ cubie }: CubieProps) {
  const gap = 0.04
  const size = 0.95
  
  return (
    <group 
      position={[
        cubie.position.x * (1 + gap),
        cubie.position.y * (1 + gap),
        cubie.position.z * (1 + gap)
      ]}
    >
      <RoundedBox args={[size, size, size]} radius={0.08} smoothness={4}>
        <meshStandardMaterial color={COLORS.inner} />
      </RoundedBox>
      
      {/* Face stickers - colors are already in world space */}
      {cubie.colors.right !== COLORS.inner && (
        <mesh position={[0.48, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[0.85, 0.85]} />
          <meshStandardMaterial color={cubie.colors.right} />
        </mesh>
      )}
      {cubie.colors.left !== COLORS.inner && (
        <mesh position={[-0.48, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[0.85, 0.85]} />
          <meshStandardMaterial color={cubie.colors.left} />
        </mesh>
      )}
      {cubie.colors.top !== COLORS.inner && (
        <mesh position={[0, 0.48, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.85, 0.85]} />
          <meshStandardMaterial color={cubie.colors.top} />
        </mesh>
      )}
      {cubie.colors.bottom !== COLORS.inner && (
        <mesh position={[0, -0.48, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.85, 0.85]} />
          <meshStandardMaterial color={cubie.colors.bottom} />
        </mesh>
      )}
      {cubie.colors.front !== COLORS.inner && (
        <mesh position={[0, 0, 0.48]}>
          <planeGeometry args={[0.85, 0.85]} />
          <meshStandardMaterial color={cubie.colors.front} />
        </mesh>
      )}
      {cubie.colors.back !== COLORS.inner && (
        <mesh position={[0, 0, -0.48]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[0.85, 0.85]} />
          <meshStandardMaterial color={cubie.colors.back} />
        </mesh>
      )}
    </group>
  )
}

interface CameraTrackerProps {
  onFaceMappingChange: (mapping: FaceMapping) => void
}

function CameraTracker({ onFaceMappingChange }: CameraTrackerProps) {
  const { camera } = useThree()
  const lastMappingRef = useRef<string>('')
  
  useFrame(() => {
    // Get camera position relative to origin (cube center)
    const camPos = camera.position.clone()
    
    // Calculate spherical coordinates
    // azimuth: angle in XZ plane from +Z axis (0 = looking at front face)
    // elevation: angle from XZ plane (0 = level, +90 = looking down from above)
    const azimuth = Math.atan2(camPos.x, camPos.z) // radians, -π to +π
    const horizontalDist = Math.sqrt(camPos.x * camPos.x + camPos.z * camPos.z)
    const elevation = Math.atan2(camPos.y, horizontalDist) // radians, -π/2 to +π/2
    
    // Normalize azimuth to 0-360 degrees
    const azimuthDeg = ((azimuth * 180 / Math.PI) + 360) % 360
    const elevationDeg = elevation * 180 / Math.PI
    
    let front: PhysicalFace
    let back: PhysicalFace
    let right: PhysicalFace
    let left: PhysicalFace
    let top: PhysicalFace
    let bottom: PhysicalFace
    
    // Check if looking from very high above or below (elevation > 60° or < -60°)
    const isTopDownView = elevationDeg > 60
    const isBottomUpView = elevationDeg < -60
    
    if (isTopDownView) {
      // Looking down from above - U face is "front" (what we see)
      top = 'U'
      bottom = 'D'
      // Use azimuth to determine which edge is "front" from this bird's eye view
      if (azimuthDeg >= 315 || azimuthDeg < 45) {
        front = 'F'; back = 'B'; right = 'R'; left = 'L'
      } else if (azimuthDeg >= 45 && azimuthDeg < 135) {
        front = 'R'; back = 'L'; right = 'B'; left = 'F'
      } else if (azimuthDeg >= 135 && azimuthDeg < 225) {
        front = 'B'; back = 'F'; right = 'L'; left = 'R'
      } else {
        front = 'L'; back = 'R'; right = 'F'; left = 'B'
      }
    } else if (isBottomUpView) {
      // Looking up from below - D face is "front" (what we see)
      top = 'D'
      bottom = 'U'
      if (azimuthDeg >= 315 || azimuthDeg < 45) {
        front = 'F'; back = 'B'; right = 'L'; left = 'R'
      } else if (azimuthDeg >= 45 && azimuthDeg < 135) {
        front = 'R'; back = 'L'; right = 'F'; left = 'B'
      } else if (azimuthDeg >= 135 && azimuthDeg < 225) {
        front = 'B'; back = 'F'; right = 'R'; left = 'L'
      } else {
        front = 'L'; back = 'R'; right = 'B'; left = 'F'
      }
    } else {
      // Normal side view - determine front face based on azimuth
      // Azimuth 0° = looking at +Z (F face)
      // Azimuth 90° = looking at +X (R face)  
      // Azimuth 180° = looking at -Z (B face)
      // Azimuth 270° = looking at -X (L face)
      
      top = 'U'
      bottom = 'D'
      
      if (azimuthDeg >= 315 || azimuthDeg < 45) {
        // Looking at front face (F)
        front = 'F'; back = 'B'; right = 'R'; left = 'L'
      } else if (azimuthDeg >= 45 && azimuthDeg < 135) {
        // Looking at right face (R)
        front = 'R'; back = 'L'; right = 'B'; left = 'F'
      } else if (azimuthDeg >= 135 && azimuthDeg < 225) {
        // Looking at back face (B)
        front = 'B'; back = 'F'; right = 'L'; left = 'R'
      } else {
        // Looking at left face (L)
        front = 'L'; back = 'R'; right = 'F'; left = 'B'
      }
    }
    
    // Only update if mapping has changed
    const newMapping = { top, bottom, front, back, right, left }
    const mappingKey = `${top}${bottom}${front}${back}${right}${left}`
    
    if (mappingKey !== lastMappingRef.current && typeof onFaceMappingChange === 'function') {
      lastMappingRef.current = mappingKey
      onFaceMappingChange(newMapping)
    }
  })
  
  return null
}

interface CubeSceneProps {
  cubies: CubieState[]
  animatingMove: Move | null
  animationProgress: number
  onFaceMappingChange: (mapping: FaceMapping) => void
  resetCameraRef: React.MutableRefObject<(() => void) | null>
}

function CubeScene({ cubies, animatingMove, animationProgress, onFaceMappingChange, resetCameraRef }: CubeSceneProps) {
  const { camera } = useThree()
  
  useEffect(() => {
    resetCameraRef.current = () => {
      camera.position.set(4, 3, 5)
      camera.lookAt(0, 0, 0)
    }
    return () => {
      resetCameraRef.current = null
    }
  }, [camera, resetCameraRef])

  const animationParams = useMemo(() => {
    if (!animatingMove) return null
    
    const face = animatingMove.charAt(0) as 'U' | 'D' | 'F' | 'B' | 'R' | 'L'
    const isPrime = animatingMove.includes('\'')
    const isDouble = animatingMove.includes('2')
    
    let axis: THREE.Vector3
    let direction: number
    
    switch (face) {
      case 'U':
        axis = new THREE.Vector3(0, 1, 0)
        direction = isPrime ? 1 : -1
        break
      case 'D':
        axis = new THREE.Vector3(0, 1, 0)
        direction = isPrime ? -1 : 1
        break
      case 'R':
        axis = new THREE.Vector3(1, 0, 0)
        direction = isPrime ? 1 : -1
        break
      case 'L':
        axis = new THREE.Vector3(1, 0, 0)
        direction = isPrime ? -1 : 1
        break
      case 'F':
        axis = new THREE.Vector3(0, 0, 1)
        direction = isPrime ? 1 : -1
        break
      case 'B':
        axis = new THREE.Vector3(0, 0, 1)
        direction = isPrime ? -1 : 1
        break
      default:
        axis = new THREE.Vector3(0, 1, 0)
        direction = 1
    }
    
    const totalAngle = (isDouble ? Math.PI : Math.PI / 2) * direction
    
    return { axis, totalAngle, face }
  }, [animatingMove])
  
  const affectedPositions = useMemo(() => {
    if (!animatingMove) return new Set<string>()
    const affected = getAffectedCubies(cubies, animatingMove)
    return new Set(affected.map(c => c.id))
  }, [cubies, animatingMove])
  
  // Calculate rotation for the animating layer
  const layerRotation = useMemo(() => {
    if (!animationParams || !animatingMove) return [0, 0, 0] as [number, number, number]
    
    const angle = animationParams.totalAngle * animationProgress
    const face = animatingMove.charAt(0)
    
    switch (face) {
      case 'U':
      case 'D':
        return [0, angle, 0] as [number, number, number]
      case 'R':
      case 'L':
        return [angle, 0, 0] as [number, number, number]
      case 'F':
      case 'B':
        return [0, 0, angle] as [number, number, number]
      default:
        return [0, 0, 0] as [number, number, number]
    }
  }, [animationParams, animationProgress, animatingMove])
  
  // Separate cubies into animating and static
  const { animatingCubies, staticCubies } = useMemo(() => {
    if (!animatingMove) {
      return { animatingCubies: [], staticCubies: cubies }
    }
    
    return {
      animatingCubies: cubies.filter(c => affectedPositions.has(c.id)),
      staticCubies: cubies.filter(c => !affectedPositions.has(c.id))
    }
  }, [cubies, affectedPositions, animatingMove])
  
  return (
    <>
      <CameraTracker onFaceMappingChange={onFaceMappingChange} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <directionalLight position={[-10, -10, -5]} intensity={0.3} />
      
      {/* Static cubies (not being rotated) */}
      <group>
        {staticCubies.map(cubie => (
          <Cubie key={cubie.id} cubie={cubie} />
        ))}
      </group>
      
      {/* Animating layer - rotates as a group around center */}
      <group rotation={layerRotation}>
        {animatingCubies.map(cubie => (
          <Cubie key={cubie.id} cubie={cubie} />
        ))}
      </group>
      
      <OrbitControls 
        enablePan={false} 
        enableZoom={true}
        minDistance={5}
        maxDistance={15}
        autoRotate={false}
        minPolarAngle={Math.PI * 0.15}
        maxPolarAngle={Math.PI * 0.85}
      />
      <Environment preset="city" />
    </>
  )
}

const defaultFaceMapping: FaceMapping = {
  top: 'U',
  bottom: 'D',
  front: 'F',
  back: 'B',
  right: 'R',
  left: 'L'
}

export default function RubiksCube() {
  const [cubies, setCubies] = useState<CubieState[]>(createSolvedCube)
  const [moveQueue, setMoveQueue] = useState<Move[]>([])
  const [currentMove, setCurrentMove] = useState<Move | null>(null)
  const [animationProgress, setAnimationProgress] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [moveHistory, setMoveHistory] = useState<Move[]>([])
  const [showInfo, setShowInfo] = useState(false)
  const [isSolving, setIsSolving] = useState(false)
  const [faceMapping, setFaceMapping] = useState<FaceMapping>(defaultFaceMapping)
  // Store pre-animation cubies to render during animation (prevents color flicker)
  const [preAnimationCubies, setPreAnimationCubies] = useState<CubieState[] | null>(null)
  // Ref for camera reset function
  const resetCameraRef = useRef<(() => void) | null>(null)
  
  const animationDuration = 200

  // Animation effect - captures cubies before applying move
  useEffect(() => {
    if (!currentMove) return
    setPreAnimationCubies(cubies) // eslint-disable-line react-hooks/set-state-in-effect
    
    let startTime: number | null = null
    let frameId: number | null = null
    
    const animate = (time: number) => {
      if (startTime === null) {
        startTime = time
      }
      
      const elapsed = time - startTime
      const progress = Math.min(elapsed / animationDuration, 1)
      
      setAnimationProgress(progress)
      
      if (progress < 1) {
        frameId = requestAnimationFrame(animate)
      } else {
        setCubies(prev => applyMove(prev, currentMove))
        setMoveHistory(prev => [...prev, currentMove])
        setPreAnimationCubies(null)
        setCurrentMove(null)
        setAnimationProgress(0)
      }
    }
    
    frameId = requestAnimationFrame(animate)
    
    return () => {
      if (frameId) {
        cancelAnimationFrame(frameId)
      }
    }
  }, [currentMove]) // eslint-disable-line react-hooks/exhaustive-deps
  
  // Process move queue - intentionally using effect to handle queue state
  useEffect(() => {
    if (moveQueue.length > 0 && !currentMove && isPlaying) {
      const [nextMove, ...rest] = moveQueue
      setMoveQueue(rest) // eslint-disable-line react-hooks/set-state-in-effect
      setCurrentMove(nextMove)
    } else if (moveQueue.length === 0 && !currentMove && isPlaying) {
      setIsPlaying(false)
      setIsSolving(false)
    }
  }, [moveQueue, currentMove, isPlaying])
  
  const handleScramble = useCallback(() => {
    const scramble = generateScramble(20)
    setMoveQueue(scramble)
    setMoveHistory([])
    setIsPlaying(true)
  }, [])
  
  const handleSolve = useCallback(() => {
    if (moveHistory.length === 0) return
    const reversedMoves = [...moveHistory].reverse().map(reverseMove)
    setMoveQueue(reversedMoves)
    setIsPlaying(true)
    setIsSolving(true)
  }, [moveHistory])
  
  const handleReset = useCallback(() => {
    setCubies(createSolvedCube())
    setMoveQueue([])
    setCurrentMove(null)
    setMoveHistory([])
    setIsPlaying(false)
    setIsSolving(false)
    setAnimationProgress(0)
    resetCameraRef.current?.()
  }, [])
  
  const executeMove = useCallback((move: Move) => {
    if (!currentMove && !isPlaying) {
      setMoveQueue([move])
      setIsPlaying(true)
    }
  }, [currentMove, isPlaying])
  
  const togglePlayPause = useCallback(() => {
    setIsPlaying(prev => !prev)
  }, [])
  
  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-gradient-to-br from-[#0f0f0f] to-[#1a1a2e] border border-white/10">
      {/* Header */}
      <div className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 border-b border-white/10 bg-black/20">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-red-500 via-green-500 to-blue-500 flex items-center justify-center">
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-sm" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm sm:text-base">Rubik's Cube</h3>
            <p className="text-[10px] sm:text-xs text-white/50">3D Interactive Puzzle</p>
          </div>
        </div>
        
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="p-1.5 sm:p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
        >
          {showInfo ? <X size={16} className="sm:w-[18px] sm:h-[18px]" /> : <Info size={16} className="sm:w-[18px] sm:h-[18px]" />}
        </button>
      </div>
      
      {/* Info Panel */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-b border-white/10 bg-black/30"
          >
            <div className="p-3 sm:p-4 text-xs sm:text-sm text-white/70 space-y-1.5 sm:space-y-2">
              <p><strong className="text-white">Controls:</strong> Drag to rotate view. Pinch/scroll to zoom.</p>
              <p><strong className="text-white">Notation:</strong> U (Up), D (Down), F (Front), B (Back), R (Right), L (Left)</p>
              <p><strong className="text-white">' (Prime):</strong> Counter-clockwise rotation</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* 3D Canvas */}
      <CanvasErrorBoundary>
        <Suspense fallback={<CanvasLoader />}>
          <div className="h-[280px] sm:h-[400px] w-full">
            <Canvas camera={{ position: [4, 3, 5], fov: 45 }}>
              <CubeScene 
                cubies={preAnimationCubies || cubies}
                animatingMove={currentMove}
                animationProgress={animationProgress}
                onFaceMappingChange={setFaceMapping}
                resetCameraRef={resetCameraRef}
              />
            </Canvas>
          </div>
        </Suspense>
      </CanvasErrorBoundary>
      
      {/* Move History */}
      {moveHistory.length > 0 && (
        <div className="px-3 sm:px-4 py-1.5 sm:py-2 border-t border-white/10 bg-black/20">
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1">
            <span className="text-xs sm:text-sm text-white/50 font-semibold px-2 sm:px-3 py-0.5 sm:py-1 bg-white/10 rounded-lg shrink-0">Moves</span>
            {moveHistory.map((move, i) => (
              <span 
                key={i} 
                className="px-1.5 sm:px-2 py-0.5 rounded bg-white/10 text-[10px] sm:text-xs text-white/70 font-mono"
              >
                {move}
              </span>
            ))}
            {currentMove && (
              <span className="px-1.5 sm:px-2 py-0.5 rounded bg-blue-500/30 text-[10px] sm:text-xs text-blue-400 font-mono animate-pulse">
                {currentMove}
              </span>
            )}
          </div>
        </div>
      )}
      
      {/* Controls */}
      <div className="p-3 sm:p-4 border-t border-white/10 bg-black/30 space-y-3 sm:space-y-4">
        {/* Main Actions */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
          <button
            onClick={handleScramble}
            disabled={isPlaying}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium text-xs sm:text-sm hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
          >
            <Shuffle size={16} className="sm:w-[18px] sm:h-[18px]" />
            Scramble
          </button>
          
          {(isPlaying || moveQueue.length > 0) && (
            <button
              onClick={togglePlayPause}
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-white/10 text-white font-medium text-xs sm:text-sm hover:bg-white/20 transition-all"
            >
              {isPlaying ? <Pause size={16} className="sm:w-[18px] sm:h-[18px]" /> : <Play size={16} className="sm:w-[18px] sm:h-[18px]" />}
              {isPlaying ? 'Pause' : 'Resume'}
              {moveQueue.length > 0 && (
                <span className="px-1.5 sm:px-2 py-0.5 rounded bg-white/10 text-[10px] sm:text-xs font-mono">
                  {moveQueue.length}
                </span>
              )}
            </button>
          )}
          
          <button
            onClick={handleSolve}
            disabled={isPlaying || moveHistory.length === 0}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium text-xs sm:text-sm hover:from-green-500 hover:to-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
          >
            <RotateCcw size={16} className="sm:w-[18px] sm:h-[18px]" />
            <span className="hidden xs:inline">Undo All</span>
            <span className="xs:hidden">Undo</span>
          </button>
          
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-white/10 text-white font-medium text-xs sm:text-sm hover:bg-white/20 transition-all"
          >
            <RotateCcw size={16} className="sm:w-[18px] sm:h-[18px]" />
            Reset
          </button>
        </div>
        
        {/* Manual Move Buttons - Camera-relative controls */}
        <div className="space-y-2 sm:space-y-3">
          <p className="text-xs sm:text-sm text-white/70 text-center font-semibold tracking-wide">Rotate a Face</p>
          
          {/* Face controls - uniform grid layout */}
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2 max-w-sm sm:max-w-md mx-auto">
            {[
              { direction: 'left', label: 'L', invert: true },
              { direction: 'right', label: 'R', invert: false },
              { direction: 'front', label: 'F', invert: false },
              { direction: 'top', label: 'U', invert: true },
              { direction: 'bottom', label: 'D', invert: false },
              { direction: 'back', label: 'B', invert: true },
            ].map(({ direction, label, invert }) => {
              const physicalFace = faceMapping[direction as VisualDirection]
              const colorMap: Record<PhysicalFace, string> = {
                U: 'bg-white',
                D: 'bg-yellow-400',
                F: 'bg-green-500',
                B: 'bg-blue-600',
                R: 'bg-red-600',
                L: 'bg-orange-500'
              }
              const color = colorMap[physicalFace]
              // For U, L, B faces the visual direction is inverted
              const ccwMove = invert ? physicalFace as Move : `${physicalFace}'` as Move
              const cwMove = invert ? `${physicalFace}'` as Move : physicalFace as Move
              return (
                <div key={direction} className="flex items-center h-10 sm:h-12 rounded-lg bg-white/5 border border-white/10 overflow-hidden">
                  {/* CCW button */}
                  <button
                    onClick={() => executeMove(ccwMove)}
                    disabled={isPlaying}
                    className="w-8 sm:w-10 h-full bg-slate-700 hover:bg-slate-600 text-white text-base sm:text-lg flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    title={`${physicalFace}' (counter-clockwise)`}
                  >
                    ↺
                  </button>
                  
                  {/* Face label with color */}
                  <div className="flex-1 h-full flex items-center justify-center gap-1.5 sm:gap-2 px-1.5 sm:px-2">
                    <div className={`w-4 sm:w-5 h-4 sm:h-5 rounded ${color} shadow-sm shrink-0`} />
                    <span className="text-xs sm:text-sm text-white font-bold">{label}</span>
                  </div>
                  
                  {/* CW button */}
                  <button
                    onClick={() => executeMove(cwMove)}
                    disabled={isPlaying}
                    className="w-8 sm:w-10 h-full bg-blue-600 hover:bg-blue-500 text-white text-base sm:text-lg flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    title={`${physicalFace} (clockwise)`}
                  >
                    ↻
                  </button>
                </div>
              )
            })}
          </div>
          
          <div className="flex justify-center">
            <span className="text-xs sm:text-sm text-white/70 font-semibold px-3 sm:px-4 py-1 sm:py-1.5 bg-white/10 rounded-lg">
              ↺ CCW · ↻ CW
            </span>
          </div>
        </div>
      </div>
      
      {/* Status Bar */}
      <div className="px-3 sm:px-4 py-1.5 sm:py-2 border-t border-white/10 bg-black/40 flex items-center justify-between text-[10px] sm:text-xs">
        <span className="text-white/40">
          {isSolving 
            ? 'Reversing moves...' 
            : isPlaying 
              ? 'Animating...' 
              : 'Ready - try to solve it!'}
        </span>
        <span className="text-white/40">
          {moveHistory.length} moves
        </span>
      </div>
    </div>
  )
}
