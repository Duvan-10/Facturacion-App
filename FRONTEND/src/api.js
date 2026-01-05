/**
 * ============================================================
 * CONFIGURACIÓN DE API DINÁMICA
 * ============================================================
 */

// Detecta la IP o dominio actual del navegador
const hostname = window.location.hostname;

// Si no hay variable de entorno, construye la URL usando la misma IP del navegador
export const API_URL = import.meta.env.VITE_API_URL || `http://${hostname}:4000/api`;