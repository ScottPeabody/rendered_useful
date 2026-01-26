import { useState, useRef, useEffect, useCallback } from 'react';

export interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  text: string;
  createdAt: Date;
  likeCount: number;
  isLiked: boolean;
  replies?: Comment[];
}

interface CommentsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  comments: Comment[];
  onAddComment: (text: string, replyToId?: string) => void;
  onLikeComment: (commentId: string) => void;
}

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
        likeCount: 8,
        isLiked: true,
      },
    ],
  },
  {
    id: '2',
    authorId: 'user3',
    authorName: 'Jordan Kim',
    authorAvatar: 'https://i.pravatar.cc/100?u=jordan',
    text: 'Would love to see more content like this 🔥',
    createdAt: new Date(Date.now() - 7200000),
    likeCount: 15,
    isLiked: false,
  },
  {
    id: '3',
    authorId: 'user4',
    authorName: 'Morgan Taylor',
    text: 'Bookmarking this for later. Such valuable insights!',
    createdAt: new Date(Date.now() - 86400000),
    likeCount: 42,
    isLiked: true,
  },
];

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d`;
  return `${Math.floor(seconds / 604800)}w`;
}

function CommentItem({
  comment,
  onLike,
  onReply,
  isReply = false,
}: {
  comment: Comment;
  onLike: (id: string) => void;
  onReply: (id: string) => void;
  isReply?: boolean;
}) {
  return (
    <div className={`flex gap-3 ${isReply ? 'ml-10 mt-3' : ''}`}>
      {comment.authorAvatar ? (
        <img
          src={comment.authorAvatar}
          alt={comment.authorName}
          className="w-8 h-8 rounded-full object-cover flex-shrink-0"
        />
      ) : (
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-medium flex-shrink-0">
          {comment.authorName[0]}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-sm">{comment.authorName}</span>
          <span className="text-xs opacity-50">{formatTimeAgo(comment.createdAt)}</span>
        </div>
        <p className="text-sm leading-relaxed break-words">{comment.text}</p>
        <div className="flex items-center gap-4 mt-2">
          <button
            onClick={() => onLike(comment.id)}
            className="flex items-center gap-1 text-xs opacity-75 hover:opacity-100 transition-opacity"
          >
            <span>{comment.isLiked ? '❤️' : '🤍'}</span>
            <span>{comment.likeCount}</span>
          </button>
          {!isReply && (
            <button
              onClick={() => onReply(comment.id)}
              className="text-xs opacity-75 hover:opacity-100 transition-opacity"
            >
              Reply
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function CommentsSheet({
  isOpen,
  onClose,
  comments,
  onAddComment,
  onLikeComment,
}: CommentsSheetProps) {
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  // Focus input when opening or when replying
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, replyingTo]);

  // Handle click outside to close
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (sheetRef.current && !sheetRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (replyingTo) {
          setReplyingTo(null);
        } else {
          onClose();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, replyingTo, onClose]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    onAddComment(newComment.trim(), replyingTo ?? undefined);
    setNewComment('');
    setReplyingTo(null);
  }, [newComment, replyingTo, onAddComment]);

  const handleReply = useCallback((commentId: string) => {
    setReplyingTo(commentId);
    inputRef.current?.focus();
  }, []);

  const replyingToComment = replyingTo
    ? comments.find(c => c.id === replyingTo) || 
      comments.flatMap(c => c.replies || []).find(r => r.id === replyingTo)
    : null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        className={`fixed bottom-0 left-0 right-0 z-50 bg-gray-900 rounded-t-2xl transition-transform duration-300 ease-out ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ maxHeight: '70vh' }}
      >
        {/* Handle */}
        <div className="flex justify-center py-3">
          <div className="w-10 h-1 rounded-full bg-white/30" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 pb-3 border-b border-white/10">
          <h3 className="font-semibold">
            {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Comments list */}
        <div className="overflow-y-auto p-4 space-y-4" style={{ maxHeight: 'calc(70vh - 140px)' }}>
          {comments.length === 0 ? (
            <div className="text-center py-8 opacity-50">
              <p>No comments yet</p>
              <p className="text-sm mt-1">Be the first to share your thoughts!</p>
            </div>
          ) : (
            comments.map(comment => (
              <div key={comment.id}>
                <CommentItem
                  comment={comment}
                  onLike={onLikeComment}
                  onReply={handleReply}
                />
                {comment.replies?.map(reply => (
                  <CommentItem
                    key={reply.id}
                    comment={reply}
                    onLike={onLikeComment}
                    onReply={handleReply}
                    isReply
                  />
                ))}
              </div>
            ))
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-white/10">
          {replyingTo && replyingToComment && (
            <div className="flex items-center justify-between mb-2 px-2 py-1 bg-white/5 rounded text-xs">
              <span className="opacity-75">
                Replying to <span className="font-medium">{replyingToComment.authorName}</span>
              </span>
              <button
                onClick={() => setReplyingTo(null)}
                className="opacity-75 hover:opacity-100"
              >
                ✕
              </button>
            </div>
          )}
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={replyingTo ? 'Write a reply...' : 'Add a comment...'}
              className="flex-1 px-4 py-2 bg-white/10 rounded-full text-sm placeholder:opacity-50 focus:outline-none focus:ring-2 focus:ring-white/30"
            />
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="px-4 py-2 bg-white text-gray-900 rounded-full text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/90 transition-colors"
            >
              Post
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default CommentsSheet;
