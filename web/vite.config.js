import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@job-ai/shared': path.resolve(__dirname, '../packages/shared/src'),
      // 开发模式：full-aui 指向本地组件库的 dist 目录
      'full-aui': path.resolve(__dirname, '../../job-ai-components/dist')
    }
  },
  // 支持 TypeScript 文件
  extensions: ['.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
  server: {
    port: 3000,
    host: '127.0.0.1',
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  }
})
