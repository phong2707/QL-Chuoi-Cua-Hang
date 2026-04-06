import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Khi React gọi bất kỳ link nào bắt đầu bằng /api
      '/api': {
        target: 'http://localhost:3000', // Nó sẽ gửi sang Server ở cổng 3000
        changeOrigin: true,
        // Dòng này rất quan trọng: nó xóa chữ /api đi trước khi gửi sang Backend
        // Ví dụ: /api/auth/register -> thành /auth/register
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});