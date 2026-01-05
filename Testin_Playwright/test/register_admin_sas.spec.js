/**
 * ============================================================================
 * TEST E2E: REGISTRO DE ADMINISTRADOR (EMPRESA SAS)
 * Archivo: test/register_admin_sas.spec.js
 * ============================================================================
 */
import { test, expect } from '@playwright/test';
import mysql from 'mysql2/promise';

// Configuración de Base de Datos
const dbConfig = {
    host: '127.0.0.1',
    user: 'root',
    password: '123456',
    database: 'apps_facturacion',
    port: 3306
};

// Datos del usuario a registrar
const adminUser = {
    identification: '1095832666',
    name: 'Testing.SAS',
    email: 'soy_bot@playwright.com',
    password: '123456'
};

test.describe('Registro de Nuevo Administrador (Testing.SAS)', () => {
    let dbConnection;

    // 1. Preparación del entorno (Limpieza de BD)
    test.beforeAll(async () => {
        dbConnection = await mysql.createConnection(dbConfig);
        
        // Eliminamos el usuario si ya existe para asegurar que el test no falle por duplicados
        await dbConnection.execute(
            'DELETE FROM users WHERE identification = ? OR email = ?', 
            [adminUser.identification, adminUser.email]
        );
    });

    // 2. Cierre de conexiones
    test.afterAll(async () => {
        if (dbConnection) await dbConnection.end();
    });

    test('Debe registrar correctamente la empresa Testing.SAS y validar en BD', async ({ page }) => {
        // --- NAVEGACIÓN ---
        await page.goto('/');
        
        // Asumiendo que en la Home/Welcome hay un botón "Registrarse"
        await page.getByRole('button', { name: /registrarse/i }).click();
        
        // Verificamos que estamos en la URL correcta
        await expect(page).toHaveURL(/.*\/register/);

        // --- LLENADO DEL FORMULARIO ---
        // Usamos los labels actualizados
        await page.getByLabel('NIT / CC').fill(adminUser.identification);
        await page.getByLabel('Nombre Completo / Razón Social').fill(adminUser.name);
        await page.getByLabel('Correo electrónico').fill(adminUser.email);
        
        // Usamos { exact: true } para diferenciar "Contraseña" de "Confirmar Contraseña"
        await page.getByLabel('Contraseña', { exact: true }).fill(adminUser.password);
        await page.getByLabel('Confirmar Contraseña').fill(adminUser.password);

        // --- ENVÍO ---
        await page.getByRole('button', { name: /completar registro/i }).click();

        // --- VALIDACIÓN FRONTEND ---
        // Esperamos el mensaje de éxito (Toast o Texto en pantalla)
        await expect(page.getByText('¡Registro Exitoso! Redirigiendo...')).toBeVisible();

        // --- VALIDACIÓN BACKEND (BASE DE DATOS) ---
        // Consultamos si el usuario realmente se creó
        const [rows] = await dbConnection.execute(
            'SELECT identification, name, email, role FROM users WHERE identification = ?',
            [adminUser.identification]
        );

        expect(rows.length).toBe(1, 'El usuario debería existir en la base de datos');
        
        const registeredUser = rows[0];
        expect(registeredUser.name).toBe(adminUser.name);
        expect(registeredUser.email).toBe(adminUser.email);
        // Opcional: Verificar que se guardó como admin si esa es la lógica por defecto
        // expect(registeredUser.role).toBe('admin'); 
    });
});
