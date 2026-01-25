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
} from '../types/mosaic';

// Mock authors
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
    avatarUrl: undefined,
  },
  {
    id: '3',
    username: 'codewitch',
    displayName: 'Code Witch',
    avatarUrl: undefined,
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
  // Post mosaic
  {
    id: '1',
    author: mockAuthors[0],
    type: 'post',
    content: {
      text: 'Just shipped a new feature! 🚀\n\nMosaics are full-screen, swipeable content cards. Think TikTok meets MDX.',
      fontSize: 'lg',
      alignment: 'center',
    } as PostContent,
    background: {
      type: 'gradient',
      from: '#667eea',
      to: '#764ba2',
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

  // Quote mosaic
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
      type: 'solid',
      color: '#1a1a2e',
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

  // Image mosaic
  {
    id: '3',
    author: mockAuthors[2],
    type: 'image',
    content: {
      url: '/images/examples/sunset-code.jpg',
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

  // Code mosaic
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
      type: 'solid',
      color: '#0d1117',
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

  // Gallery mosaic
  {
    id: '5',
    author: mockAuthors[1],
    type: 'gallery',
    content: {
      images: [
        { url: '/images/examples/design-1.jpg', alt: 'Design iteration 1', caption: 'First draft' },
        { url: '/images/examples/design-2.jpg', alt: 'Design iteration 2', caption: 'Getting closer' },
        { url: '/images/examples/design-3.jpg', alt: 'Design iteration 3', caption: 'Final design! 🎉' },
      ],
      transition: 'slide',
    } as GalleryContent,
    theme: 'light',
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

  // Video mosaic
  {
    id: '6',
    author: mockAuthors[2],
    type: 'video',
    content: {
      url: '/videos/examples/coding-timelapse.mp4',
      poster: '/images/examples/coding-poster.jpg',
      autoplay: true,
      loop: true,
      muted: true,
    } as VideoContent,
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

  // Poll mosaic
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
      from: '#f093fb',
      to: '#f5576c',
      direction: 'to-r',
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

  // Another post with different style
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
      url: '/images/backgrounds/abstract-dark.jpg',
      blur: 2,
      overlay: 'rgba(0,0,0,0.6)',
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
