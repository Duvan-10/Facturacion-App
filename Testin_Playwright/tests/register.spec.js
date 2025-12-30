const { test, expect } = require('@playwright/test');

test('Validar que el botón de registrarse redirija al formulario de registro', async ({ page }) => {
  // 1. NAVEGAR A LA PÁGINA DE BIENVENIDA
  // Asegúrate de que la URL coincide con el puerto donde se ejecuta tu aplicación Vite
  await page.goto('http://localhost:5173/');

  // 2. HACER CLIC EN EL BOTÓN DE REGISTRARSE
  // Buscamos el botón por su clase única y hacemos clic
  const registerButton = page.locator('.onboarding-button-register');
  await registerButton.click();

  // 3. VERIFICAR LA URL DE LA PÁGINA DE REGISTRO
  // La URL debe haber cambiado a /register
  await expect(page).toHaveURL('http://localhost:5173/register');

  // 4. VERIFICAR QUE EL TÍTULO DEL FORMULARIO DE REGISTRO ES VISIBLE
  // Buscamos un elemento <p> con la clase 'subtitle' que contenga el texto del formulario.
  const registerTitle = page.locator('p.subtitle', { hasText: 'Crear una nueva cuenta' });

  // 5. ASEGURARSE DE QUE EL TÍTULO ES VISIBLE
  // La prueba será exitosa si el elemento es encontrado y visible.
  await expect(registerTitle).toBeVisible();
});
