import { useState, useEffect, useCallback, useRef } from 'react';

// KaTeX type declaration
declare global {
  interface Window {
    katex?: {
      renderToString: (tex: string, options?: { throwOnError?: boolean; displayMode?: boolean }) => string;
    };
  }
}

type GameState = 'idle' | 'playing' | 'finished' | 'loading';
type Topic = 'physics' | 'science' | 'history' | 'technology' | 'nature' | 'engineering' | 'art' | 'dictionary' | 'random' | 'custom' | 'math';

interface CharState {
  char: string;
  state: 'pending' | 'correct' | 'incorrect' | 'current';
}

interface WikiArticle {
  title: string;
  url: string;
  text: string;
  isMath?: boolean;
}

// Topic categories for Wikipedia - these are actual Wikipedia category names
const topicCategories: Record<Exclude<Topic, 'random' | 'math' | 'dictionary' | 'custom'>, string[]> = {
  physics: ['Physics', 'Quantum_mechanics', 'Classical_mechanics', 'Thermodynamics', 'Electromagnetism', 'Particle_physics', 'Astrophysics', 'Optics'],
  science: ['Chemistry', 'Biology', 'Astronomy', 'Biochemistry', 'Genetics', 'Ecology', 'Geology', 'Neuroscience'],
  history: ['Ancient_history', 'Medieval_history', 'Modern_history', 'Military_history', 'History_of_science', 'Ancient_Rome', 'Ancient_Greece', 'Renaissance'],
  technology: ['Computing', 'Computer_science', 'Software_engineering', 'Artificial_intelligence', 'Robotics', 'Internet', 'Telecommunications', 'Electronics'],
  nature: ['Mammals', 'Birds', 'Marine_biology', 'Botany', 'Forests', 'Mountains', 'Rivers', 'National_parks'],
  engineering: ['Civil_engineering', 'Mechanical_engineering', 'Aerospace_engineering', 'Electrical_engineering', 'Bridges', 'Skyscrapers', 'Dams', 'Tunnels'],
  art: ['Painting', 'Sculpture', 'Renaissance_art', 'Impressionism', 'Modern_art', 'Art_movements', 'Painters', 'Museums'],
};

// LaTeX equations for math mode
const mathEquations = [
  { latex: '\\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}', name: 'Quadratic Formula' },
  { latex: 'e^{i\\pi} + 1 = 0', name: "Euler's Identity" },
  { latex: '\\int_a^b f(x)\\,dx = F(b) - F(a)', name: 'Fundamental Theorem of Calculus' },
  { latex: 'E = mc^2', name: 'Mass-Energy Equivalence' },
  { latex: '\\sum_{n=1}^{\\infty} \\frac{1}{n^2} = \\frac{\\pi^2}{6}', name: 'Basel Problem' },
  { latex: '\\nabla \\cdot \\mathbf{E} = \\frac{\\rho}{\\epsilon_0}', name: "Gauss's Law" },
  { latex: 'F = G\\frac{m_1 m_2}{r^2}', name: 'Newton\'s Law of Gravitation' },
  { latex: '\\frac{\\partial^2 u}{\\partial t^2} = c^2 \\nabla^2 u', name: 'Wave Equation' },
  { latex: 'P(A|B) = \\frac{P(B|A)P(A)}{P(B)}', name: "Bayes' Theorem" },
  { latex: '\\oint_C \\mathbf{B} \\cdot d\\mathbf{l} = \\mu_0 I', name: "Ampère's Law" },
  { latex: 'a^2 + b^2 = c^2', name: 'Pythagorean Theorem' },
  { latex: '\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1', name: 'Sine Limit' },
  { latex: '\\det(A) = \\sum_{\\sigma} \\text{sgn}(\\sigma) \\prod_i a_{i,\\sigma(i)}', name: 'Determinant Formula' },
  { latex: '\\nabla \\times \\mathbf{E} = -\\frac{\\partial \\mathbf{B}}{\\partial t}', name: "Faraday's Law" },
  { latex: 'H = -\\sum_i p_i \\log p_i', name: 'Shannon Entropy' },
];

async function fetchWikipediaArticle(topic: Topic, customSearchTerm?: string): Promise<WikiArticle> {
  const fallback: WikiArticle = {
    title: 'Random Text',
    url: 'https://en.wikipedia.org',
    text: 'The quick brown fox jumps over the lazy dog. This is fallback text used when Wikipedia is unavailable.'
  };
  
  // Dictionary mode - fetch random words with definitions
  if (topic === 'dictionary') {
    try {
      // Get more random words to account for missing definitions (404s are expected)
      const wordResponse = await fetch('https://random-word-api.herokuapp.com/word?number=15');
      const words = await wordResponse.json();
      
      // Get definitions for each word (silently skip 404s)
      const definitions: string[] = [];
      for (const word of words) {
        if (definitions.length >= 4) break; // Stop once we have enough
        try {
          const defResponse = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
          if (defResponse.ok) {
            const defData = await defResponse.json();
            const meaning = defData[0]?.meanings?.[0]?.definitions?.[0]?.definition;
            if (meaning) {
              definitions.push(`${word}: ${meaning}`);
            }
          }
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (_) {
          // Skip words without definitions (expected for obscure words)
        }
      }
      
      if (definitions.length > 0) {
        return {
          title: 'Dictionary Words',
          url: 'https://en.wiktionary.org',
          text: definitions.join(' ')
        };
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      // Fall through to fallback
    }
    return fallback;
  }
  
  // Math mode - return a LaTeX equation
  if (topic === 'math') {
    const eq = mathEquations[Math.floor(Math.random() * mathEquations.length)];
    return {
      title: eq.name,
      url: 'https://en.wikipedia.org/wiki/List_of_mathematical_symbols',
      text: eq.latex,
      isMath: true
    };
  }

  // Custom topic - search Wikipedia for user's topic
  if (topic === 'custom' && customSearchTerm) {
    try {
      // Search Wikipedia for the custom topic
      const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(customSearchTerm)}&srlimit=10&format=json&origin=*`;
      const searchResult = await fetch(searchUrl);
      const searchData = await searchResult.json();
      
      if (searchData.query?.search?.length > 0) {
        // Pick a random result from top 10
        const randomResult = searchData.query.search[Math.floor(Math.random() * Math.min(searchData.query.search.length, 10))];
        const summaryResponse = await fetch(
          `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(randomResult.title)}`
        );
        const summaryData = await summaryResponse.json();
        
        let text = summaryData.extract || '';
        text = text
          .replace(/\([^)]*\)/g, '')
          .replace(/\[[^\]]*\]/g, '')
          .replace(/[^\w\s.,!?'-]/g, '')
          .replace(/\s+/g, ' ')
          .trim();
        
        if (text.length > 350) {
          text = text.substring(0, 400);
          const lastPeriod = text.lastIndexOf('. ');
          const lastQuestion = text.lastIndexOf('? ');
          const lastExclaim = text.lastIndexOf('! ');
          const lastSentence = Math.max(lastPeriod, lastQuestion, lastExclaim);
          
          if (lastSentence > 100) {
            text = text.substring(0, lastSentence + 1);
          } else {
            const lastSpace = text.lastIndexOf(' ');
            if (lastSpace > 250) {
              text = text.substring(0, lastSpace);
            }
          }
        }
        
        if (text.length >= 50) {
          return {
            title: summaryData.title || randomResult.title,
            url: summaryData.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(randomResult.title)}`,
            text
          };
        }
      }
       
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      // Fall through to fallback
    }
    return fallback;
  }
  
  try {
    let url: string;
    
    if (topic === 'random') {
      url = 'https://en.wikipedia.org/api/rest_v1/page/random/summary';
    } else {
      // Get articles from a Wikipedia category
      // Type assertion is safe here since dictionary, math, random, and custom are handled above
      const categories = topicCategories[topic as keyof typeof topicCategories];
      const category = categories[Math.floor(Math.random() * categories.length)];
      
      // Fetch pages from the category
      const categoryUrl = `https://en.wikipedia.org/w/api.php?action=query&list=categorymembers&cmtitle=Category:${encodeURIComponent(category)}&cmtype=page&cmlimit=50&format=json&origin=*`;
      const categoryResult = await fetch(categoryUrl);
      const categoryData = await categoryResult.json();
      
      if (categoryData.query?.categorymembers?.length > 0) {
        // Filter out category pages and pick a random article
        const articles = categoryData.query.categorymembers.filter(
          (m: { title: string }) => !m.title.startsWith('Category:') && !m.title.startsWith('List of')
        );
        
        if (articles.length > 0) {
          const randomArticle = articles[Math.floor(Math.random() * articles.length)];
          const summaryResponse = await fetch(
            `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(randomArticle.title)}`
          );
          const summaryData = await summaryResponse.json();
        
          let text = summaryData.extract || '';
          text = text
            .replace(/\([^)]*\)/g, '')
            .replace(/\[[^\]]*\]/g, '')
            .replace(/[^\w\s.,!?'-]/g, '')
            .replace(/\s+/g, ' ')
            .trim();
        
          if (text.length > 350) {
            text = text.substring(0, 400);
            const lastPeriod = text.lastIndexOf('. ');
            const lastQuestion = text.lastIndexOf('? ');
            const lastExclaim = text.lastIndexOf('! ');
            const lastSentence = Math.max(lastPeriod, lastQuestion, lastExclaim);
          
            if (lastSentence > 100) {
              text = text.substring(0, lastSentence + 1);
            } else {
              const lastSpace = text.lastIndexOf(' ');
              if (lastSpace > 250) {
                text = text.substring(0, lastSpace);
              }
            }
          }
        
          if (text.length >= 50) {
            return {
              title: summaryData.title || randomArticle.title,
              url: summaryData.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(randomArticle.title)}`,
              text
            };
          }
        }
      }
      
      // Fallback to random article data
      url = 'https://en.wikipedia.org/api/rest_v1/page/random/summary';
    }
    
    const response = await fetch(url);
    const data = await response.json();
    
    let text = data.extract || '';
    text = text
      .replace(/\([^)]*\)/g, '')
      .replace(/\[[^\]]*\]/g, '')
      .replace(/[^\w\s.,!?'-]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    
    if (text.length > 350) {
      text = text.substring(0, 400);
      // Find the last sentence boundary
      const lastPeriod = text.lastIndexOf('. ');
      const lastQuestion = text.lastIndexOf('? ');
      const lastExclaim = text.lastIndexOf('! ');
      const lastSentence = Math.max(lastPeriod, lastQuestion, lastExclaim);
      
      if (lastSentence > 100) {
        text = text.substring(0, lastSentence + 1);
      } else {
        // Fallback to word boundary if no sentence found
        const lastSpace = text.lastIndexOf(' ');
        if (lastSpace > 250) {
          text = text.substring(0, lastSpace);
        }
      }
    }
    
    if (text.length < 50) {
      return fallback;
    }
    
    return {
      title: data.title || 'Unknown',
      url: data.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(data.title)}`,
      text
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_) {
    return fallback;
  }
}

export default function TypingGame() {
  const [topic, setTopic] = useState<Topic>('physics');
  const [gameState, setGameState] = useState<GameState>('loading');
  const [article, setArticle] = useState<WikiArticle | null>(null);
  const [chars, setChars] = useState<CharState[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [correctChars, setCorrectChars] = useState(0);
  const [totalTyped, setTotalTyped] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; color: string }[]>([]);
  const [customTopic, setCustomTopic] = useState('');
  const [committedCustomTopic, setCommittedCustomTopic] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const audioContextRef = useRef<AudioContext | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Mechanical keyboard sound using Web Audio API (noise-based click)
  const playTypeSound = useCallback((isCorrect: boolean) => {
    if (!soundEnabled) return;
    
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    
    const ctx = audioContextRef.current;
    
    if (isCorrect) {
      // Deep thud sound for correct keystrokes
      const bufferSize = ctx.sampleRate * 0.12;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      
      for (let i = 0; i < bufferSize; i++) {
        const envelope = Math.exp(-i / (bufferSize * 0.35));
        data[i] = (Math.random() * 2 - 1) * envelope;
      }
      
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 150;
      
      const gainNode = ctx.createGain();
      gainNode.gain.value = 0.18;
      
      noise.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      noise.start();
    } else {
      // Higher thocky sound for errors
      const bufferSize = ctx.sampleRate * 0.06;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      
      for (let i = 0; i < bufferSize; i++) {
        const envelope = Math.exp(-i / (bufferSize * 0.25));
        data[i] = (Math.random() * 2 - 1) * envelope;
      }
      
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 500 + Math.random() * 150;
      filter.Q.value = 0.5;
      
      const lowpass = ctx.createBiquadFilter();
      lowpass.type = 'lowpass';
      lowpass.frequency.value = 800;
      
      const gainNode = ctx.createGain();
      gainNode.gain.value = 0.18;
      
      noise.connect(filter);
      filter.connect(lowpass);
      lowpass.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      noise.start();
    }
  }, [soundEnabled]);

  const initGame = useCallback(async () => {
    setGameState('loading');
    
    const newArticle = await fetchWikipediaArticle(topic, committedCustomTopic);
    setArticle(newArticle);
    
    setChars(newArticle.text.split('').map((char, i) => ({
      char,
      state: i === 0 ? 'current' : 'pending'
    })));
    setCurrentIndex(0);
    setStartTime(null);
    setEndTime(null);
    setWpm(0);
    setAccuracy(100);
    setCorrectChars(0);
    setTotalTyped(0);
    setStreak(0);
    setMaxStreak(0);
    setGameState('idle');
  }, [topic, committedCustomTopic]);

  // Initialize game on mount and topic change
  useEffect(() => {
    const loadInitialGame = async () => {
      setGameState('loading');
      try {
        const articleData = await fetchWikipediaArticle(topic, committedCustomTopic);
        setArticle(articleData);
        const initialChars: CharState[] = articleData.text.split('').map((char, i) => ({
          char,
          state: i === 0 ? 'current' : 'pending'
        }));
        setChars(initialChars);
        setCurrentIndex(0);
        setStartTime(null);
        setEndTime(null);
        setWpm(0);
        setAccuracy(100);
        setCorrectChars(0);
        setTotalTyped(0);
        setStreak(0);
        setMaxStreak(0);
        setGameState('idle');
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_) {
        setGameState('idle');
      }
    };
    loadInitialGame();
  }, [topic, committedCustomTopic]);

  const spawnParticles = (x: number, y: number, isCorrect: boolean) => {
    const colors = isCorrect 
      ? ['#22c55e', '#4ade80', '#86efac', '#10b981']
      : ['#ef4444', '#f87171', '#fca5a5'];
    
    const newParticles = Array.from({ length: isCorrect ? 8 : 4 }, (_, i) => ({
      id: Date.now() + i,
      x: x + (Math.random() - 0.5) * 20,
      y: y + (Math.random() - 0.5) * 20,
      color: colors[Math.floor(Math.random() * colors.length)]
    }));
    
    setParticles(prev => [...prev, ...newParticles]);
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
    }, 600);
  };

  // Process a single character input (works for both desktop and mobile)
  const processChar = useCallback((key: string) => {
    if (gameState === 'finished' || gameState === 'loading') return;
    
    if (gameState === 'idle') {
      setGameState('playing');
      setStartTime(Date.now());
    }

    const expectedChar = chars[currentIndex]?.char;
    if (!expectedChar) return;
    
    const isCorrect = key === expectedChar;
    
    // Play typewriter sound
    playTypeSound(isCorrect);
    
    // Get position for particles
    const charElements = containerRef.current?.querySelectorAll('.char');
    const currentCharEl = charElements?.[currentIndex] as HTMLElement;
    if (currentCharEl) {
      const rect = currentCharEl.getBoundingClientRect();
      const containerRect = containerRef.current?.getBoundingClientRect();
      if (containerRect) {
        spawnParticles(
          rect.left - containerRect.left + rect.width / 2,
          rect.top - containerRect.top + rect.height / 2,
          isCorrect
        );
      }
    }
    
    // Auto-scroll: scroll the next character into view
    const nextCharEl = charElements?.[currentIndex + 1] as HTMLElement;
    if (nextCharEl && textContainerRef.current) {
      const textContainer = textContainerRef.current;
      const nextRect = nextCharEl.getBoundingClientRect();
      const containerRect = textContainer.getBoundingClientRect();
      
      // If next char is below the middle of container, scroll
      const relativeTop = nextRect.top - containerRect.top;
      if (relativeTop > containerRect.height * 0.6) {
        textContainer.scrollBy({
          top: nextRect.height * 2,
          behavior: 'smooth'
        });
      }
    }

    const newChars = [...chars];
    newChars[currentIndex] = {
      ...newChars[currentIndex],
      state: isCorrect ? 'correct' : 'incorrect'
    };

    if (currentIndex + 1 < chars.length) {
      newChars[currentIndex + 1] = { ...newChars[currentIndex + 1], state: 'current' };
    }

    setChars(newChars);
    setCurrentIndex(currentIndex + 1);
    setTotalTyped(totalTyped + 1);

    if (isCorrect) {
      setCorrectChars(correctChars + 1);
      setStreak(streak + 1);
      setMaxStreak(Math.max(maxStreak, streak + 1));
    } else {
      setStreak(0);
    }

    // Update stats
    const elapsed = (Date.now() - (startTime || Date.now())) / 1000 / 60;
    if (elapsed > 0) {
      const words = (correctChars + (isCorrect ? 1 : 0)) / 5;
      setWpm(Math.round(words / elapsed));
    }
    setAccuracy(Math.round(((correctChars + (isCorrect ? 1 : 0)) / (totalTyped + 1)) * 100));

    // Check if finished
    if (currentIndex + 1 >= chars.length) {
      setEndTime(Date.now());
      setGameState('finished');
    }
  }, [gameState, chars, currentIndex, playTypeSound, startTime, correctChars, totalTyped, streak, maxStreak]);

  // Handle backspace
  const handleBackspace = useCallback(() => {
    if (currentIndex > 0) {
      const newChars = [...chars];
      newChars[currentIndex] = { ...newChars[currentIndex], state: 'pending' };
      newChars[currentIndex - 1] = { ...newChars[currentIndex - 1], state: 'current' };
      setChars(newChars);
      setCurrentIndex(currentIndex - 1);
      setStreak(0);
    }
  }, [chars, currentIndex]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (gameState === 'finished') {
      if (e.key === 'Enter') {
        initGame();
      }
      return;
    }

    if (e.key === 'Backspace') {
      e.preventDefault();
      handleBackspace();
      return;
    }

    // For desktop, handle single character keys
    if (e.key.length === 1) {
      e.preventDefault();
      processChar(e.key);
    }
  };

  // Handle mobile input via onInput event
  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const value = target.value;
    
    if (value.length > 0) {
      // Process the last character typed
      const lastChar = value[value.length - 1];
      processChar(lastChar);
    }
    
    // Clear the input so we can detect the next character
    target.value = '';
  };

  const focusInput = () => {
    inputRef.current?.focus();
  };

  useEffect(() => {
    focusInput();
  }, []);

  const getCharClass = (state: CharState['state']) => {
    switch (state) {
      case 'correct':
        return 'text-emerald-400';
      case 'incorrect':
        return 'text-red-400 bg-red-500/20';
      case 'current':
        return 'text-white bg-indigo-500/50 animate-pulse';
      default:
        return 'text-zinc-500';
    }
  };

  const finalWpm = endTime && startTime 
    ? Math.round((correctChars / 5) / ((endTime - startTime) / 1000 / 60))
    : 0;

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          WikiType
        </h1>
        <p className="text-zinc-400">Learn something new while you practice typing</p>
      </div>

      {/* Topic Selector */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {(['physics', 'science', 'history', 'technology', 'nature', 'engineering', 'art'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTopic(t)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              topic === t
                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'
            }`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
        {/* Random */}
        <button
          onClick={() => setTopic('random')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
            topic === 'random'
              ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
              : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'
          }`}
        >
          Random
        </button>
        {/* Custom Topic Input */}
        <div className="flex items-center rounded-lg border border-zinc-700 overflow-hidden focus-within:border-indigo-500 transition-colors">
          <input
            type="text"
            id="custom-topic"
            name="custom-topic"
            value={customTopic}
            onChange={(e) => setCustomTopic(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && customTopic.trim()) {
                setCommittedCustomTopic(customTopic.trim());
                setTopic('custom');
              }
            }}
            placeholder="Your topic..."
            className="px-3 py-1.5 text-sm bg-zinc-800 text-zinc-300 focus:outline-none w-28"
          />
          <button
            onClick={() => {
              if (customTopic.trim()) {
                setCommittedCustomTopic(customTopic.trim());
                setTopic('custom');
              }
            }}
            disabled={!customTopic.trim()}
            className={`px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
              topic === 'custom'
                ? 'bg-indigo-500 text-white'
                : customTopic.trim()
                  ? 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
                  : 'bg-zinc-700 text-zinc-500 cursor-not-allowed'
            }`}
          >
            Go
          </button>
        </div>
        {/* Dictionary - Green */}
        <button
          onClick={() => setTopic('dictionary')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
            topic === 'dictionary'
              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
              : 'bg-emerald-900/50 text-emerald-400 hover:bg-emerald-800/50 hover:text-emerald-300 border border-emerald-700/50'
          }`}
        >
          Dictionary
        </button>
        {/* LaTeX - Pink/Purple */}
        <button
          onClick={() => setTopic('math')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
            topic === 'math'
              ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/30'
              : 'bg-pink-900/50 text-pink-400 hover:bg-pink-800/50 hover:text-pink-300 border border-pink-700/50'
          }`}
        >
          LaTeX
        </button>
      </div>

      {/* Article/Equation Title */}
      {article && gameState !== 'loading' && (
        <div className="flex items-center justify-center gap-3 mb-6">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-1.5 rounded-md text-sm transition-all duration-200 ${
              soundEnabled
                ? 'bg-sky-900/40 text-sky-400 hover:bg-sky-800/50'
                : 'bg-zinc-800/50 text-zinc-600 hover:text-zinc-500 hover:bg-zinc-800'
            }`}
            title={soundEnabled ? 'Sound On' : 'Sound Off'}
          >
            {soundEnabled ? '🔊' : '🔇'}
          </button>
          <div>
            <span className="text-zinc-500 text-sm">
              {article.isMath ? 'Equation: ' : 'Now typing: '}
            </span>
            <a 
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 font-medium hover:text-indigo-300 hover:underline transition-colors"
            >
              {article.title} ↗
            </a>
          </div>
        </div>
      )}

      {/* Stats Bar */}
      <div className="grid grid-cols-4 gap-2 sm:gap-4 mb-8">
        {[
          { label: 'WPM', value: gameState === 'finished' ? finalWpm : wpm, color: 'indigo' },
          { label: 'Acc', value: `${accuracy}%`, color: 'emerald' },
          { label: 'Streak', value: streak, color: 'amber' },
          { label: 'Best', value: maxStreak, color: 'purple' }
        ].map(({ label, value, color }) => (
          <div
            key={label}
            className={`bg-zinc-800/50 rounded-xl p-2 sm:p-4 border border-zinc-700/50 backdrop-blur-sm`}
          >
            <div className={`text-lg sm:text-3xl font-bold text-${color}-400`}>{value}</div>
            <div className="text-zinc-500 text-xs sm:text-sm">{label}</div>
          </div>
        ))}
      </div>

      {/* Game Area */}
      <div
        ref={containerRef}
        onClick={focusInput}
        className="relative bg-zinc-900/80 rounded-2xl p-8 border border-zinc-700/50 backdrop-blur-sm cursor-text min-h-[200px] overflow-hidden"
      >
        {/* Particles */}
        {particles.map(particle => (
          <div
            key={particle.id}
            className="absolute w-2 h-2 rounded-full pointer-events-none animate-ping"
            style={{
              left: particle.x,
              top: particle.y,
              backgroundColor: particle.color,
              animation: 'particle 0.6s ease-out forwards'
            }}
          />
        ))}

        {/* Hidden Input - positioned off-screen but still focusable for mobile keyboards */}
        <input
          ref={inputRef}
          type="text"
          id="typing-input"
          name="typing-input"
          className="absolute -left-[9999px] opacity-0"
          style={{ fontSize: '16px' }} // Prevents iOS zoom on focus
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          autoFocus
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          aria-label="Typing input field"
        />

        {/* Text Display */}
        {gameState === 'loading' ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <div className="text-zinc-400">
                {topic === 'math' ? 'Loading equation...' : 'Loading Wikipedia article...'}
              </div>
            </div>
          </div>
        ) : gameState === 'finished' ? (
          <div className="text-center py-8">
            <div className="text-6xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              {finalWpm} WPM
            </div>
            <div className="text-xl text-zinc-400 mb-2">
              {accuracy}% accuracy • {maxStreak} best streak
            </div>
            <div className="text-zinc-500 mb-6">
              {correctChars} / {chars.length} characters correct
            </div>
            
            {article && (
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mb-6 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-indigo-400 rounded-lg transition-colors"
              >
                {article.isMath ? `Learn about ${article.title}` : `Read more about ${article.title}`} →
              </a>
            )}
            
            <div>
              <button
                onClick={initGame}
                className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl font-semibold text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all duration-200 hover:scale-105"
              >
                {topic === 'math' ? 'Next Equation' : 'Next Article'}
              </button>
              <p className="text-zinc-600 mt-4 text-sm">or press Enter</p>
            </div>
          </div>
        ) : (
          <>
            {/* LaTeX render for math mode */}
            {article?.isMath && (
              <div className="mb-6 p-4 bg-zinc-800/50 rounded-xl border border-zinc-700/50">
                <div className="text-xs text-zinc-500 mb-2 uppercase tracking-wide">Equation:</div>
                <div 
                  className="text-2xl text-center text-white overflow-x-auto py-2"
                  dangerouslySetInnerHTML={{ 
                    __html: (() => {
                      try {
                        if (typeof window !== 'undefined' && window.katex) {
                          const fullEquation = chars.map(c => c.char).join('');
                          return window.katex.renderToString(fullEquation, { 
                            throwOnError: false,
                            displayMode: true 
                          });
                        }
                        return '';
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                      } catch (_) {
                        return '';
                      }
                    })()
                  }}
                />
              </div>
            )}
            
            {/* Math mode hint */}
            {article?.isMath && gameState === 'idle' && (
              <div className="mb-4 text-center">
                <span className="inline-block px-3 py-1 bg-amber-500/20 text-amber-400 rounded-lg text-sm">
                  💡 Type the LaTeX syntax exactly as shown
                </span>
              </div>
            )}
            
            <div 
              ref={textContainerRef}
              className={`font-mono leading-relaxed tracking-wide flex flex-wrap max-h-[250px] overflow-y-auto ${
              article?.isMath ? 'text-3xl justify-center' : 'text-2xl'
            }`}>
              {(() => {
                // Group chars into words (split by spaces)
                const words: { chars: typeof chars; startIndex: number }[] = [];
                let currentWord: typeof chars = [];
                let wordStartIndex = 0;
                
                chars.forEach((char, i) => {
                  if (char.char === ' ') {
                    if (currentWord.length > 0) {
                      words.push({ chars: currentWord, startIndex: wordStartIndex });
                    }
                    words.push({ chars: [char], startIndex: i });
                    currentWord = [];
                    wordStartIndex = i + 1;
                  } else {
                    currentWord.push(char);
                  }
                });
                if (currentWord.length > 0) {
                  words.push({ chars: currentWord, startIndex: wordStartIndex });
                }
                
                return words.map((word, wordIdx) => (
                  <span key={wordIdx} className={word.chars[0]?.char === ' ' ? '' : 'whitespace-nowrap'}>
                    {word.chars.map((char, charIdx) => (
                      <span
                        key={word.startIndex + charIdx}
                        className={`char transition-colors duration-100 ${getCharClass(char.state)} ${
                          char.char === ' ' ? 'w-3' : ''
                        }`}
                      >
                        {char.char === ' ' ? '\u00A0' : char.char}
                      </span>
                    ))}
                  </span>
                ));
              })()}
            </div>

            {gameState === 'idle' && (
              <div className="mt-6 text-center">
                <div className="text-lg text-zinc-400">Start typing to begin</div>
              </div>
            )}
          </>
        )}

        {/* Progress Bar */}
        {gameState === 'playing' && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-800">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-100"
              style={{ width: `${(currentIndex / chars.length) * 100}%` }}
            />
          </div>
        )}
      </div>

      {/* Streak Indicator */}
      {streak >= 5 && gameState === 'playing' && (
        <div className="mt-4 text-center">
          <span className={`inline-block px-4 py-2 rounded-full font-bold ${
            streak >= 20 ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white animate-pulse' :
            streak >= 10 ? 'bg-amber-500/20 text-amber-400' :
            'bg-emerald-500/20 text-emerald-400'
          }`}>
            🔥 {streak} streak!
          </span>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-8 text-center text-zinc-500 text-sm">
        <p>Type the text above as fast and accurately as you can</p>
      </div>

      {/* Custom Animation Styles */}
      <style>{`
        @keyframes particle {
          0% {
            transform: scale(1) translate(0, 0);
            opacity: 1;
          }
          100% {
            transform: scale(0) translate(var(--tx, 20px), var(--ty, -30px));
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
