import { Link } from 'react-router-dom'
import { Github, Twitter, Rss, Heart } from 'lucide-react'

const footerLinks = {
  explore: [
    { label: 'Projects', href: '/projects' },
    { label: 'Articles', href: '/articles' },
    { label: 'Contributors', href: '/contributors' },
    { label: 'Tags', href: '/tags' },
  ],
  resources: [
    { label: 'About', href: '/about' },
    { label: 'Uses', href: '/uses' },
    { label: 'Contribute', href: '/contribute' },
    { label: 'RSS Feed', href: '/rss.xml' },
  ],
  social: [
    { label: 'GitHub', href: 'https://github.com/ScottPeabody/rendered_useful', icon: Github },
    { label: 'Twitter', href: 'https://twitter.com/render_useful', icon: Twitter },
    { label: 'RSS', href: '/rss.xml', icon: Rss },
  ],
}

export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="inline-block">
              <span className="font-bold text-xl gradient-text">rendered_useful</span>
            </Link>
            <p className="mt-4 text-[var(--color-text-muted)] max-w-sm">
              A collaborative platform for developers to share projects, articles, and ideas. 
              Built by the community, for the community.
            </p>
            <div className="flex items-center gap-4 mt-6">
              {footerLinks.social.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.href.startsWith('http') ? '_blank' : undefined}
                  rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="p-2 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-elevated)] transition-all"
                  aria-label={item.label}
                >
                  <item.icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Explore Links */}
          <div>
            <h3 className="font-semibold text-[var(--color-text-primary)] mb-4">Explore</h3>
            <ul className="space-y-3">
              {footerLinks.explore.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="font-semibold text-[var(--color-text-primary)] mb-4">Resources</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[var(--color-border)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[var(--color-text-muted)]">
            © {new Date().getFullYear()} rendered_useful. All rights reserved.
          </p>
          <p className="text-sm text-[var(--color-text-muted)] flex items-center gap-1">
            Made with <Heart size={14} className="text-[var(--color-accent-error)]" /> by the community
          </p>
        </div>
      </div>
    </footer>
  )
}
