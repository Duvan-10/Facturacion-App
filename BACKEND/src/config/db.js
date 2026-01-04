/**
 * ============================================================================
 * CONFIGURACIÓN DE LA BASE DE DATOS (MySQL con Sequelize)
 * Establece la conexión, credenciales y parámetros del ORM.
 * ============================================================================
 */
import { Sequelize } from 'sequelize'; // Importamos el ORM Sequelize para manejar la BD
import dotenv from 'dotenv'; // Importamos dotenv para leer variables de entorno

// Cargar variables de entorno desde el archivo .env
dotenv.config();

// Instancia de conexión a la base de datos MySQL
const db = new Sequelize(
    process.env.DB_NAME || 'facturacion_db', // Nombre de la base de datos
    process.env.DB_USER || 'root',           // Usuario (ej. root)
    process.env.DB_PASSWORD || '',           // Contraseña
    {
        host: process.env.DB_HOST || 'localhost', // Dirección del servidor (IP o dominio)
        port: process.env.DB_PORT || 3306,        // Puerto de conexión
        dialect: 'mysql',                         // Motor de base de datos a utilizar
        logging: false,                           // false para no mostrar cada consulta SQL en la consola
    }
);

 // Función asíncrona para verificar que la conexión es correcta
export const connectDB = async () => {
    try {
        await db.authenticate(); // Intenta conectar con las credenciales dadas
        console.log('✅ Conexión exitosa a la base de datos MySQL');
    } catch (error) {
        console.error('❌ Error al conectar a la base de datos:', error);
    }
};

// Exportamos la instancia 'db' para usarla en los Modelos (tablas)
export default db;
