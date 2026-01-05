import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // 👈 ESTO ES CLAVE: Permite que el servidor sea accesible desde la red (IP)
    port: 5173, // Puerto por defecto
  }
});
