/**
 * ============================================================================
 * CONTROLADOR DE AUTENTICACIÓN (Lógica de Negocio)
 * Maneja el registro, login y validación de usuarios.
 * ============================================================================
 */
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { Op } from 'sequelize'; // Operadores de Sequelize (para consultas OR)

export const register = async (req, res) => {
    try {
        // 1. Obtener datos del cuerpo de la petición (Frontend)
        const { identification, name, email, password } = req.body;

        // 2. Validar campos obligatorios
        if (!identification || !name || !email || !password) {
            return res.status(400).json({ message: "Todos los campos son obligatorios" });
        }

        // 3. Verificar si el usuario ya existe (por email O identificación)
        const userFound = await User.findOne({
            where: {
                [Op.or]: [
                    { email: email },
                    { identification: identification }
                ]
            }
        });

        if (userFound) {
            return res.status(400).json({
                message: userFound.email === email
                    ? "El correo ya está registrado"
                    : "La identificación ya está registrada"
            });
        }

        // 4. Encriptar la contraseña
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // 5. Crear y guardar el usuario en la Base de Datos
        // Nota: 'role', 'created_at' y 'updated_at' se generan automáticamente/por defecto
        const newUser = await User.create({
            identification,
            name,
            email,
            password: passwordHash,
            role: 'admin' // Forzamos el rol o dejamos el default del modelo
        });

        // LOG DE CONFIRMACIÓN: Para ver en la consola del servidor
        console.log(`✅ NUEVO USUARIO REGISTRADO: ${newUser.name} (${newUser.email})`);

        // 6. Responder al Frontend
        res.status(201).json({
            message: "Usuario registrado exitosamente",
            user: { id: newUser.id, name: newUser.name, email: newUser.email }
        });

    } catch (error) {
        console.error("Error en registro:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

export const checkSystemStatus = async (req, res) => {
    try {
        // Contamos cuántos usuarios existen en total
        const count = await User.count();
        // Retornamos true si hay al menos uno, false si está vacío
        res.json({ hasUsers: count > 0 });
    } catch (error) {
        console.error("Error verificando estado del sistema:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

export const login = async (req, res) => {
    try {
        // Extraer credenciales enviadas por el frontend
        const { email, password } = req.body;

        // Validar que ambos campos vengan presentes
        if (!email || !password) {
            return res.status(400).json({ message: 'Correo y contraseña son obligatorios' });
        }

        // Buscar al usuario por su correo
        const existingUser = await User.findOne({ where: { email } });
        if (!existingUser) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        // Comparar contraseñas usando bcrypt
        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        // Preparar datos seguros del usuario para la respuesta
        const safeUser = {
            id: existingUser.id,
            name: existingUser.name,
            email: existingUser.email,
            role: existingUser.role,
        };

        // Token simple para mantener compatibilidad con el frontend actual
        const token = `token-${existingUser.id}-${Date.now()}`;

        return res.json({
            message: 'Inicio de sesión exitoso',
            token,
            user: safeUser,
        });
    } catch (error) {
        console.error('Error en login:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};