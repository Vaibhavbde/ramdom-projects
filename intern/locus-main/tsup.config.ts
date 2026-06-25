import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs'],
  dts: false,
  splitting: false,
  sourcemap: false,
  clean: true,
  outExtension: () => ({ js: '.js' }),
  // No banner needed: tsup preserves the shebang from src/index.ts automatically.
  // Adding banner here causes a duplicate shebang which breaks `node dist/index.js`.
  outDir: 'dist',
  external: [],
  noExternal: ['@modelcontextprotocol/sdk', 'yaml', 'zod'],
})
