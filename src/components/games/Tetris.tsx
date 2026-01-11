import { useState, useEffect, useCallback, useRef } from 'react'
import { ChevronLeft, ChevronRight, ChevronDown, RotateCw, ChevronsDown, Gamepad2 } from 'lucide-react'

const BOARD_WIDTH = 10
const BOARD_HEIGHT = 20
const TICK_SPEED = 500

// Hook to detect mobile/tablet
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    const check = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window)
    }
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  
  return isMobile
}

// Hook to calculate cell size based on viewport
function useCellSize() {
  const [cellSize, setCellSize] = useState(20)
  
  useEffect(() => {
    const calculate = () => {
      const vh = window.innerHeight
      const vw = window.innerWidth
      const isMobile = vw < 768
      
      // Account for header, padding, controls, etc.
      // Mobile: header ~60px, stats ~50px, controls ~140px, touch controls ~140px, padding ~100px
      // Desktop: header ~80px, padding ~100px
      const reservedHeight = isMobile ? 490 : 250
      const availableHeight = vh - reservedHeight
      
      // Calculate cell size based on board height (20 cells)
      const cellFromHeight = Math.floor(availableHeight / BOARD_HEIGHT)
      
      // Also check width constraint (10 cells + side panel on desktop)
      const availableWidth = isMobile ? vw - 40 : (vw - 300) // side padding + side panel
      const cellFromWidth = Math.floor(availableWidth / BOARD_WIDTH)
      
      // Use the smaller of the two, with min/max bounds
      const calculated = Math.min(cellFromHeight, cellFromWidth)
      const bounded = Math.max(14, Math.min(calculated, isMobile ? 20 : 28))
      
      setCellSize(bounded)
    }
    
    calculate()
    window.addEventListener('resize', calculate)
    return () => window.removeEventListener('resize', calculate)
  }, [])
  
  return cellSize
}

type Cell = string | null
type Board = Cell[][]

const TETROMINOS = {
  I: { shape: [[1, 1, 1, 1]], color: '#00f0f0' },
  O: { shape: [[1, 1], [1, 1]], color: '#f0f000' },
  T: { shape: [[0, 1, 0], [1, 1, 1]], color: '#a000f0' },
  S: { shape: [[0, 1, 1], [1, 1, 0]], color: '#00f000' },
  Z: { shape: [[1, 1, 0], [0, 1, 1]], color: '#f00000' },
  J: { shape: [[1, 0, 0], [1, 1, 1]], color: '#0000f0' },
  L: { shape: [[0, 0, 1], [1, 1, 1]], color: '#f0a000' },
}

type TetrominoType = keyof typeof TETROMINOS

interface Piece {
  type: TetrominoType
  shape: number[][]
  color: string
  x: number
  y: number
}

const createEmptyBoard = (): Board => 
  Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(null))

const getRandomTetromino = (): TetrominoType => {
  const types = Object.keys(TETROMINOS) as TetrominoType[]
  return types[Math.floor(Math.random() * types.length)]
}

const createPiece = (type: TetrominoType): Piece => ({
  type,
  shape: TETROMINOS[type].shape.map(row => [...row]),
  color: TETROMINOS[type].color,
  x: Math.floor(BOARD_WIDTH / 2) - Math.floor(TETROMINOS[type].shape[0].length / 2),
  y: 0,
})

const rotateMatrix = (matrix: number[][]): number[][] => {
  const rows = matrix.length
  const cols = matrix[0].length
  const rotated: number[][] = []
  for (let c = 0; c < cols; c++) {
    const newRow: number[] = []
    for (let r = rows - 1; r >= 0; r--) {
      newRow.push(matrix[r][c])
    }
    rotated.push(newRow)
  }
  return rotated
}

export default function Tetris() {
  const [board, setBoard] = useState<Board>(createEmptyBoard)
  const [currentPiece, setCurrentPiece] = useState<Piece | null>(null)
  const [nextPiece, setNextPiece] = useState<TetrominoType>(getRandomTetromino)
  const [score, setScore] = useState(0)
  const [lines, setLines] = useState(0)
  const [level, setLevel] = useState(1)
  const [gameOver, setGameOver] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [showTouchControls, setShowTouchControls] = useState(true)
  const [isSoftDropping, setIsSoftDropping] = useState(false)
  const gameRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const isMobile = useIsMobile()
  const cellSize = useCellSize()

  const checkCollision = useCallback((piece: Piece, boardToCheck: Board, offsetX = 0, offsetY = 0): boolean => {
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          const newX = piece.x + x + offsetX
          const newY = piece.y + y + offsetY
          if (
            newX < 0 || 
            newX >= BOARD_WIDTH || 
            newY >= BOARD_HEIGHT ||
            (newY >= 0 && boardToCheck[newY][newX])
          ) {
            return true
          }
        }
      }
    }
    return false
  }, [])

  const mergePieceToBoard = useCallback((piece: Piece, boardToMerge: Board): Board => {
    const newBoard = boardToMerge.map(row => [...row])
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x] && piece.y + y >= 0) {
          newBoard[piece.y + y][piece.x + x] = piece.color
        }
      }
    }
    return newBoard
  }, [])

  const clearLines = useCallback((boardToClear: Board): { newBoard: Board; linesCleared: number } => {
    const newBoard = boardToClear.filter(row => row.some(cell => !cell))
    const linesCleared = BOARD_HEIGHT - newBoard.length
    while (newBoard.length < BOARD_HEIGHT) {
      newBoard.unshift(Array(BOARD_WIDTH).fill(null))
    }
    return { newBoard, linesCleared }
  }, [])

  const startGame = useCallback(() => {
    setBoard(createEmptyBoard())
    setCurrentPiece(createPiece(getRandomTetromino()))
    setNextPiece(getRandomTetromino())
    setScore(0)
    setLines(0)
    setLevel(1)
    setGameOver(false)
    setIsPaused(false)
    setIsPlaying(true)
    gameRef.current?.focus()
  }, [])

  const movePiece = useCallback((dx: number, dy: number) => {
    if (!currentPiece || gameOver || isPaused) return
    
    if (!checkCollision(currentPiece, board, dx, dy)) {
      setCurrentPiece(prev => prev ? { ...prev, x: prev.x + dx, y: prev.y + dy } : null)
    } else if (dy > 0) {
      // Piece landed - stop soft drop
      setIsSoftDropping(false)
      
      const mergedBoard = mergePieceToBoard(currentPiece, board)
      const { newBoard, linesCleared } = clearLines(mergedBoard)
      
      setBoard(newBoard)
      setLines(prev => prev + linesCleared)
      setScore(prev => prev + linesCleared * 100 * level + 10)
      
      if (linesCleared > 0 && (lines + linesCleared) % 10 === 0) {
        setLevel(prev => prev + 1)
      }
      
      const newPiece = createPiece(nextPiece)
      if (checkCollision(newPiece, newBoard)) {
        setGameOver(true)
        setIsPlaying(false)
      } else {
        setCurrentPiece(newPiece)
        setNextPiece(getRandomTetromino())
      }
    }
  }, [currentPiece, board, gameOver, isPaused, checkCollision, mergePieceToBoard, clearLines, nextPiece, level, lines])

  // Soft drop handlers - just set the flag, the game loop handles the speed
  const startSoftDrop = useCallback(() => {
    if (!currentPiece || gameOver || isPaused) return
    setIsSoftDropping(true)
  }, [currentPiece, gameOver, isPaused])

  const stopSoftDrop = useCallback(() => {
    setIsSoftDropping(false)
  }, [])

  const rotatePiece = useCallback(() => {
    if (!currentPiece || gameOver || isPaused) return
    
    const rotatedShape = rotateMatrix(currentPiece.shape)
    const rotatedPiece = { ...currentPiece, shape: rotatedShape }
    
    if (!checkCollision(rotatedPiece, board)) {
      setCurrentPiece(rotatedPiece)
    }
  }, [currentPiece, board, gameOver, isPaused, checkCollision])

  const dropPiece = useCallback(() => {
    if (!currentPiece || gameOver || isPaused) return
    
    let dropY = 0
    while (!checkCollision(currentPiece, board, 0, dropY + 1)) {
      dropY++
    }
    
    if (dropY > 0) {
      setCurrentPiece(prev => prev ? { ...prev, y: prev.y + dropY } : null)
    }
  }, [currentPiece, board, gameOver, isPaused, checkCollision])

  // Reset soft drop when game ends
  useEffect(() => {
    if (gameOver || !isPlaying) {
      setIsSoftDropping(false)
    }
  }, [gameOver, isPlaying])

  // Main game loop - faster when soft dropping
  useEffect(() => {
    if (!isPlaying || gameOver || isPaused) return
    
    const normalSpeed = Math.max(100, TICK_SPEED - (level - 1) * 50)
    const speed = isSoftDropping ? 50 : normalSpeed // Much faster when holding down
    const interval = setInterval(() => movePiece(0, 1), speed)
    return () => clearInterval(interval)
  }, [isPlaying, gameOver, isPaused, level, movePiece, isSoftDropping])

  // Handle audio playback
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying && !isPaused && !gameOver && !isMuted) {
      audio.play().catch(() => {
        // Autoplay may be blocked by browser
      })
    } else {
      audio.pause()
    }

    if (gameOver) {
      audio.currentTime = 0
    }
  }, [isPlaying, isPaused, gameOver, isMuted])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying) return
      
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault()
          movePiece(-1, 0)
          break
        case 'ArrowRight':
          e.preventDefault()
          movePiece(1, 0)
          break
        case 'ArrowDown':
          e.preventDefault()
          movePiece(0, 1)
          break
        case 'ArrowUp':
          e.preventDefault()
          rotatePiece()
          break
        case ' ':
          e.preventDefault()
          dropPiece()
          break
        case 'p':
        case 'P':
          e.preventDefault()
          setIsPaused(prev => !prev)
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isPlaying, movePiece, rotatePiece, dropPiece])

  const renderBoard = () => {
    const displayBoard = board.map(row => [...row])
    
    if (currentPiece) {
      for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
          if (currentPiece.shape[y][x]) {
            const boardY = currentPiece.y + y
            const boardX = currentPiece.x + x
            // Only render if within bounds
            if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
              displayBoard[boardY][boardX] = currentPiece.color
            }
          }
        }
      }
    }

    return displayBoard.map((row, y) => (
      <div key={y} className="flex">
        {row.map((cell, x) => (
          <div
            key={x}
            className="border border-[var(--color-border-subtle)]"
            style={{ 
              width: cellSize, 
              height: cellSize,
              backgroundColor: cell || 'var(--color-surface)' 
            }}
          />
        ))}
      </div>
    ))
  }

  const renderNextPiece = () => {
    const piece = TETROMINOS[nextPiece]
    const previewCellSize = Math.max(12, cellSize * 0.7) // Smaller preview cells
    return (
      <div className="flex flex-col items-center">
        {piece.shape.map((row, y) => (
          <div key={y} className="flex">
            {row.map((cell, x) => (
              <div
                key={x}
                className="border border-[var(--color-border-subtle)]"
                style={{ 
                  width: previewCellSize, 
                  height: previewCellSize,
                  backgroundColor: cell ? piece.color : 'transparent' 
                }}
              />
            ))}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div 
      ref={gameRef}
      tabIndex={0}
      className="flex flex-col items-center gap-2 sm:gap-4 p-3 sm:p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] outline-none"
    >
      <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Tetris</h3>
      
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 items-center">
        {/* Mobile: Stats row above board */}
        <div className="flex sm:hidden gap-2 justify-center">
          <div className="px-3 py-1.5 rounded-lg bg-[var(--color-surface-elevated)] border border-[var(--color-border-subtle)]">
            <p className="text-[10px] text-[var(--color-text-muted)] uppercase">Score</p>
            <p className="text-sm font-bold text-[var(--color-accent-primary)]">{score}</p>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-[var(--color-surface-elevated)] border border-[var(--color-border-subtle)]">
            <p className="text-[10px] text-[var(--color-text-muted)] uppercase">Lines</p>
            <p className="text-sm font-bold text-emerald-400">{lines}</p>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-[var(--color-surface-elevated)] border border-[var(--color-border-subtle)]">
            <p className="text-[10px] text-[var(--color-text-muted)] uppercase">Level</p>
            <p className="text-sm font-bold text-amber-400">{level}</p>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-[var(--color-surface-elevated)] border border-[var(--color-border-subtle)]">
            <p className="text-[10px] text-[var(--color-text-muted)] uppercase">Next</p>
            <div className="scale-75 origin-top">{renderNextPiece()}</div>
          </div>
        </div>

        {/* Game Board */}
        <div className="border-2 border-[var(--color-border)] rounded-lg overflow-hidden shadow-lg w-fit">
          {renderBoard()}
        </div>

        {/* Desktop: Side Panel */}
        <div className="hidden sm:flex flex-col gap-3 min-w-[110px]">
          <div className="p-3 rounded-xl bg-[var(--color-surface-elevated)] border border-[var(--color-border-subtle)]">
            <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wide mb-1">Score</p>
            <p className="text-xl font-bold text-[var(--color-accent-primary)]">{score}</p>
          </div>
          
          <div className="p-3 rounded-xl bg-[var(--color-surface-elevated)] border border-[var(--color-border-subtle)]">
            <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wide mb-1">Lines</p>
            <p className="text-xl font-bold text-emerald-400">{lines}</p>
          </div>
          
          <div className="p-3 rounded-xl bg-[var(--color-surface-elevated)] border border-[var(--color-border-subtle)]">
            <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wide mb-1">Level</p>
            <p className="text-xl font-bold text-amber-400">{level}</p>
          </div>

          <div className="p-3 rounded-xl bg-[var(--color-surface-elevated)] border border-[var(--color-border-subtle)]">
            <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wide mb-2">Next</p>
            {renderNextPiece()}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-2">
        {!isPlaying || gameOver ? (
          <button
            onClick={startGame}
            className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 !text-white font-semibold hover:from-emerald-600 hover:to-cyan-600 transition-all shadow-lg shadow-emerald-500/20 text-sm sm:text-base"
          >
            {gameOver ? 'Play Again' : 'Start Game'}
          </button>
        ) : (
          <button
            onClick={() => setIsPaused(prev => !prev)}
            className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-[var(--color-text-primary)] font-semibold hover:bg-[var(--color-border)] transition-colors text-sm sm:text-base"
          >
            {isPaused ? 'Resume' : 'Pause'}
          </button>
        )}
        <button
          onClick={() => setIsMuted(prev => !prev)}
          className="px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-xl bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-border)] transition-colors"
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 5L6 9H2v6h4l5 4V5z"/>
              <line x1="23" y1="9" x2="17" y2="15"/>
              <line x1="17" y1="9" x2="23" y2="15"/>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
            </svg>
          )}
        </button>
        {/* Touch controls toggle - always visible, disabled on desktop */}
        <button
          onClick={() => isMobile && setShowTouchControls(prev => !prev)}
          disabled={!isMobile}
          className={`px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-xl border transition-colors ${
            !isMobile
              ? 'bg-[var(--color-surface-elevated)] border-[var(--color-border)] text-[var(--color-text-muted)] opacity-50 cursor-not-allowed'
              : showTouchControls 
                ? 'bg-[var(--color-accent-primary)]/20 border-[var(--color-accent-primary)] text-[var(--color-accent-primary)]' 
                : 'bg-[var(--color-surface-elevated)] border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-border)]'
          }`}
          title={isMobile ? "Toggle touch controls" : "Touch controls (mobile only)"}
        >
          <Gamepad2 className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>
      </div>

      {/* Touch Controls - Gameboy style */}
      {isMobile && showTouchControls && isPlaying && !gameOver && (
        <div className="w-full flex justify-between items-center px-2 py-3 bg-[var(--color-surface-elevated)] rounded-xl border border-[var(--color-border-subtle)] select-none">
          {/* D-Pad */}
          <div className="relative w-28 h-28">
            {/* Up - empty for symmetry, could add hold piece later */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-10" />
            {/* Left */}
            <button
              type="button"
              onPointerDown={(e) => { e.preventDefault(); movePiece(-1, 0) }}
              className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg flex items-center justify-center active:bg-[var(--color-border)] active:scale-95 transition-all shadow-md select-none"
            >
              <ChevronLeft size={20} className="text-[var(--color-text-secondary)] pointer-events-none" />
            </button>
            {/* Right */}
            <button
              type="button"
              onPointerDown={(e) => { e.preventDefault(); movePiece(1, 0) }}
              className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg flex items-center justify-center active:bg-[var(--color-border)] active:scale-95 transition-all shadow-md select-none"
            >
              <ChevronRight size={20} className="text-[var(--color-text-secondary)] pointer-events-none" />
            </button>
            {/* Down (Soft drop) - hold to repeat */}
            <button
              type="button"
              onPointerDown={(e) => { e.preventDefault(); startSoftDrop() }}
              onPointerUp={stopSoftDrop}
              onPointerLeave={stopSoftDrop}
              onPointerCancel={stopSoftDrop}
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-10 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg flex items-center justify-center active:bg-[var(--color-border)] active:scale-95 transition-all shadow-md select-none"
            >
              <ChevronDown size={20} className="text-[var(--color-text-secondary)] pointer-events-none" />
            </button>
            {/* Center decoration */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[var(--color-border)] opacity-50" />
          </div>

          {/* Action Buttons - Rotate on top, Drop below */}
          <div className="flex flex-col items-center gap-3">
            {/* Rotate */}
            <div className="flex flex-col items-center gap-1">
              <span className="text-[10px] text-[var(--color-text-muted)] uppercase">Rotate</span>
              <button
                type="button"
                onPointerDown={(e) => { e.preventDefault(); rotatePiece() }}
                className="w-12 h-12 rounded-full bg-[var(--color-surface)] border-2 border-[var(--color-border)] flex items-center justify-center active:scale-95 active:bg-[var(--color-border)] transition-all shadow-md select-none"
              >
                <RotateCw size={20} className="text-[var(--color-text-secondary)] pointer-events-none" />
              </button>
            </div>
            {/* Hard Drop */}
            <div className="flex flex-col items-center gap-1">
              <span className="text-[10px] text-[var(--color-text-muted)] uppercase">Drop</span>
              <button
                type="button"
                onPointerDown={(e) => { e.preventDefault(); dropPiece() }}
                className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center active:scale-95 active:from-emerald-600 active:to-cyan-600 transition-all shadow-lg select-none"
              >
                <ChevronsDown size={24} className="text-white pointer-events-none" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Audio element */}
      <audio ref={audioRef} src="/audio/tetris-theme-korobeiniki.mp3" loop />

      {/* Game Over Overlay */}
      {gameOver && (
        <div className="text-center p-3 sm:p-4 rounded-xl bg-red-500/10 border border-red-500/30">
          <p className="text-base sm:text-lg font-bold text-red-400">Game Over!</p>
          <p className="text-xs sm:text-sm text-[var(--color-text-muted)]">Final Score: {score}</p>
        </div>
      )}

      {/* Instructions - hide on mobile when touch controls are shown */}
      {(!isMobile || !showTouchControls) && (
        <div className="text-[10px] sm:text-xs text-[var(--color-text-muted)] text-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-[var(--color-surface-elevated)] border border-[var(--color-border-subtle)]">
          <p>← → Move | ↑ Rotate | ↓ Soft Drop | Space Hard Drop | P Pause</p>
        </div>
      )}
    </div>
  )
}
