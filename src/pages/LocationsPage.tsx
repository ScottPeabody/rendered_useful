import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, MapPin, ChevronRight, Globe, Monitor, Sparkles, History } from 'lucide-react'
import { getAllLocationInfo, getLocationInfo, getLocation, getLocationVersions } from '../data/content'
import NotFoundPage from './NotFoundPage'

const typeIcons = {
  physical: Globe,
  virtual: Monitor,
  hybrid: MapPin,
}

const typeLabels = {
  physical: 'Physical Location',
  virtual: 'Virtual Space',
  hybrid: 'Hybrid',
}

// Individual location view
function LocationDetailView({ slug }: { slug: string }) {
  const locationInfo = getLocationInfo(slug)
  const location = getLocation(slug)
  
  if (!locationInfo || !location) {
    return <NotFoundPage />
  }

  const TypeIcon = typeIcons[location.type]
  const parentLocation = location.parent ? getLocation(location.parent) : null

  // Get other versions if this location is part of a version group
  const versions = location.versionGroup ? getLocationVersions(location.versionGroup) : []
  const hasMultipleVersions = versions.length > 1

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          to="/locations"
          className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] mb-8 transition-colors"
        >
          <ArrowLeft size={16} />
          All Locations
        </Link>

        {/* Location header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-4">
            {location.icon && (
              <span 
                className="text-4xl p-3 rounded-xl"
                style={{ backgroundColor: `${location.color}20` }}
              >
                {location.icon}
              </span>
            )}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <TypeIcon size={16} className="text-[var(--color-text-muted)]" />
                <span className="text-sm text-[var(--color-text-muted)]">
                  {typeLabels[location.type]}
                </span>
                {parentLocation && (
                  <>
                    <span className="text-[var(--color-text-muted)]">•</span>
                    <Link 
                      to={`/locations/${parentLocation.slug}`}
                      className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-accent-primary)] transition-colors"
                    >
                      {parentLocation.icon} {parentLocation.name}
                    </Link>
                  </>
                )}
              </div>
              <h1 className="text-4xl font-bold text-[var(--color-text-primary)]">
                {locationInfo.name}
              </h1>
              <div className="flex items-center gap-3">
                <span className="text-sm text-[var(--color-text-muted)]">
                  {locationInfo.itemCount} {locationInfo.itemCount === 1 ? 'item' : 'items'}
                </span>
                {location.version && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-accent-primary)]/10 text-[var(--color-accent-primary)]">
                    {location.version}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <p className="text-lg text-[var(--color-text-secondary)]">
            {locationInfo.description}
          </p>

          {location.versionNote && (
            <p className="mt-2 text-sm text-[var(--color-text-muted)] italic">
              {location.versionNote}
            </p>
          )}

          {location.timezone && (
            <p className="mt-2 text-sm text-[var(--color-text-muted)]">
              Timezone: {location.timezone}
            </p>
          )}

          {/* Version history */}
          {hasMultipleVersions && (
            <div className="mt-6 p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]">
              <h3 className="text-sm font-medium text-[var(--color-text-muted)] mb-3 flex items-center gap-2">
                <History size={16} />
                Version History
              </h3>
              <div className="flex flex-wrap gap-2">
                {versions.map((v) => {
                  const isActive = v.slug === slug
                  return (
                    <Link
                      key={v.slug}
                      to={`/locations/${v.slug}`}
                      className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                        isActive
                          ? 'bg-[var(--color-accent-primary)]'
                          : 'bg-[var(--color-surface-elevated)] border border-[var(--color-border)] hover:border-[var(--color-accent-primary)]/50'
                      }`}
                    >
                      <span className={isActive ? 'text-white font-medium' : 'text-gray-200 hover:text-white'}>
                        {v.version || v.name}
                      </span>
                      <span className={`ml-2 ${isActive ? 'text-white/70' : 'text-gray-400'}`}>
                        {v.date.slice(0, 4)}
                      </span>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}
        </motion.div>

        {/* Content items */}
        {locationInfo.items.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">
              Content from {locationInfo.name}
            </h2>
            {locationInfo.items.map((item) => {
              const path = item.type === 'article' 
                ? `/articles/${item.slug}` 
                : `/projects/${item.slug}`
              
              return (
                <Link
                  key={item.slug}
                  to={path}
                  className="block p-6 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-accent-primary)]/50 transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs px-2 py-0.5 rounded bg-[var(--color-surface-elevated)] text-[var(--color-text-muted)]">
                          {item.type}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent-primary)] transition-colors mb-2">
                        {item.title}
                      </h3>
                      
                      <p className="text-sm text-[var(--color-text-muted)] line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                    
                    <ChevronRight 
                      size={20} 
                      className="flex-shrink-0 text-[var(--color-text-muted)] group-hover:text-[var(--color-accent-primary)] transition-colors" 
                    />
                  </div>
                </Link>
              )
            })}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-center py-12 px-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]"
          >
            <Sparkles size={48} className="mx-auto text-[var(--color-text-muted)] mb-4" />
            <h3 className="text-lg font-medium text-[var(--color-text-primary)] mb-2">
              No content yet
            </h3>
            <p className="text-[var(--color-text-muted)]">
              Be the first to share content from {locationInfo.name}!
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

// All locations listing
function AllLocationsView() {
  const allLocations = getAllLocationInfo()
  const physicalLocs = allLocations.filter(l => l.type === 'physical')
  const virtualLocs = allLocations.filter(l => l.type === 'virtual')

  const renderLocationCard = (location: typeof allLocations[0], index: number) => {
    const loc = getLocation(location.slug)
    const parentLoc = loc?.parent ? getLocation(loc.parent) : null
    
    return (
      <motion.div
        key={location.slug}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
      >
        <Link
          to={`/locations/${location.slug}`}
          className="block p-5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-accent-primary)]/50 hover:shadow-lg transition-all group"
        >
          <div className="flex items-center gap-3">
            {location.icon && (
              <span 
                className="text-2xl p-2 rounded-lg flex-shrink-0"
                style={{ backgroundColor: `${location.color}20` }}
              >
                {location.icon}
              </span>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent-primary)] transition-colors">
                {location.name}
              </h3>
              {parentLoc && (
                <span className="text-xs text-[var(--color-text-muted)]">
                  {parentLoc.icon} {parentLoc.name}
                </span>
              )}
              <span className="block text-xs text-[var(--color-text-muted)]">
                {location.itemCount} {location.itemCount === 1 ? 'item' : 'items'}
              </span>
            </div>
          </div>
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
            <MapPin size={32} className="text-[var(--color-accent-primary)]" />
          </div>
          
          <h1 className="text-4xl font-bold text-[var(--color-text-primary)] mb-4">
            Locations
          </h1>
          
          <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto">
            Explore physical and virtual spaces. Where content comes from shapes its perspective and assumptions.
          </p>
        </motion.div>

        {/* Physical Locations */}
        {physicalLocs.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <Globe size={20} className="text-[var(--color-accent-primary)]" />
              <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
                Physical Locations
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {physicalLocs.map((loc, i) => renderLocationCard(loc, i))}
            </div>
          </div>
        )}

        {/* Virtual Spaces */}
        {virtualLocs.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <Monitor size={20} className="text-[var(--color-accent-primary)]" />
              <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
                Virtual Spaces
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {virtualLocs.map((loc, i) => renderLocationCard(loc, i))}
            </div>
          </div>
        )}

        {/* Note about place vs location */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-12 p-6 rounded-xl bg-gradient-to-r from-[var(--color-accent-primary)]/10 to-[var(--color-accent-secondary)]/10 border border-[var(--color-border)]"
        >
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">
            📍 Place vs Location
          </h3>
          <p className="text-[var(--color-text-secondary)]">
            A location is coordinates on a map. A <em>place</em> is where meaning lives. 
            We capture locations, but the stories and context that make them places come from you.
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default function LocationsPage() {
  const { slug } = useParams<{ slug?: string }>()
  
  if (slug) {
    return <LocationDetailView slug={slug} />
  }
  
  return <AllLocationsView />
}
