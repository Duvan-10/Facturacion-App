const { test, expect } = require('@playwright/test');

test('Validar que Cargue la Pagina de Bienvenida', async ({ page }) => {
  // 1. NAVEGAR A LA PÁGINA PRINCIPAL DE LA APLICACIÓN
  // Asegúrate de que la URL coincide con el puerto donde se ejecuta tu aplicación Vite
  await page.goto('http://localhost:5173/');

  // 2. VERIFICAR QUE EL TÍTULO DE BIENVENIDA ES VISIBLE
  // Buscamos un elemento <h2> que contenga el texto de bienvenida.
  const welcomeTitle = page.locator('h2', { hasText: 'Bienvenido al Sistema de Facturación Electrónica.' });

  // 3. ASEGURARSE DE QUE EL ELEMENTO ES VISIBLE
  // La prueba será exitosa si el elemento es encontrado y visible en la página.
  await expect(welcomeTitle).toBeVisible();
});
