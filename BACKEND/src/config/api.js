/**
 * ============================================================
 * CONFIGURACIÓN DE API DINÁMICA
 * Centraliza la URL del backend para toda la aplicación.
 * ============================================================
 */

// 1. Obtenemos el hostname actual desde el navegador
//    - Si estás en la PC, será 'localhost'
//    - Si estás en el celular, será la IP (ej: '192.168.1.50')
const hostname = window.location.hostname;

// 2. Definimos el puerto donde corre tu Backend (Node.js)
const BACKEND_PORT = 4000;

// 3. Exportamos la URL final
//    Lógica: Si definiste una variable en .env (VITE_API_URL), úsala (prioridad alta).
//    Si no, construye la URL automáticamente usando la IP actual + el puerto del backend.
export const API_URL = import.meta.env.VITE_API_URL || `http://${hostname}:${BACKEND_PORT}/api`;
