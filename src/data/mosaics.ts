import type {
  Mosaic,
  MosaicAuthor,
  MosaicTag,
  MosaicCommunity,
  MosaicComment,
  PostContent,
  ImageContent,
  QuoteContent,
  CodeContent,
  GalleryContent,
  VideoContent,
  PollContent,
  ArticlePreviewContent,
  ProjectSpotlightContent,
  NotebookCellContent,
  CollageContent,
  DiagramContent,
  ThreadContent,
} from '../types/mosaic';

// Mock authors with real avatars
export const mockAuthors: MosaicAuthor[] = [
  {
    id: '1',
    username: 'speabody',
    displayName: 'Scott Peabody',
    avatarUrl: '/images/avatars/speabody.jpg',
  },
  {
    id: '2',
    username: 'devninja',
    displayName: 'Dev Ninja',
    avatarUrl: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=100&h=100&fit=crop',
  },
  {
    id: '3',
    username: 'codewitch',
    displayName: 'Code Witch',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
  },
];

// Mock tags
export const mockTags: MosaicTag[] = [
  { id: '1', name: 'React', slug: 'react' },
  { id: '2', name: 'TypeScript', slug: 'typescript' },
  { id: '3', name: 'Python', slug: 'python' },
  { id: '4', name: 'Web Dev', slug: 'web-dev' },
  { id: '5', name: 'Tutorial', slug: 'tutorial' },
  { id: '6', name: 'Design', slug: 'design' },
];

// Mock communities
export const mockCommunities: MosaicCommunity[] = [
  { id: '1', name: 'Frontend Devs', slug: 'frontend-devs' },
  { id: '2', name: 'Data Science', slug: 'data-science' },
  { id: '3', name: 'Creative Coding', slug: 'creative-coding' },
];

// Mock comments
export const mockComments: MosaicComment[] = [
  {
    id: 'c1',
    mosaicId: '1',
    author: mockAuthors[1],
    content: 'This is so cool! 🔥',
    createdAt: '2026-01-24T10:00:00Z',
    updatedAt: '2026-01-24T10:00:00Z',
  },
  {
    id: 'c2',
    mosaicId: '1',
    author: mockAuthors[2],
    content: 'Love the design!',
    createdAt: '2026-01-24T11:30:00Z',
    updatedAt: '2026-01-24T11:30:00Z',
  },
  {
    id: 'c3',
    mosaicId: '2',
    author: mockAuthors[0],
    content: 'Great quote, really resonates.',
    createdAt: '2026-01-23T15:00:00Z',
    updatedAt: '2026-01-23T15:00:00Z',
  },
];

// Sample mosaics
export const mockMosaics: Mosaic[] = [
  // Post mosaic - Vibrant announcement
  {
    id: '1',
    author: mockAuthors[0],
    type: 'post',
    content: {
      text: 'Just shipped a new feature! 🚀\n\nMosaics are full-screen, swipeable content cards.\n\nThink TikTok meets MDX.',
      fontSize: 'xl',
      alignment: 'center',
    } as PostContent,
    background: {
      type: 'gradient',
      from: '#667eea',
      to: '#f093fb',
      direction: 'to-br',
    },
    theme: 'dark',
    tags: [mockTags[0], mockTags[1]],
    communities: [mockCommunities[0]],
    viewCount: 1234,
    likeCount: 89,
    commentCount: 12,
    shareCount: 5,
    isLiked: false,
    isPublished: true,
    isFeatured: true,
    publishedAt: '2026-01-24T09:00:00Z',
    createdAt: '2026-01-24T08:00:00Z',
    updatedAt: '2026-01-24T09:00:00Z',
  },

  // Quote mosaic - Dark dramatic
  {
    id: '2',
    author: mockAuthors[1],
    type: 'quote',
    content: {
      text: 'The best way to predict the future is to invent it.',
      author: 'Alan Kay',
      source: 'Xerox PARC, 1971',
      style: 'large',
    } as QuoteContent,
    background: {
      type: 'gradient',
      from: '#0f0c29',
      to: '#302b63',
      direction: 'to-br',
    },
    theme: 'dark',
    tags: [mockTags[4]],
    viewCount: 567,
    likeCount: 45,
    commentCount: 3,
    shareCount: 12,
    isLiked: true,
    isPublished: true,
    isFeatured: false,
    publishedAt: '2026-01-23T14:00:00Z',
    createdAt: '2026-01-23T13:00:00Z',
    updatedAt: '2026-01-23T14:00:00Z',
  },

  // Image mosaic - Real photo
  {
    id: '3',
    author: mockAuthors[2],
    type: 'image',
    content: {
      url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=2000&fit=crop',
      alt: 'Coding at sunset with a beautiful view',
      caption: 'My favorite coding spot ✨',
      fit: 'cover',
    } as ImageContent,
    theme: 'dark',
    tags: [mockTags[5]],
    communities: [mockCommunities[2]],
    viewCount: 2341,
    likeCount: 234,
    commentCount: 28,
    shareCount: 15,
    isLiked: false,
    isPublished: true,
    isFeatured: true,
    publishedAt: '2026-01-22T18:00:00Z',
    createdAt: '2026-01-22T17:00:00Z',
    updatedAt: '2026-01-22T18:00:00Z',
  },

  // Code mosaic - GitHub dark style
  {
    id: '4',
    author: mockAuthors[0],
    type: 'code',
    content: {
      code: `// Quick tip: Custom hooks are powerful! 🎣

function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initial;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}`,
      language: 'typescript',
      filename: 'useLocalStorage.ts',
      highlightLines: [3, 4, 5],
    } as CodeContent,
    background: {
      type: 'gradient',
      from: '#0d1117',
      to: '#161b22',
      direction: 'to-b',
    },
    theme: 'dark',
    tags: [mockTags[0], mockTags[1], mockTags[4]],
    communities: [mockCommunities[0]],
    linkedArticleSlug: 'building-code-playground',
    viewCount: 892,
    likeCount: 67,
    commentCount: 8,
    shareCount: 23,
    isLiked: false,
    isPublished: true,
    isFeatured: false,
    publishedAt: '2026-01-21T12:00:00Z',
    createdAt: '2026-01-21T11:00:00Z',
    updatedAt: '2026-01-21T12:00:00Z',
  },

  // Gallery mosaic - Real design images
  {
    id: '5',
    author: mockAuthors[1],
    type: 'gallery',
    content: {
      images: [
        { url: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=800&fit=crop', alt: 'Design iteration 1', caption: 'First draft' },
        { url: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&fit=crop', alt: 'Design iteration 2', caption: 'Getting closer' },
        { url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&fit=crop', alt: 'Design iteration 3', caption: 'Final design! 🎉' },
      ],
      transition: 'slide',
    } as GalleryContent,
    background: {
      type: 'gradient',
      from: '#1a1a2e',
      to: '#16213e',
      direction: 'to-b',
    },
    theme: 'dark',
    tags: [mockTags[5]],
    viewCount: 1567,
    likeCount: 123,
    commentCount: 15,
    shareCount: 8,
    isLiked: false,
    isPublished: true,
    isFeatured: false,
    publishedAt: '2026-01-20T16:00:00Z',
    createdAt: '2026-01-20T15:00:00Z',
    updatedAt: '2026-01-20T16:00:00Z',
  },

  // Video mosaic - Real poster
  {
    id: '6',
    author: mockAuthors[2],
    type: 'video',
    content: {
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      poster: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&fit=crop',
      autoplay: false,
      loop: true,
      muted: true,
    } as VideoContent,
    background: {
      type: 'solid',
      color: '#000000',
    },
    theme: 'dark',
    tags: [mockTags[3]],
    communities: [mockCommunities[2]],
    viewCount: 4521,
    likeCount: 345,
    commentCount: 42,
    shareCount: 67,
    isLiked: true,
    isPublished: true,
    isFeatured: true,
    publishedAt: '2026-01-19T20:00:00Z',
    createdAt: '2026-01-19T19:00:00Z',
    updatedAt: '2026-01-19T20:00:00Z',
    durationSeconds: 30,
  },

  // Poll mosaic - Pink/purple gradient
  {
    id: '7',
    author: mockAuthors[0],
    type: 'poll',
    content: {
      question: 'What should I build next?',
      options: ['AI Code Assistant', 'Music Visualizer', 'Collaborative Whiteboard', '3D Game Engine'],
      allowMultiple: false,
      votes: [45, 32, 28, 15],
      totalVotes: 120,
      userVote: null,
    } as PollContent,
    background: {
      type: 'gradient',
      from: '#ec4899',
      to: '#8b5cf6',
      direction: 'to-br',
    },
    theme: 'dark',
    viewCount: 678,
    likeCount: 34,
    commentCount: 56,
    shareCount: 4,
    isLiked: false,
    isPublished: true,
    isFeatured: false,
    publishedAt: '2026-01-18T10:00:00Z',
    createdAt: '2026-01-18T09:00:00Z',
    updatedAt: '2026-01-18T10:00:00Z',
  },

  // Another post with different style - background image
  {
    id: '8',
    author: mockAuthors[2],
    type: 'post',
    content: {
      text: '💡 Pro tip:\n\nUse CSS `scroll-snap-type` for smooth, native-feeling scroll experiences.\n\nNo JavaScript needed!',
      fontSize: 'xl',
      alignment: 'left',
    } as PostContent,
    background: {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200',
      blur: 3,
      overlay: 'rgba(0,0,0,0.65)',
    },
    theme: 'dark',
    tags: [mockTags[3], mockTags[4]],
    viewCount: 445,
    likeCount: 78,
    commentCount: 5,
    shareCount: 19,
    isLiked: false,
    isPublished: true,
    isFeatured: false,
    publishedAt: '2026-01-17T14:00:00Z',
    createdAt: '2026-01-17T13:00:00Z',
    updatedAt: '2026-01-17T14:00:00Z',
  },

  // Article Preview mosaic - Rich preview
  {
    id: '9',
    author: mockAuthors[0],
    type: 'article-preview',
    content: {
      slug: 'building-tetris-in-react',
      title: 'Building Tetris in React: A Step-by-Step Guide',
      excerpt: 'Learn how to build a fully functional Tetris game using React hooks, including game state management, collision detection, and keyboard controls.',
      coverImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&fit=crop',
      showImage: true,
    } as ArticlePreviewContent,
    background: {
      type: 'gradient',
      from: '#1e3a5f',
      to: '#0f172a',
      direction: 'to-b',
    },
    theme: 'dark',
    tags: [mockTags[0], mockTags[4]],
    communities: [mockCommunities[0]],
    viewCount: 892,
    likeCount: 156,
    commentCount: 23,
    shareCount: 45,
    isLiked: false,
    isPublished: true,
    isFeatured: true,
    publishedAt: '2026-01-25T10:00:00Z',
    createdAt: '2026-01-25T09:00:00Z',
    updatedAt: '2026-01-25T10:00:00Z',
  },

  // Project Spotlight mosaic - Game showcase
  {
    id: '10',
    author: mockAuthors[0],
    type: 'project-spotlight',
    content: {
      slug: 'tetris-react',
      title: 'Tetris in React',
      description: 'A classic Tetris game built with React and TypeScript. Features smooth animations, keyboard controls, and responsive design.',
      thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&fit=crop',
      showDemo: true,
      demoUrl: '/projects/tetris-react',
    } as ProjectSpotlightContent,
    background: {
      type: 'gradient',
      from: '#7c3aed',
      to: '#06b6d4',
      direction: 'to-br',
    },
    theme: 'dark',
    tags: [mockTags[0], mockTags[1]],
    communities: [mockCommunities[0], mockCommunities[2]],
    viewCount: 1567,
    likeCount: 234,
    commentCount: 18,
    shareCount: 67,
    isLiked: true,
    isPublished: true,
    isFeatured: true,
    publishedAt: '2026-01-26T08:00:00Z',
    createdAt: '2026-01-26T07:00:00Z',
    updatedAt: '2026-01-26T08:00:00Z',
  },

  // Notebook Cell mosaic - Data viz
  {
    id: '11',
    author: mockAuthors[0],
    type: 'notebook-cell',
    content: {
      notebookPath: 'numpy-fundamentals.ipynb',
      cellIndex: 3,
      showCode: true,
      showOutput: true,
      outputSnapshot: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&fit=crop',
    } as NotebookCellContent,
    background: {
      type: 'gradient',
      from: '#1e1e1e',
      to: '#2d2d2d',
      direction: 'to-b',
    },
    theme: 'dark',
    tags: [mockTags[2]],
    communities: [mockCommunities[1]],
    viewCount: 456,
    likeCount: 67,
    commentCount: 8,
    shareCount: 12,
    isLiked: false,
    isPublished: true,
    isFeatured: false,
    publishedAt: '2026-01-24T16:00:00Z',
    createdAt: '2026-01-24T15:00:00Z',
    updatedAt: '2026-01-24T16:00:00Z',
  },

  // Collage mosaic - Weekend vibes
  {
    id: '12',
    author: mockAuthors[1],
    type: 'collage',
    content: {
      layout: '2x2',
      items: [
        {
          type: 'image',
          content: {
            url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&fit=crop',
            alt: 'Coding setup',
          } as ImageContent,
        },
        {
          type: 'text',
          content: {
            text: 'Weekend vibes 🎉',
            fontSize: 'md',
            alignment: 'center',
          } as PostContent,
        },
        {
          type: 'image',
          content: {
            url: 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=400&fit=crop',
            alt: 'Coffee and code',
          } as ImageContent,
        },
        {
          type: 'image',
          content: {
            url: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&fit=crop',
            alt: 'Monitor with code',
          } as ImageContent,
        },
      ],
    } as CollageContent,
    background: {
      type: 'gradient',
      from: '#0f0f0f',
      to: '#1a1a1a',
      direction: 'to-b',
    },
    theme: 'dark',
    tags: [mockTags[5]],
    communities: [mockCommunities[2]],
    viewCount: 892,
    likeCount: 156,
    commentCount: 23,
    shareCount: 45,
    isLiked: true,
    isPublished: true,
    isFeatured: true,
    publishedAt: '2026-01-25T09:00:00Z',
    createdAt: '2026-01-25T08:00:00Z',
    updatedAt: '2026-01-25T09:00:00Z',
  },

  // Diagram mosaic (Mermaid)
  {
    id: '13',
    author: mockAuthors[0],
    type: 'diagram',
    content: {
      type: 'mermaid',
      content: `flowchart TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> B`,
      interactive: true,
    } as DiagramContent,
    background: {
      type: 'gradient',
      from: '#0f2027',
      to: '#2c5364',
    },
    theme: 'dark',
    tags: [mockTags[4]],
    communities: [mockCommunities[0]],
    viewCount: 234,
    likeCount: 45,
    commentCount: 7,
    shareCount: 18,
    isLiked: false,
    isPublished: true,
    isFeatured: false,
    publishedAt: '2026-01-25T10:00:00Z',
    createdAt: '2026-01-25T09:30:00Z',
    updatedAt: '2026-01-25T10:00:00Z',
  },

  // Thread mosaic
  {
    id: '14',
    author: mockAuthors[2],
    type: 'thread',
    content: {
      pageCount: 5,
      title: '5 Things I Learned Building My First React App',
    } as ThreadContent,
    background: {
      type: 'gradient',
      from: '#ff6b6b',
      to: '#feca57',
    },
    theme: 'light',
    tags: [mockTags[0], mockTags[4]],
    communities: [mockCommunities[0]],
    viewCount: 1567,
    likeCount: 342,
    commentCount: 89,
    shareCount: 123,
    isLiked: true,
    isPublished: true,
    isFeatured: true,
    publishedAt: '2026-01-25T11:00:00Z',
    createdAt: '2026-01-25T10:00:00Z',
    updatedAt: '2026-01-25T11:00:00Z',
  },
];

// Helper functions
export function getMosaicById(id: string): Mosaic | undefined {
  return mockMosaics.find((m) => m.id === id);
}

export function getMosaicsByAuthor(authorId: string): Mosaic[] {
  return mockMosaics.filter((m) => m.author.id === authorId);
}

export function getMosaicsByTag(tagSlug: string): Mosaic[] {
  return mockMosaics.filter((m) => m.tags?.some((t) => t.slug === tagSlug));
}

export function getMosaicsByCommunity(communitySlug: string): Mosaic[] {
  return mockMosaics.filter((m) => m.communities?.some((c) => c.slug === communitySlug));
}

export function getCommentsForMosaic(mosaicId: string): MosaicComment[] {
  return mockComments.filter((c) => c.mosaicId === mosaicId);
}

export function getFeaturedMosaics(): Mosaic[] {
  return mockMosaics.filter((m) => m.isFeatured);
}

export function getRecentMosaics(limit = 10): Mosaic[] {
  return [...mockMosaics]
    .sort((a, b) => new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime())
    .slice(0, limit);
}
