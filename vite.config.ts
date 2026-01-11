import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import mdx from '@mdx-js/rollup'
import remarkGfm from 'remark-gfm'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMath from 'remark-math'
import rehypeHighlight from 'rehype-highlight'
import rehypeKatex from 'rehype-katex'
import { resolve } from 'path'

// Plugin to fix relative dynamic imports for SPA routing
function fixDynamicImports(): Plugin {
  return {
    name: 'fix-dynamic-imports',
    enforce: 'post',
    generateBundle(_options, bundle) {
      for (const file of Object.values(bundle)) {
        if (file.type === 'chunk' && file.code) {
          // Replace relative dynamic imports with absolute paths
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
      remarkPlugins: [remarkFrontmatter, remarkGfm, remarkMath],
      rehypePlugins: [rehypeHighlight, rehypeKatex],
      providerImportSource: '@mdx-js/react',
    }),
    react(),
    tailwindcss(),
    fixDynamicImports(),
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
