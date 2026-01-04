import { defineConfig, devices } from '@playwright/test';

/**
 * Configuración de Playwright
 * Este archivo permite que la extensión de VS Code detecte y ejecute las pruebas
 * ubicadas en la carpeta 'tests'.
 */
export default defineConfig({
  testDir: './test', // Indica que las pruebas están en la carpeta 'test'
  fullyParallel: true, // Ejecuta pruebas en paralelo para mayor velocidad
  reporter: [['html', { open: 'always' }]], // Genera un reporte HTML y lo abre siempre
  
  // Configuración para lanzar la App automáticamente antes de las pruebas
  webServer: [
    {
      command: 'npm start',
      cwd: '../BACKEND',
      url: 'http://localhost:4000',
      reuseExistingServer: !process.env.CI,
    },
    {
      command: 'npm run f',
      cwd: '../FRONTEND',
      url: 'http://localhost:5173',
      reuseExistingServer: !process.env.CI,
    },
  ],

  use: {
    // URL base de tu Frontend (facilita los goto('/') en los tests)
    baseURL: 'http://localhost:5173',
    
    // Recolectar trazas (video/pasos) cuando falla una prueba (muy útil para depurar)
    trace: 'on-first-retry',
  },

  // Configuración de navegadores
  projects: [
    {
      name: 'Google Chrome',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
