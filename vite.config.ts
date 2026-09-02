import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Конфигурация сборки. Ничего менять не нужно.
export default defineConfig({
  plugins: [react()],
});
