import { Routes, Route, useLocation } from 'react-router-dom'
import { Suspense, lazy, useEffect } from 'react'
import Layout from './components/layout/Layout'
import LoadingSpinner from './components/ui/LoadingSpinner'

const HomePage = lazy(() => import('./pages/HomePage'))
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'))
const ProjectPage = lazy(() => import('./pages/ProjectPage'))
const ArticlesPage = lazy(() => import('./pages/BlogPage'))
const ArticlePage = lazy(() => import('./pages/ArticlePage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const ContributePage = lazy(() => import('./pages/ContributePage'))
const ContributorsPage = lazy(() => import('./pages/ContributorsPage'))
const AuthorPage = lazy(() => import('./pages/AuthorPage'))
const TagPage = lazy(() => import('./pages/TagPage'))
const CommunitiesPage = lazy(() => import('./pages/CommunitiesPage'))
const CommunityPage = lazy(() => import('./pages/CommunityPage'))
const UsesPage = lazy(() => import('./pages/UsesPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation()
  
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  
  return null
}

function App() {
  return (
    <Layout>
      <ScrollToTop />
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:slug" element={<ProjectPage />} />
          <Route path="/articles" element={<ArticlesPage />} />
          <Route path="/articles/:slug" element={<ArticlePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contribute" element={<ContributePage />} />
          <Route path="/contributors" element={<ContributorsPage />} />
          <Route path="/author/:slug" element={<AuthorPage />} />
          <Route path="/tag/:tag" element={<TagPage />} />
          <Route path="/communities" element={<CommunitiesPage />} />
          <Route path="/community/:slug" element={<CommunityPage />} />
          <Route path="/uses" element={<UsesPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </Layout>
  )
}

export default App
