#!/usr/bin/env node

/**
 * Build script for JupyterLite
 * This creates a self-hosted JupyterLite instance with our notebooks bundled in
 * Uses uvx for fast, isolated Python tool execution
 */

import { execSync } from 'child_process';
import { existsSync, mkdirSync, rmSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const outputDir = join(rootDir, 'public', 'jupyterlite');
const notebooksDir = join(rootDir, 'content', 'notebooks');

console.log('🪐 Building JupyterLite...\n');

// Check if uv/uvx is available
try {
  execSync('uvx --version', { stdio: 'pipe' });
} catch {
  console.error('❌ uv is required to build JupyterLite');
  console.error('   Install it with: curl -LsSf https://astral.sh/uv/install.sh | sh');
  console.error('   Or: brew install uv');
  process.exit(1);
}

// Clean previous build
if (existsSync(outputDir)) {
  console.log('🧹 Cleaning previous build...');
  rmSync(outputDir, { recursive: true });
}

// Create output directory
mkdirSync(outputDir, { recursive: true });

// Build JupyterLite using uvx (no venv needed - uvx handles isolation)
console.log('🔨 Building JupyterLite with notebooks...');
console.log('   Using uvx for isolated execution\n');

try {
  execSync(
    `uvx --with jupyterlite-core --with jupyterlite-pyodide-kernel jupyter lite build --contents "${notebooksDir}" --output-dir "${outputDir}"`,
    { cwd: rootDir, stdio: 'inherit' }
  );
  console.log('\n✅ JupyterLite built successfully!');
  console.log(`   Output: ${outputDir}`);
  console.log('\n📓 Bundled notebooks:');
  
  // List notebooks
  const notebooks = readdirSync(notebooksDir).filter(f => f.endsWith('.ipynb'));
  notebooks.forEach(nb => console.log(`   - ${nb}`));
  
} catch (error) {
  console.error('❌ Failed to build JupyterLite:', error.message);
  process.exit(1);
}

console.log('\n🚀 JupyterLite is ready!');
console.log('   Access it at: /jupyterlite/lab/index.html');
console.log('   Open notebook: /jupyterlite/lab/index.html?path=notebook.ipynb');
