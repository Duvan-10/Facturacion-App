/**
 * ============================================================
 * TEST E2E: FUNCIONALIDAD Y VISTA DEL HOME
 * Archivo: home.spec.js
 * OBJETIVO:
 *  - Verificar la seguridad de rutas protegidas (Redirección al Login).
 *  - Validar el flujo completo de autenticación y acceso al Dashboard.
 *  - Comprobar la presencia visual de elementos clave (Sidebar, Cards).
 * ============================================================
 */
import { test, expect } from '@playwright/test';

test('Seguridad: Acceso directo a /home sin sesión debe redirigir al Login', async ({ page }) => {
  // Intentamos entrar directamente sin loguearnos
  await page.goto('/home');
  // El sistema debe rechazarnos y mandarnos al login
  await expect(page).toHaveURL(/.*\/login/);
});

test('Flujo completo: Login y Visualización del Home', async ({ page }) => {
  // --- PASO 1: AUTENTICACIÓN ---
  // Navegamos primero al login para obtener acceso
  await page.goto('/login');

  // Llenamos el formulario (Ajusta estos datos con un usuario válido de tu BD)
  // Usamos selectores genéricos robustos (input type email/password)
  await page.fill('input[type="email"]', 'soy_bot@playwright.com'); 
  await page.fill('input[type="password"]', '123456');

  // Hacemos clic en el botón de ingresar (busca por tipo submit o texto)
  await page.click('button[type="submit"]');

  // Esperamos explícitamente a que la URL cambie a /home (Redirección exitosa)
  await page.waitForURL('**/home');

  // 2. VERIFICACIÓN VISUAL: Sidebar
  const sidebar = page.locator('.sidebar');
  await expect(sidebar).toBeVisible();
  
  // Verificar que contenga el texto "Usuario"
  await expect(sidebar).toContainText('Usuario');

  // 3. VERIFICACIÓN VISUAL: Contenido Principal
  const mainContent = page.locator('.main-content');
  await expect(mainContent).toBeVisible();

  // Verificar el título de bienvenida
  await expect(page.getByRole('heading', { name: 'Bienvenido al sistema de Facturación Electrónica' })).toBeVisible();

  // 4. VERIFICACIÓN VISUAL: Tarjetas de información
  const cards = page.locator('.card');
  await expect(cards).toHaveCount(3);

  // 5. EVIDENCIA: Tomar captura de pantalla final
  await page.screenshot({ path: 'home-visual-check.png', fullPage: true });
});