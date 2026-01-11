import { useState, useEffect, useCallback, useRef } from 'react'

const BOARD_WIDTH = 10
const BOARD_HEIGHT = 20
const TICK_SPEED = 500

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
  const gameRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

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
      // Piece landed
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

  useEffect(() => {
    if (!isPlaying || gameOver || isPaused) return
    
    const speed = Math.max(100, TICK_SPEED - (level - 1) * 50)
    const interval = setInterval(() => movePiece(0, 1), speed)
    return () => clearInterval(interval)
  }, [isPlaying, gameOver, isPaused, level, movePiece])

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
          if (currentPiece.shape[y][x] && currentPiece.y + y >= 0) {
            displayBoard[currentPiece.y + y][currentPiece.x + x] = currentPiece.color
          }
        }
      }
    }

    return displayBoard.map((row, y) => (
      <div key={y} className="flex">
        {row.map((cell, x) => (
          <div
            key={x}
            className="w-5 h-5 sm:w-6 sm:h-6 border border-[var(--color-border-subtle)]"
            style={{ backgroundColor: cell || 'var(--color-surface)' }}
          />
        ))}
      </div>
    ))
  }

  const renderNextPiece = () => {
    const piece = TETROMINOS[nextPiece]
    return (
      <div className="flex flex-col items-center">
        {piece.shape.map((row, y) => (
          <div key={y} className="flex">
            {row.map((cell, x) => (
              <div
                key={x}
                className="w-4 h-4 border border-[var(--color-border-subtle)]"
                style={{ backgroundColor: cell ? piece.color : 'transparent' }}
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
      className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] outline-none"
    >
      <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Tetris</h3>
      
      <div className="flex gap-6">
        {/* Game Board */}
        <div className="border-2 border-[var(--color-border)] rounded-lg overflow-hidden shadow-lg">
          {renderBoard()}
        </div>

        {/* Side Panel */}
        <div className="flex flex-col gap-3 min-w-[110px]">
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
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 !text-white font-semibold hover:from-emerald-600 hover:to-cyan-600 transition-all shadow-lg shadow-emerald-500/20"
          >
            {gameOver ? 'Play Again' : 'Start Game'}
          </button>
        ) : (
          <button
            onClick={() => setIsPaused(prev => !prev)}
            className="px-6 py-2.5 rounded-xl bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-[var(--color-text-primary)] font-semibold hover:bg-[var(--color-border)] transition-colors"
          >
            {isPaused ? 'Resume' : 'Pause'}
          </button>
        )}
        <button
          onClick={() => setIsMuted(prev => !prev)}
          className="px-3 py-2.5 rounded-xl bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-border)] transition-colors"
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 5L6 9H2v6h4l5 4V5z"/>
              <line x1="23" y1="9" x2="17" y2="15"/>
              <line x1="17" y1="9" x2="23" y2="15"/>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
            </svg>
          )}
        </button>
      </div>

      {/* Audio element */}
      <audio ref={audioRef} src="/audio/tetris-theme-korobeiniki.mp3" loop />

      {/* Game Over Overlay */}
      {gameOver && (
        <div className="text-center p-4 rounded-xl bg-red-500/10 border border-red-500/30">
          <p className="text-lg font-bold text-red-400">Game Over!</p>
          <p className="text-sm text-[var(--color-text-muted)]">Final Score: {score}</p>
        </div>
      )}

      {/* Instructions */}
      <div className="text-xs text-[var(--color-text-muted)] text-center px-4 py-2 rounded-lg bg-[var(--color-surface-elevated)] border border-[var(--color-border-subtle)]">
        <p>← → Move | ↑ Rotate | ↓ Soft Drop | Space Hard Drop | P Pause</p>
      </div>
    </div>
  )
}
