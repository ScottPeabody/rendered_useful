import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import mdx from '@mdx-js/rollup'
import remarkGfm from 'remark-gfm'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import remarkMath from 'remark-math'
import rehypeHighlight from 'rehype-highlight'
import rehypeKatex from 'rehype-katex'
import { resolve } from 'path'

/**
 * Converts relative dynamic imports to absolute paths.
 * Required for SPAs on static hosts (GitHub Pages) where deep URLs
 * like /projects/rubiks-cube cause relative imports to resolve incorrectly.
 */
function absoluteImports(): Plugin {
  return {
    name: 'vite-plugin-absolute-imports',
    enforce: 'post',
    generateBundle(_options, bundle) {
      for (const file of Object.values(bundle)) {
        if (file.type === 'chunk' && file.code) {
          file.code = file.code.replace(
            /import\("\.\/([^"]+)"\)/g,
            'import("/assets/$1")'
          )
        }
      }
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    mdx({
      remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter, remarkGfm, remarkMath],
      rehypePlugins: [rehypeHighlight, rehypeKatex],
      providerImportSource: '@mdx-js/react',
    }),
    react(),
    tailwindcss(),
    absoluteImports(),
  ],
  build: {
    rollupOptions: {
      output: {
        chunkFileNames: 'assets/[name]-[hash].js',
      }
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
