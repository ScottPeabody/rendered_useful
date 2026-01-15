import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Languages, ChevronRight, Code, MessageCircle, FileText, Sparkles, History } from 'lucide-react'
import { getAllLanguageInfo, getLanguageInfo, getLanguage, getLanguageVersions } from '../data/content'
import NotFoundPage from './NotFoundPage'

const typeIcons = {
  programming: Code,
  natural: MessageCircle,
  markup: FileText,
  query: Code,
  other: Languages,
}

const typeLabels = {
  programming: 'Programming Language',
  natural: 'Natural Language',
  markup: 'Markup Language',
  query: 'Query Language',
  other: 'Other',
}

// Individual language view
function LanguageDetailView({ slug }: { slug: string }) {
  const languageInfo = getLanguageInfo(slug)
  const language = getLanguage(slug)
  
  if (!languageInfo || !language) {
    return <NotFoundPage />
  }

  const TypeIcon = typeIcons[language.type] || Languages

  // Get other versions if this language is part of a version group
  const versions = language.versionGroup ? getLanguageVersions(language.versionGroup) : []
  const hasMultipleVersions = versions.length > 1

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          to="/languages"
          className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] mb-8 transition-colors"
        >
          <ArrowLeft size={16} />
          All Languages
        </Link>

        {/* Language header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-4">
            {language.icon && (
              <span 
                className="text-4xl p-3 rounded-xl"
                style={{ backgroundColor: `${language.color}20` }}
              >
                {language.icon}
              </span>
            )}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <TypeIcon size={16} className="text-[var(--color-text-muted)]" />
                <span className="text-sm text-[var(--color-text-muted)]">
                  {typeLabels[language.type]}
                </span>
                {language.family && (
                  <>
                    <span className="text-[var(--color-text-muted)]">•</span>
                    <span className="text-sm text-[var(--color-text-muted)]">
                      {language.family}
                    </span>
                  </>
                )}
              </div>
              <h1 className="text-4xl font-bold text-[var(--color-text-primary)]">
                {languageInfo.name}
              </h1>
              <div className="flex items-center gap-3">
                <span className="text-sm text-[var(--color-text-muted)]">
                  {languageInfo.itemCount} {languageInfo.itemCount === 1 ? 'item' : 'items'}
                </span>
                {language.version && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-accent-primary)]/10 text-[var(--color-accent-primary)]">
                    v{language.version}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <p className="text-lg text-[var(--color-text-secondary)]">
            {languageInfo.description}
          </p>

          {language.versionNote && (
            <p className="mt-2 text-sm text-[var(--color-text-muted)] italic">
              {language.versionNote}
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
                      to={`/languages/${v.slug}`}
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
        {languageInfo.items.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">
              Content in {languageInfo.name}
            </h2>
            {languageInfo.items.map((item) => {
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
              Be the first to write content in {languageInfo.name}!
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

// All languages listing
function AllLanguagesView() {
  const allLanguages = getAllLanguageInfo()
  const programmingLangs = allLanguages.filter(l => l.type === 'programming')
  const naturalLangs = allLanguages.filter(l => l.type === 'natural')
  const markupLangs = allLanguages.filter(l => l.type === 'markup')

  const renderLanguageCard = (language: typeof allLanguages[0], index: number) => (
    <motion.div
      key={language.slug}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link
        to={`/languages/${language.slug}`}
        className="block p-5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-accent-primary)]/50 hover:shadow-lg transition-all group"
      >
        <div className="flex items-center gap-3">
          {language.icon && (
            <span 
              className="text-2xl p-2 rounded-lg flex-shrink-0"
              style={{ backgroundColor: `${language.color}20` }}
            >
              {language.icon}
            </span>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent-primary)] transition-colors">
              {language.name}
            </h3>
            <span className="text-xs text-[var(--color-text-muted)]">
              {language.itemCount} {language.itemCount === 1 ? 'item' : 'items'}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )

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
            <Languages size={32} className="text-[var(--color-accent-primary)]" />
          </div>
          
          <h1 className="text-4xl font-bold text-[var(--color-text-primary)] mb-4">
            Languages
          </h1>
          
          <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto">
            Explore linguistic space. Languages shape thought, create communities, and build bridges across borders.
          </p>
        </motion.div>

        {/* Programming Languages */}
        {programmingLangs.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <Code size={20} className="text-[var(--color-accent-primary)]" />
              <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
                Programming Languages
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {programmingLangs.map((lang, i) => renderLanguageCard(lang, i))}
            </div>
          </div>
        )}

        {/* Natural Languages */}
        {naturalLangs.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <MessageCircle size={20} className="text-[var(--color-accent-primary)]" />
              <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
                Natural Languages
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {naturalLangs.map((lang, i) => renderLanguageCard(lang, i))}
            </div>
          </div>
        )}

        {/* Markup Languages */}
        {markupLangs.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <FileText size={20} className="text-[var(--color-accent-primary)]" />
              <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
                Markup Languages
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {markupLangs.map((lang, i) => renderLanguageCard(lang, i))}
            </div>
          </div>
        )}

        {/* Future: Translation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-12 p-6 rounded-xl bg-gradient-to-r from-[var(--color-accent-primary)]/10 to-[var(--color-accent-secondary)]/10 border border-[var(--color-border)]"
        >
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">
            🌉 Coming Soon: Translation as Bridge
          </h3>
          <p className="text-[var(--color-text-secondary)]">
            Language creates borders. Translation builds bridges. We're working on multilingual support 
            and translation features to make knowledge accessible across linguistic boundaries.
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default function LanguagesPage() {
  const { slug } = useParams<{ slug?: string }>()
  
  if (slug) {
    return <LanguageDetailView slug={slug} />
  }
  
  return <AllLanguagesView />
}
