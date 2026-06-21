import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// LƯU Ý: đổi `base` cho khớp tên repo của bạn.
// - Nếu repo là  https://github.com/<user>/dukiti-portal  -> base = '/dukiti-portal/'
// - Nếu repo là  https://github.com/<user>/<user>.github.io -> base = '/'
export default defineConfig({
  base: '/dukiti-portal/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
