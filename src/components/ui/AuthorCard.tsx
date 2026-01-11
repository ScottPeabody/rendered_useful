import { useNavigate } from 'react-router-dom'
import { MapPin, Calendar, Github, Twitter, Globe, Linkedin } from 'lucide-react'
import type { Author } from '../../types'

interface AuthorCardProps {
  author: Author
  size?: 'sm' | 'md' | 'lg'
  showBio?: boolean
  showSocials?: boolean
}

export default function AuthorCard({
  author,
  size = 'md',
  showBio = true,
  showSocials = true,
}: AuthorCardProps) {
  const navigate = useNavigate()
  
  const avatarSizes = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-20 h-20',
  }

  const handleCardClick = () => {
    navigate(`/author/${author.slug}`)
  }

  return (
    <div
      onClick={handleCardClick}
      className="group flex items-start gap-4 p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-accent-primary)]/50 transition-all card-hover cursor-pointer"
    >
      {/* Avatar */}
      <img
        src={author.avatar}
        alt={author.name}
        className={`${avatarSizes[size]} rounded-full ring-2 ring-[var(--color-border)] group-hover:ring-[var(--color-accent-primary)]/50 transition-all`}
      />

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent-primary)] transition-colors">
            {author.name}
          </h3>
          {author.isCoreMaintainer && (
            <span className="px-2 py-0.5 text-xs font-medium bg-[var(--color-accent-primary)]/20 text-[var(--color-accent-primary)] rounded-full">
              Core
            </span>
          )}
          {author.role && !author.isCoreMaintainer && (
            <span className="text-xs text-[var(--color-text-muted)]">{author.role}</span>
          )}
        </div>

        {showBio && author.bio && (
          <p className="mt-1 text-sm text-[var(--color-text-muted)] line-clamp-2">
            {author.bio}
          </p>
        )}

        {/* Meta */}
        <div className="flex items-center gap-3 mt-2 text-xs text-[var(--color-text-muted)]">
          {author.location && (
            <span className="flex items-center gap-1">
              <MapPin size={12} />
              {author.location}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Calendar size={12} />
            Joined {new Date(author.joinedDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
          </span>
        </div>

        {/* Socials */}
        {showSocials && (
          <div className="flex items-center gap-2 mt-3" onClick={(e) => e.stopPropagation()}>
            {author.github && (
              <a
                href={`https://github.com/${author.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-elevated)] transition-all"
              >
                <Github size={16} />
              </a>
            )}
            {author.twitter && (
              <a
                href={`https://twitter.com/${author.twitter}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-elevated)] transition-all"
              >
                <Twitter size={16} />
              </a>
            )}
            {author.linkedin && (
              <a
                href={`https://linkedin.com/in/${author.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-elevated)] transition-all"
              >
                <Linkedin size={16} />
              </a>
            )}
            {author.website && (
              <a
                href={author.website}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-elevated)] transition-all"
              >
                <Globe size={16} />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
