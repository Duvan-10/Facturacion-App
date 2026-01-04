/**
 * ============================================================================
 * TEST E2E: PRUEBA DE REGISTRO DE NUEVO USUARIO
 * Navegación -> Formulario -> Base de Datos
 * ============================================================================
 */
import { test, expect } from '@playwright/test';
import mysql from 'mysql2/promise';

// Configuración de conexión a BD para validación
const dbConfig = {
    host: '127.0.0.1',
    user: 'root',
    password: '123456',
    database: 'apps_facturacion',
    port: 3306
};

test.describe('Prueba de registro de nuevo usuario', () => {
    let dbConnection;

    // Conectar a la BD antes de las pruebas
    test.beforeAll(async () => {
        dbConnection = await mysql.createConnection(dbConfig);
        // Limpieza preventiva: Borrar el usuario si ya existe (para evitar errores de duplicados)
        await dbConnection.execute('DELETE FROM users WHERE identification = ?', ['1095832991']);
    });

    // Cerrar conexión al finalizar
    test.afterAll(async () => {
        if (dbConnection) await dbConnection.end();
    });

    test('Debe registrar un nuevo usuario y validarlo en la base de datos', async ({ page }) => {
        // --- PASO 1: NAVEGACIÓN ---
        await page.goto('/');
        
        // Buscar específicamente el botón "Registrarse" y hacer clic
        await page.getByRole('button', { name: /registrarse/i }).click();
        await expect(page).toHaveURL(/.*\/register/);
        await expect(page.getByText('Crear una nueva cuenta de Administrador')).toBeVisible();

        // --- PASO 2: DATOS DE PRUEBA ---
        const testUser = {
            identification: '1095832991',
            name: 'TestingPlayWright',
            email: 'testing_bot@playwright.com',
            password: '123456'
        };

        // --- PASO 3: LLENADO DEL FORMULARIO ---
        await page.fill('input[name="identification"]', testUser.identification);
        await page.fill('input[name="name"]', testUser.name);
        await page.fill('input[name="email"]', testUser.email);
        await page.fill('input[name="password"]', testUser.password);
        await page.fill('input[name="confirmPassword"]', testUser.password);

        // --- PASO 4: ENVÍO Y VALIDACIÓN VISUAL ---
        await page.click('button[type="submit"]');

        // Esperamos el mensaje exacto definido en Register.jsx
        await expect(page.getByText('¡Registro Exitoso! Redirigiendo...')).toBeVisible();

        // --- PASO 5: VALIDACIÓN EN BASE DE DATOS ---
        const [rows] = await dbConnection.execute(
            'SELECT * FROM users WHERE identification = ?',
            [testUser.identification]
        );

        expect(rows.length).toBe(1); // Debe existir el registro
        expect(rows[0].name).toBe(testUser.name);
        expect(rows[0].email).toBe(testUser.email);
        console.log(`✅ Usuario ${testUser.identification} verificado en MySQL.`);

        // --- PASO 6: LIMPIEZA ---
        await dbConnection.execute('DELETE FROM users WHERE identification = ?', [testUser.identification]);
    });
});
