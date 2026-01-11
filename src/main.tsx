import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { MDXProvider } from '@mdx-js/react'
import App from './App'
import { ThemeProvider } from './context/ThemeContext'
import { mdxComponents } from './components/mdx'
import './index.css'

// Handle GitHub Pages SPA redirect
const redirect = new URLSearchParams(window.location.search).get('redirect')
if (redirect) {
  window.history.replaceState(null, '', decodeURIComponent(redirect))
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <MDXProvider components={mdxComponents}>
          <App />
        </MDXProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
