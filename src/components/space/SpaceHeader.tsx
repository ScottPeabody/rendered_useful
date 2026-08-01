import { Link } from 'react-router-dom'
import type { ResolvedSpaceHandle } from '../../data/content'
import { getGroupMembers } from '../../data/content'

interface SpaceHeaderProps {
  handle: string
  resolved: ResolvedSpaceHandle
  bio?: string
}

export function SpaceHeader({ handle, resolved, bio }: SpaceHeaderProps) {
  // Group spaces render the group identity + member row
  if (resolved.kind === 'group') {
    const { group } = resolved
    const members = getGroupMembers(group.slug)

    return (
      <header className="mb-8 pb-8 border-b border-[var(--color-border)]">
        <div className="flex items-start gap-6">
          {group.avatar && (
            <img
              src={group.avatar}
              alt={group.name}
              className="w-24 h-24 rounded-full object-cover"
            />
          )}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">
              {group.name}
            </h1>
            <p className="text-[var(--color-text-muted)] mb-2">
              @{group.slug}
            </p>
            <p className="text-[var(--color-text-secondary)] max-w-2xl">
              {bio || group.description}
            </p>

            {/* Members */}
            {members.length > 0 && (
              <div className="flex items-center gap-3 mt-4">
                <span className="text-sm text-[var(--color-text-muted)]">
                  {members.length} member{members.length === 1 ? '' : 's'}
                </span>
                <div className="flex items-center gap-2">
                  {members.map((member) => (
                    <Link
                      key={member.slug}
                      to={`/@${member.slug}`}
                      title={member.name}
                      className="flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-accent-primary)] transition-colors"
                    >
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <span>{member.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
    )
  }

  // Author / alias spaces
  const { author } = resolved
  const displayName = resolved.kind === 'alias' ? resolved.space.alias! : author.name
  const displayBio = bio || (resolved.kind === 'alias' ? resolved.space.bio : author.bio)

  return (
    <header className="mb-8 pb-8 border-b border-[var(--color-border)]">
      <div className="flex items-start gap-6">
        {author.avatar && (
          <img
            src={author.avatar}
            alt={displayName}
            className="w-24 h-24 rounded-full object-cover"
          />
        )}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">
            {displayName}
          </h1>
          <p className="text-[var(--color-text-muted)] mb-2">
            @{handle}
          </p>
          {displayBio && (
            <p className="text-[var(--color-text-secondary)] max-w-2xl">
              {displayBio}
            </p>
          )}

          {/* Links */}
          <div className="flex gap-4 mt-4">
            {author.github && (
              <a
                href={`https://github.com/${author.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-text-muted)] hover:text-[var(--color-accent-primary)] transition-colors"
              >
                GitHub
              </a>
            )}
            {author.twitter && (
              <a
                href={`https://twitter.com/${author.twitter}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-text-muted)] hover:text-[var(--color-accent-primary)] transition-colors"
              >
                Twitter
              </a>
            )}
            {author.website && (
              <a
                href={author.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-text-muted)] hover:text-[var(--color-accent-primary)] transition-colors"
              >
                Website
              </a>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
