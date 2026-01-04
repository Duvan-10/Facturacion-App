import { defineConfig, devices } from '@playwright/test';

/**
 * Configuración de Playwright
 * Este archivo permite que la extensión de VS Code detecte y ejecute las pruebas
 * ubicadas en la carpeta 'tests'.
 */
export default defineConfig({
  testDir: './test', // Indica que las pruebas están en la carpeta 'test'
  fullyParallel: true, // Ejecuta pruebas en paralelo para mayor velocidad
  reporter: 'html', // Genera un reporte HTML al finalizar
  
  // Configuración para lanzar la App automáticamente antes de las pruebas
  webServer: {
    command: 'npm run dev',      // Ejecuta el script 'dev' de la raíz (Backend + Frontend)
    url: 'http://localhost:5173', // Espera a que esta URL responda (200 OK)
    reuseExistingServer: !process.env.CI, // Si ya está corriendo, no lo reinicia
    cwd: '..',                   // Ejecuta desde la raíz del proyecto para levantar todo el sistema
  },

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
