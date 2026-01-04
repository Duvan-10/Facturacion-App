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