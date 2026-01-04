/**
 * ============================================================================
 * MODELO DE USUARIO (Esquema de Base de Datos)
 * Define la estructura de la tabla en la base de datos MySQL usando Sequelize.
 * ============================================================================
 */
import { DataTypes } from 'sequelize'; // Tipos de datos (STRING, INTEGER, etc.)
import db from '../config/db.js'; // Importamos la conexión a la BD

// Definición del Modelo 'User'
const User = db.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    identification: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true, // No pueden haber dos usuarios con la misma cédula
        comment: 'Cédula o NIT del usuario'
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Nombre completo del usuario'
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true, // El correo debe ser único en el sistema
        validate: {
            isEmail: true // Validación automática de formato de correo
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'Contraseña encriptada (Hash)'
    },
    role: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: 'admin', // Por defecto 'admin' (según tu frontend) o 'user'
        comment: 'Rol del usuario (admin, vendedor, etc.)'
    }
}, {
    timestamps: true, // Habilita created_at y updated_at
    underscored: true // Fuerza el uso de snake_case (created_at) en la BD
});

export default User;