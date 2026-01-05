/**
 * ============================================================================
 * RUTAS DE AUTENTICACIÓN (API)
 * Define los endpoints para registro y login.
 * ============================================================================
 */
import { Router } from 'express';
import { register, login } from '../controllers/auth.controller.js';

const router = Router();

// Ruta POST para registrar un nuevo usuario
// URL final: http://localhost:4000/api/register
router.post('/register', register);

// Ruta POST para iniciar sesión de un usuario existente
// URL final: http://localhost:4000/api/login
router.post('/login', login);

export default router;