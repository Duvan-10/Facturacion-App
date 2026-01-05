/**
 * ============================================================================
 * TEST E2E: VALIDACIÓN DE REDIRECCIÓN (ROOT GUARD)
 * Archivo: test/redirection.spec.js
 * Objetivo: Verificar que la app decide correctamente entre Bienvenida o Login
 *           dependiendo de si existen usuarios en la BD.
 * ============================================================================
 */
import { test, expect } from '@playwright/test';
import mysql from 'mysql2/promise';

// Configuración de Base de Datos (Ajusta si tu pass es diferente)
const dbConfig = {
    host: '127.0.0.1',
    user: 'root',
    password: '123456',
    database: 'apps_facturacion',
    port: 3306
};

test('Validar Redirección según estado actual de la BD', async ({ page }) => {
    // 1. Consultar estado actual de la BD (Sin modificarla)
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT COUNT(*) as total FROM users');
    const userCount = rows[0].total;
    await connection.end();

    console.log(`📊 Usuarios encontrados en BD: ${userCount}`);

    // 2. Navegar a la raíz
    await page.goto('/');

    // 3. Validar comportamiento según el estado encontrado
    if (userCount > 0) {
        console.log("👉 Esperando redirección al Login...");
        // Si hay usuarios, debe redirigir al Login
        await expect(page).toHaveURL(/.*\/login/);
    } else {
        console.log("👉 Esperando página de Bienvenida...");
        // Si no hay usuarios, debe quedarse en Bienvenida (NO login)
        await expect(page).not.toHaveURL(/.*\/login/);
        // Validar elemento característico de bienvenida
        await expect(page.getByRole('button', { name: /registrarse/i })).toBeVisible();
    }
});