import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, ChevronRight, Clock, Users, Zap, Target, Blocks, User, AlertTriangle } from 'lucide-react'
import Card from '../components/ui/Card'
import VersionSelector from '../components/ui/VersionSelector'
import { getAllEvents, getEventInfo, getCommunity, getEvent, getEventVersionInfo, getLatestEventVersion } from '../data/content'
import { formatDateRange, formatRelativeTime, parseUTCDate } from '../lib/time'
import NotFoundPage from './NotFoundPage'
import type { EventStatus, MetadataItem } from '../types'

// Icon mapping for metadata items
const iconMap: Record<string, React.ReactNode> = {
  blocks: <Blocks size={16} />,
  target: <Target size={16} />,
  users: <Users size={16} />,
  user: <User size={16} />,
  zap: <Zap size={16} />,
  calendar: <Calendar size={16} />,
  clock: <Clock size={16} />,
}

// Helper to normalize metadata values (supports both simple values and MetadataItem objects)
function normalizeMetadata(value: MetadataItem | string | number | boolean | string[]): MetadataItem {
  // If it's already a MetadataItem object with a value property
  if (value && typeof value === 'object' && !Array.isArray(value) && 'value' in value) {
    return value as MetadataItem
  }
  // Otherwise wrap primitive/array in MetadataItem
  return { value: value as string | number | boolean | string[] }
}

// Render a single metadata item based on its display type
function MetadataRenderer({ metaKey, item }: { metaKey: string; item: MetadataItem }) {
  const { value, display = 'inline', title, icon, color } = item
  
  // Auto-generate title from key if not provided
  const displayTitle = title || metaKey
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim()
  
  const iconElement = icon && iconMap[icon]
  const accentColor = color || 'var(--color-accent-primary)'

  // Hero display - prominent, gradient background
  if (display === 'hero') {
    return (
      <div
        className="p-6 rounded-xl bg-gradient-to-r from-[var(--color-accent-primary)]/10 to-[var(--color-accent-secondary)]/10 border border-[var(--color-accent-primary)]/20"
        style={color ? { 
          background: `linear-gradient(to right, ${color}15, ${color}08)`,
          borderColor: `${color}30`
        } : undefined}
      >
        <div className="flex items-center gap-2 text-sm mb-2" style={{ color: accentColor }}>
          {iconElement}
          <span className="font-medium">{displayTitle}</span>
        </div>
        <p className="text-2xl font-bold text-[var(--color-text-primary)]">
          {String(value)}
        </p>
      </div>
    )
  }

  // Badge display - compact pill style
  if (display === 'badge') {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-surface-elevated)] border border-[var(--color-border)]">
        {iconElement && <span style={{ color: accentColor }}>{iconElement}</span>}
        {title && <span className="text-xs text-[var(--color-text-muted)]">{displayTitle}:</span>}
        <span className="text-sm font-medium text-[var(--color-text-primary)]">{String(value)}</span>
      </div>
    )
  }

  // Markdown display - renders content with basic markdown support
  if (display === 'markdown' && typeof value === 'string') {
    return (
      <div className="p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]">
        <div className="flex items-center gap-2 text-sm font-medium mb-3" style={{ color: accentColor }}>
          {iconElement}
          <span>{displayTitle}</span>
        </div>
        <div className="prose prose-sm max-w-none text-[var(--color-text-secondary)]">
          {value.split('\n').map((line, i) => {
            if (line.startsWith('# ')) {
              return <h3 key={i} className="text-lg font-bold text-[var(--color-text-primary)] mt-0 mb-2">{line.slice(2)}</h3>
            }
            if (line.startsWith('## ')) {
              return <h4 key={i} className="text-base font-semibold text-[var(--color-text-primary)] mt-0 mb-2">{line.slice(3)}</h4>
            }
            if (line.startsWith('- ')) {
              return <li key={i} className="ml-4">{line.slice(2)}</li>
            }
            if (line.trim() === '') return null
            return <p key={i} className="mb-1">{line}</p>
          })}
        </div>
      </div>
    )
  }

  // List display - for arrays
  if (display === 'list' && Array.isArray(value)) {
    return (
      <div className="p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]">
        <div className="flex items-center gap-2 text-sm font-medium mb-2" style={{ color: accentColor }}>
          {iconElement}
          <span>{displayTitle}</span>
        </div>
        <ul className="list-disc list-inside text-[var(--color-text-secondary)]">
          {value.map((item, i) => (
            <li key={i}>{String(item)}</li>
          ))}
        </ul>
      </div>
    )
  }

  // Card display - bordered box with title
  if (display === 'card') {
    return (
      <div className="p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]">
        <div className="flex items-center gap-2 text-sm font-medium mb-2" style={{ color: accentColor }}>
          {iconElement}
          <span>{displayTitle}</span>
        </div>
        <p className="text-[var(--color-text-primary)]">
          {Array.isArray(value) ? value.join(', ') : String(value)}
        </p>
      </div>
    )
  }

  // Inline display (default) - simple key: value
  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]">
      {iconElement && <span style={{ color: accentColor }}>{iconElement}</span>}
      <span className="text-sm text-[var(--color-text-muted)]">{displayTitle}:</span>
      <span className="text-sm text-[var(--color-text-primary)]">
        {Array.isArray(value) ? value.join(', ') : String(value)}
      </span>
    </div>
  )
}

const statusConfig: Record<EventStatus, { label: string; color: string; bgColor: string }> = {
  upcoming: {
    label: 'Upcoming',
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-500/10',
  },
  active: {
    label: 'Live Now',
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-500/10',
  },
  ended: {
    label: 'Ended',
    color: 'text-[var(--color-text-muted)]',
    bgColor: 'bg-[var(--color-surface-elevated)]',
  },
}

// Individual event view
function EventDetailView({ slug }: { slug: string }) {
  const eventInfo = getEventInfo(slug)
  const event = getEvent(slug)

  // Version support
  const versionInfo = getEventVersionInfo(slug)
  const latestVersion = getLatestEventVersion(slug)
  const isLatestVersion = !latestVersion || event?.slug === latestVersion.slug
  const hasVersions = versionInfo.length > 1

  if (!eventInfo || !event) {
    return <NotFoundPage />
  }

  const status = statusConfig[eventInfo.status]
  const eventCommunities = eventInfo.communities?.map(c => getCommunity(c)).filter(Boolean) || []

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          to="/events"
          className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] mb-8 transition-colors"
        >
          <ArrowLeft size={16} />
          All Events
        </Link>

        {/* Older version banner */}
        {hasVersions && !isLatestVersion && latestVersion && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 p-4 mb-6 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300"
          >
            <AlertTriangle size={20} />
            <div className="flex-1">
              <p className="font-medium">You're viewing an older version of this event</p>
              <p className="text-sm opacity-80">
                This is version {event.version || 'unknown'}. 
                <Link 
                  to={`/events/${latestVersion.slug}`}
                  className="underline hover:no-underline ml-1"
                >
                  View the latest version →
                </Link>
              </p>
            </div>
          </motion.div>
        )}

        {/* Event header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${status.bgColor} ${status.color}`}>
              {eventInfo.status === 'active' && (
                <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
              )}
              {status.label}
            </span>
            {eventCommunities.map(community => community && (
              <Link
                key={community.slug}
                to={`/community/${community.slug}`}
                className="flex items-center gap-1.5 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-accent-primary)] transition-colors"
              >
                <span>{community.icon}</span>
                <span>{community.name}</span>
              </Link>
            ))}
            {/* Version selector */}
            {hasVersions && (
              <VersionSelector versions={versionInfo} basePath="/events" />
            )}
          </div>

          <h1 className="text-4xl font-bold text-[var(--color-text-primary)] mb-4">
            {eventInfo.title}
          </h1>

          <p className="text-lg text-[var(--color-text-secondary)] mb-6">
            {eventInfo.description}
          </p>

          {/* Date info */}
          <div className="flex flex-wrap items-center gap-6 text-sm">
            <div className="flex items-center gap-2 text-[var(--color-text-muted)]">
              <Calendar size={16} />
              <span>{formatDateRange(eventInfo.startDate, eventInfo.endDate)}</span>
            </div>
            {eventInfo.status === 'upcoming' && (
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                <Clock size={16} />
                <span>Starts {formatRelativeTime(parseUTCDate(eventInfo.startDate))}</span>
              </div>
            )}
            {eventInfo.status === 'active' && (
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <Clock size={16} />
                <span>Ends {formatRelativeTime(parseUTCDate(eventInfo.endDate))}</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Metadata - renders based on display settings */}
        {eventInfo.metadata && Object.keys(eventInfo.metadata).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            {/* Hero items first */}
            <div className="space-y-4 mb-4">
              {Object.entries(eventInfo.metadata)
                .map(([key, value]) => ({ key, item: normalizeMetadata(value as MetadataItem | string | number | boolean | string[]) }))
                .filter(({ item }) => item.display === 'hero')
                .map(({ key, item }) => (
                  <MetadataRenderer key={key} metaKey={key} item={item} />
                ))}
            </div>

            {/* Badge and inline items in a flex row */}
            <div className="flex flex-wrap gap-2 mb-4">
              {Object.entries(eventInfo.metadata)
                .map(([key, value]) => ({ key, item: normalizeMetadata(value as MetadataItem | string | number | boolean | string[]) }))
                .filter(({ item }) => item.display === 'badge' || item.display === 'inline' || !item.display)
                .map(({ key, item }) => (
                  <MetadataRenderer key={key} metaKey={key} item={item} />
                ))}
            </div>

            {/* Card, markdown, and list items */}
            <div className="space-y-4">
              {Object.entries(eventInfo.metadata)
                .map(([key, value]) => ({ key, item: normalizeMetadata(value as MetadataItem | string | number | boolean | string[]) }))
                .filter(({ item }) => item.display === 'card' || item.display === 'markdown' || item.display === 'list')
                .map(({ key, item }) => (
                  <MetadataRenderer key={key} metaKey={key} item={item} />
                ))}
            </div>
          </motion.div>
        )}

        {/* Submissions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
              {eventInfo.status === 'ended' ? 'Submissions' : 'Activity'}
            </h2>
            <span className="text-sm text-[var(--color-text-muted)]">
              {eventInfo.itemCount} {eventInfo.itemCount === 1 ? 'entry' : 'entries'}
            </span>
          </div>

          {eventInfo.items.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {eventInfo.items.map((item) => (
                <Card
                  key={item.slug}
                  contentType={item.type}
                  slug={item.slug}
                  title={item.title}
                  description={item.description}
                  date={item.date}
                  authorSlug={item.author}
                  tags={[]}
                  readingTime={0}
                  techStack={[]}
                  type="other"
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]">
              <Users size={32} className="mx-auto text-[var(--color-text-muted)] mb-3" />
              <p className="text-[var(--color-text-muted)]">
                {eventInfo.status === 'upcoming'
                  ? 'Submissions open when the event starts'
                  : eventInfo.status === 'active'
                  ? 'No submissions yet. Be the first!'
                  : 'No submissions were made to this event'}
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

// All events listing
function AllEventsView() {
  const allEvents = getAllEvents()
  const upcoming = allEvents.filter((e) => e.status === 'upcoming')
  const active = allEvents.filter((e) => e.status === 'active')
  const ended = allEvents.filter((e) => e.status === 'ended')

  const renderEventCard = (event: ReturnType<typeof getEventInfo>, index: number) => {
    if (!event) return null
    const status = statusConfig[event.status]
    const eventCommunities = event.communities?.map(c => getCommunity(c)).filter(Boolean) || []

    return (
      <motion.div
        key={event.slug}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
      >
        <Link
          to={`/events/${event.slug}`}
          className="block p-6 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-accent-primary)]/50 hover:shadow-lg transition-all group"
        >
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${status.bgColor} ${status.color}`}>
                {event.status === 'active' && (
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse" />
                )}
                {status.label}
              </span>
              {eventCommunities.map(community => community && (
                <span key={community.slug} className="text-sm text-[var(--color-text-muted)]">
                  {community.icon} {community.name}
                </span>
              ))}
            </div>
            <ChevronRight
              size={18}
              className="text-[var(--color-text-muted)] group-hover:text-[var(--color-accent-primary)] transition-colors"
            />
          </div>

          <h3 className="text-lg font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent-primary)] transition-colors mb-2">
            {event.title}
          </h3>

          <p className="text-sm text-[var(--color-text-muted)] mb-4 line-clamp-2">
            {event.description}
          </p>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-[var(--color-text-muted)]">
              <Calendar size={14} />
              <span>{formatDateRange(event.startDate, event.endDate)}</span>
            </div>
            {event.itemCount > 0 && (
              <span className="text-[var(--color-text-muted)]">
                {event.itemCount} {event.itemCount === 1 ? 'entry' : 'entries'}
              </span>
            )}
          </div>

          {typeof event.metadata?.theme === 'string' && (
            <div className="mt-3 pt-3 border-t border-[var(--color-border)]">
              <span className="text-xs text-[var(--color-text-muted)]">Theme: </span>
              <span className="text-sm font-medium text-[var(--color-accent-primary)]">{event.metadata.theme}</span>
            </div>
          )}
        </Link>
      </motion.div>
    )
  }

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--color-accent-primary)]/10 mb-6">
            <Calendar size={32} className="text-[var(--color-accent-primary)]" />
          </div>

          <h1 className="text-4xl font-bold text-[var(--color-text-primary)] mb-4">
            Events
          </h1>

          <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto">
            Game jams, hackathons, challenges, and more. Join time-bounded events to create,
            collaborate, and share with the community.
          </p>
        </motion.div>

        {/* Active events */}
        {active.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Live Now
            </h2>
            <div className="space-y-4">
              {active.map((event, i) => renderEventCard(event, i))}
            </div>
          </section>
        )}

        {/* Upcoming events */}
        {upcoming.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">
              Upcoming
            </h2>
            <div className="space-y-4">
              {upcoming.map((event, i) => renderEventCard(event, i))}
            </div>
          </section>
        )}

        {/* Past events */}
        {ended.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">
              Past Events
            </h2>
            <div className="space-y-4">
              {ended.map((event, i) => renderEventCard(event, i))}
            </div>
          </section>
        )}

        {/* No events */}
        {allEvents.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-[var(--color-text-muted)]">
              No events yet. Check back soon!
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default function EventsPage() {
  const { slug } = useParams<{ slug: string }>()

  if (slug) {
    return <EventDetailView slug={slug} />
  }

  return <AllEventsView />
}
