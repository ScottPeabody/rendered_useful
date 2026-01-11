import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import mdx from '@mdx-js/rollup'
import remarkGfm from 'remark-gfm'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMath from 'remark-math'
import rehypeHighlight from 'rehype-highlight'
import rehypeKatex from 'rehype-katex'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    mdx({
      remarkPlugins: [remarkFrontmatter, remarkGfm, remarkMath],
      rehypePlugins: [rehypeHighlight, rehypeKatex],
      providerImportSource: '@mdx-js/react',
    }),
    react(),
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      output: {
        chunkFileNames: 'assets/[name]-[hash].js',
      }
    }
  },
  experimental: {
    // Force absolute paths for dynamic imports in production
    renderBuiltUrl(filename, { hostType }) {
      if (hostType === 'js') {
        return { runtime: `window.__vite_base__ + ${JSON.stringify(filename)}` }
      }
      return { relative: true }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@content': resolve(__dirname, './content'),
      '@components': resolve(__dirname, './src/components'),
    },
  },
})
