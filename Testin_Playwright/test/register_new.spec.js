/**
 * ============================================================================
 * TEST E2E: PRUEBA DE REGISTRO DE NUEVO USUARIO
 * Navegación -> Formulario -> Base de Datos
 * ============================================================================
 */
import { test, expect } from '@playwright/test';
import mysql from 'mysql2/promise';

// TODO: Mover las credenciales a variables de entorno para mayor seguridad.
const dbConfig = {
    host: '127.0.0.1',
    user: 'root',
    password: '123456',
    database: 'apps_facturacion',
    port: 3306
};

// Datos de prueba centralizados
const testUser = {
    identification: '1095832991',
    name: 'TestingPlayWright',
    email: 'testing_bot@playwright.com',
    password: '123456'
};

test.describe('Prueba de registro de nuevo usuario', () => {
    let dbConnection;

    // Conectar a la BD antes de las pruebas y garantizar un estado limpio.
    test.beforeAll(async () => {
        dbConnection = await mysql.createConnection(dbConfig);
        // Limpieza preventiva: Borrar el usuario si existe de una ejecución anterior.
        // Esto garantiza que la prueba siempre se pueda ejecutar de nuevo sin fallos por duplicados.
        await dbConnection.execute('DELETE FROM users WHERE identification = ?', [testUser.identification]);
    });

    // Cerrar la conexión de la base de datos al finalizar todas las pruebas.
    test.afterAll(async () => {
        if (dbConnection) await dbConnection.end();
    });

    test('Debe registrar un nuevo usuario y validarlo en la base de datos', async ({ page }) => {
        // --- PASO 1: NAVEGACIÓN A LA PÁGINA DE REGISTRO ---
        await page.goto('/');
        await page.getByRole('button', { name: /registrarse/i }).click();
        
        // Verificaciones de navegación
        await expect(page).toHaveURL(/.*\/register/);
        await expect(page.getByText('Crear una nueva cuenta de Administrador')).toBeVisible();

        // --- PASO 2: LLENADO DEL FORMULARIO CON LOCATORS ROBUSTOS ---
        await page.getByLabel('NIT / CC').fill(testUser.identification);
        await page.getByLabel('Nombre Completo').fill(testUser.name);
        await page.getByLabel('Correo electrónico').fill(testUser.email);
        await page.getByLabel('Contraseña').fill(testUser.password);
        await page.getByLabel('Confirmar Contraseña').fill(testUser.password);

        // --- PASO 3: ENVÍO Y VALIDACIÓN DE LA RESPUESTA DE LA UI ---
        await page.getByRole('button', { name: /completar registro/i }).click();

        // Esperamos el mensaje de éxito definido en el frontend.
        await expect(page.getByText('¡Registro Exitoso! Redirigiendo...')).toBeVisible();

        // --- PASO 4: VALIDACIÓN EN BASE DE DATOS ---
        const [rows] = await dbConnection.execute(
            'SELECT identification, name, email FROM users WHERE identification = ?',
            [testUser.identification]
        );

        // Aserciones para verificar que el usuario se guardó correctamente.
        expect(rows.length).toBe(1); // Debe existir un único registro.
        const userInDb = rows[0];
        expect(userInDb.name).toBe(testUser.name);
        expect(userInDb.email).toBe(testUser.email);
    });
});
