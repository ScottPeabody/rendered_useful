interface HeartAnimationProps {
  show: boolean;
  x?: number;
  y?: number;
}

export function HeartAnimation({ show, x = 50, y = 50 }: HeartAnimationProps) {
  return (
    <div
      className={`absolute pointer-events-none z-30 transition-all duration-700 ${
        show ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
      }`}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: `translate(-50%, -50%) ${show ? 'scale(1)' : 'scale(0.5)'}`,
      }}
    >
      <div className={`text-7xl ${show ? 'animate-bounce' : ''}`}>
        ❤️
      </div>
    </div>
  );
}
