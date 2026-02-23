import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        cli: resolve(__dirname, 'src/cli.ts'),
        main: resolve(__dirname, 'src/main.ts'),
      },
      name: 'Oexa',
      formats: ['es'],
    },
    
    rollupOptions: {
      external: [
        'vue',
        'vue-router',
        'marked',
        'mdui',
        'chalk',
        'commander',
        'fs-extra',
        'glob',
        'gray-matter',
        'ora',
        'prompts',
      ],
      output: {
        globals: {
          vue: 'Vue',
          'vue-router': 'VueRouter',
          marked: 'marked',
          mdui: 'mdui',
        },
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
      },
    },
    
    outDir: 'dist',
    emptyDirBeforeWrite: true,
    sourcemap: true,
  },
  
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
})
