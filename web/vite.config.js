import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  // 支持 TypeScript 文件
  extensions: ['.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'http://ybb9647b.natappfree.cc',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/job-track-assistant')
      }
    }
  }
})
