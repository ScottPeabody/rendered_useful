import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { MDXProvider } from '@mdx-js/react'
import App from './App'
import { ThemeProvider } from './context/ThemeContext'
import { mdxComponents } from './components/mdx'
import './index.css'
// Import MDXEditor styles here (not in lazy-loaded component) to ensure they're always available
import '@mdxeditor/editor/style.css'

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
