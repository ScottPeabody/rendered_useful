import { Routes, Route, useLocation } from 'react-router-dom'
import { Suspense, lazy, useEffect } from 'react'
import Layout from './components/layout/Layout'
import LoadingSpinner from './components/ui/LoadingSpinner'
import { LayoutProvider } from './context/LayoutContext'

const HomePage = lazy(() => import('./pages/HomePage'))
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'))
const ProjectPage = lazy(() => import('./pages/ProjectPage'))
const ArticlesPage = lazy(() => import('./pages/BlogPage'))
const ArticlePage = lazy(() => import('./pages/ArticlePage'))
const NotebooksPage = lazy(() => import('./pages/NotebooksPage'))
const NotebookPage = lazy(() => import('./pages/NotebookPage'))
const JupyterLabPage = lazy(() => import('./components/ui/JupyterLiteEmbed').then(m => ({ default: m.JupyterLabPage })))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const ContributePage = lazy(() => import('./pages/ContributePage'))
const ContributorsPage = lazy(() => import('./pages/ContributorsPage'))
const AuthorPage = lazy(() => import('./pages/AuthorPage'))
const TagPage = lazy(() => import('./pages/TagPage'))
const CommunitiesPage = lazy(() => import('./pages/CommunitiesPage'))
const CommunityPage = lazy(() => import('./pages/CommunityPage'))
const SeriesPage = lazy(() => import('./pages/SeriesPage'))
const EventsPage = lazy(() => import('./pages/EventsPage'))
const ConceptsPage = lazy(() => import('./pages/ConceptsPage'))
const LanguagesPage = lazy(() => import('./pages/LanguagesPage'))
const LocationsPage = lazy(() => import('./pages/LocationsPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

// Personal spaces
const SpacePage = lazy(() => import('./pages/SpacePage'))
const PostPage = lazy(() => import('./pages/PostPage'))
const FeedPage = lazy(() => import('./pages/FeedPage'))

// Editor
const EditPage = lazy(() => import('./pages/EditPage'))

// Mosaics
const MosaicsPage = lazy(() => import('./pages/MosaicsPage'))
const MosaicCreator = lazy(() => import('./components/mosaic/creator/MosaicCreator').then(m => ({ default: m.MosaicCreator })))

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation()
  
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  
  return null
}

function App() {
  const location = useLocation()
  const isMosaicsRoute = location.pathname.startsWith('/mosaics')

  return (
    <LayoutProvider>
      {isMosaicsRoute ? (
        // Mosaics render full-screen without Layout
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/mosaics" element={<MosaicsPage />} />
            <Route path="/mosaics/create" element={<MosaicCreator />} />
            <Route path="/mosaics/:id" element={<MosaicsPage />} />
            <Route path="/mosaics/tag/:tag" element={<MosaicsPage />} />
            <Route path="/mosaics/community/:community" element={<MosaicsPage />} />
          </Routes>
        </Suspense>
      ) : (
        <Layout>
          <ScrollToTop />
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:slug" element={<ProjectPage />} />
            <Route path="/articles" element={<ArticlesPage />} />
            <Route path="/articles/:slug" element={<ArticlePage />} />
            <Route path="/notebooks" element={<NotebooksPage />} />
            <Route path="/notebooks/:slug" element={<NotebookPage />} />
            <Route path="/lab" element={<JupyterLabPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contribute" element={<ContributePage />} />
            <Route path="/contributors" element={<ContributorsPage />} />
            <Route path="/author/:slug" element={<AuthorPage />} />
            <Route path="/tag/:tag" element={<TagPage />} />
            <Route path="/communities" element={<CommunitiesPage />} />
            <Route path="/community/:slug" element={<CommunityPage />} />
            <Route path="/series" element={<SeriesPage />} />
            <Route path="/series/:slug" element={<SeriesPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/:slug" element={<EventsPage />} />
            <Route path="/concepts" element={<ConceptsPage />} />
            <Route path="/concepts/:slug" element={<ConceptsPage />} />
            <Route path="/languages" element={<LanguagesPage />} />
            <Route path="/languages/:slug" element={<LanguagesPage />} />
            <Route path="/locations" element={<LocationsPage />} />
            <Route path="/locations/:slug" element={<LocationsPage />} />
            {/* Editor */}
            <Route path="/edit" element={<EditPage />} />
            <Route path="/edit/:slug" element={<EditPage />} />
            {/* Personal spaces - using @ prefix for usernames */}
            <Route path="/:username" element={<SpacePage />} />
            <Route path="/:username/posts/:slug" element={<PostPage />} />
            <Route path="/:username/feeds/:feedSlug" element={<FeedPage />} />
            <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </Layout>
      )}
    </LayoutProvider>
  )
}

export default App
