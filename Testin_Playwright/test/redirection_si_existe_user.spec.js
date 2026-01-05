/**
 * ============================================================================
 * TEST E2E: VALIDACIÓN DE REDIRECCIÓN AUTOMÁTICA
 * Archivo: test/redirection.spec.js
 * Objetivo: Verificar que la App redirige a Login si hay usuarios, 
 *           o muestra Bienvenida si no los hay.
 * ============================================================================
 */
import { test, expect } from '@playwright/test';
import mysql from 'mysql2/promise';

// Configuración de conexión a la Base de Datos
const dbConfig = {
    host: '127.0.0.1',
    user: 'root',
    password: '123456',
    database: 'apps_facturacion',
    port: 3306
};

test.describe('Lógica de Redirección Inicial (Root)', () => {
    let dbConnection;

    // Conexión antes de todos los tests
    test.beforeAll(async () => {
        dbConnection = await mysql.createConnection(dbConfig);
    });

    // Cierre de conexión al finalizar
    test.afterAll(async () => {
        if (dbConnection) await dbConnection.end();
    });

    test('Debe redirigir a Login si hay usuarios, o mostrar Bienvenida si no los hay', async ({ page }) => {
        // 1. Consultar el estado actual de la base de datos (Sin modificarla)
        const [rows] = await dbConnection.execute('SELECT COUNT(*) as count FROM users');
        const userCount = rows[0].count;
        
        console.log(`[TEST INFO] Usuarios encontrados en BD: ${userCount}`);

        // 2. Navegar a la raíz '/'
        await page.goto('/');

        // 3. Validación condicional según el estado de la BD
        if (userCount > 0) {
            // Caso: Existen usuarios -> Esperamos redirección al Login
            await expect(page).toHaveURL(/.*\/login/);
        } else {
            // Caso: No existen usuarios -> Esperamos página de Bienvenida
            await expect(page).toHaveURL(/.*\/$/);
            await expect(page.getByText('Bienvenido al Sistema de Facturación Electrónica')).toBeVisible();
        }
    });
});
