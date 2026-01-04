/**
 * ============================================================================
 * RUTAS DE AUTENTICACIÓN (API)
 * Define los endpoints para registro y login.
 * ============================================================================
 */
import { Router } from 'express';
import { register } from '../controllers/auth.controller.js';

const router = Router();

// Ruta POST para registrar un nuevo usuario
// URL final: http://localhost:4000/api/register
router.post('/register', register);

export default router;