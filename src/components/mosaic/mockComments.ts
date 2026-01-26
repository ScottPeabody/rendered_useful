import type { Comment } from './CommentsSheet';

// Mock comments for development
export const mockComments: Comment[] = [
  {
    id: '1',
    authorId: 'user1',
    authorName: 'Sarah Chen',
    authorAvatar: 'https://i.pravatar.cc/100?u=sarah',
    text: 'This is such a great perspective! Really made me think differently about the problem.',
    createdAt: new Date(Date.now() - 3600000 * 2),
    likeCount: 24,
    isLiked: false,
    replies: [
      {
        id: '1a',
        authorId: 'user2',
        authorName: 'Alex Rivera',
        authorAvatar: 'https://i.pravatar.cc/100?u=alex',
        text: 'Totally agree! The examples were super helpful.',
        createdAt: new Date(Date.now() - 3600000),
        likeCount: 5,
        isLiked: true,
      },
    ],
  },
  {
    id: '2',
    authorId: 'user3',
    authorName: 'Jordan Taylor',
    authorAvatar: 'https://i.pravatar.cc/100?u=jordan',
    text: 'Would love to see more content like this! 🔥',
    createdAt: new Date(Date.now() - 7200000),
    likeCount: 18,
    isLiked: false,
  },
  {
    id: '3',
    authorId: 'user4',
    authorName: 'Sam Kim',
    text: 'This reminds me of something I read about recently. The connection is really interesting.',
    createdAt: new Date(Date.now() - 86400000),
    likeCount: 7,
    isLiked: false,
  },
];
