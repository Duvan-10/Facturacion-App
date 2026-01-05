/**
 * ============================================================================
 * SERVIDOR PRINCIPAL (ENTRY POINT)
 * Configura Express, Middlewares de seguridad y arranca la aplicación.
 * ============================================================================
 */
import express from 'express'; // Framework para crear el servidor web
import cors from 'cors'; // Middleware para permitir peticiones desde otros dominios (React)
import cookieParser from 'cookie-parser'; // Middleware para leer cookies
import { connectDB } from './config/db.js'; // Importamos la función de conexión a BD
import authRoutes from './routes/auth.routes.js'; // Importamos las rutas de autenticación
import { checkSystemStatus } from './controllers/auth.controller.js';

// Inicialización de la aplicación Express
const app = express();

// Definición del puerto: usa el del entorno o el 4000 por defecto
const PORT = process.env.PORT || 4000;

// --- MIDDLEWARES (Funciones intermedias que procesan las peticiones) ---

// 1. CORS: Configuración de seguridad para permitir peticiones desde el Frontend
app.use(cors({
    origin: 'http://localhost:5173', // URL exacta de tu aplicación React (Vite)
    credentials: true                // Permite el envío de cookies y headers de autorización
}));

// 2. JSON Parser: Transforma el cuerpo de las peticiones (req.body) de texto a JSON
app.use(express.json());

// 3. Cookie Parser: Permite leer y gestionar cookies en las peticiones
app.use(cookieParser());

// --- INICIO DEL SERVIDOR ---

// Función principal asíncrona para iniciar los servicios en orden
const startServer = async () => {
    // 1. Conectar a la Base de Datos antes de iniciar el servidor web
    await connectDB();

    // Sincronizar modelos (crear tablas si no existen)
    // await import('./models/user.model.js').then(m => m.default.sync());

    // --- RUTAS ---
    
    // Ruta de prueba (Endpoint) para verificar estado del servidor
    app.get('/', (req, res) => {
        res.json({ message: 'API Facturación funcionando correctamente' });
    });

    // Ruta para verificar si el sistema ya tiene usuarios registrados
    app.get('/api/system-status', checkSystemStatus);

    // Rutas de la API (prefijo /api)
    app.use('/api', authRoutes);

    // 2. Poner el servidor a escuchar en el puerto definido
    app.listen(PORT, () => {
        console.log(`\n🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
};

// Ejecutar la función de inicio
startServer();