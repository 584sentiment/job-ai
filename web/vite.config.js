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
  // GitHub Pages 部署配置
  // 如果部署到 https://username.github.io/repo-name/，设置为 '/repo-name/'
  // 如果部署到 https://username.github.io/，设置为 '/'
  base: process.env.NODE_ENV === 'production' ? '/job-ai/' : '/',
  server: {
    port: 3000,
    host: '127.0.0.1',
    allowedHosts: ['cb7a8624.natappfree.cc'],
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
