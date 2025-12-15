// src/pages/auth/Register.jsx

import { useState } from 'react';
import { Link } from 'react-router-dom'; 
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo.png'; 
import './styles1.css';

function Register() {
    // ========================================================
    // HOOKS Y CONTEXTO
    // ========================================================
    // Obtenemos funciones de manejo de autenticación del contexto
    const { handleRegister, isLoading, statusMessage, setStatusMessage } = useAuth();

    // Estados locales para almacenar los datos del formulario
    const [name, setName] = useState('');
    const [identification, setIdentification] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    
    // Estado para manejar y mostrar los errores de validación de Frontend por campo
    const [errors, setErrors] = useState({}); 
    
    // ========================================================
    // DECLARACIÓN DE VARIABLES Y REGEX
    // ========================================================
    const titleText = 'Crear una nueva cuenta';
    const buttonText = isLoading ? 'Guardando...' : 'Completar Registro';

    // Patrones de expresiones regulares (Regex) para validación
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s-]+$/; // Letras, espacios, guiones y acentos
    const identificationRegex = /^[0-9]+$/; // Solo números
    const forbiddenEmailCharsRegex = /[<>"'();:\\,]/; // Caracteres peligrosos en el correo
    const MAX_DIGITS = 10; // Límite máximo para la cédula

    // ==========================================================
    // FUNCIÓN DE VALIDACIÓN COMPLETA POR CAMPO
    // Propósito: Ejecuta todas las reglas de validación para un campo específico.
    // Usada: Al perder el foco (onBlur) y al enviar el formulario (onSubmit).
    // ==========================================================
    const validateField = (fieldName, value) => {
        let errorMessage = '';

        if (fieldName === 'name') {
            if (!value.trim()) {
                errorMessage = 'El nombre es obligatorio.';
            } else if (!nameRegex.test(value)) {
                errorMessage = 'Solo se permiten letras, espacios, guiones y acentos.';
            }
        } else if (fieldName === 'identification') {
            if (!value.trim()) {
                errorMessage = 'La cédula es obligatoria.';
            } 
            // Valida que sean solo números Y que no exceda los 10 dígitos.
            else if (!identificationRegex.test(value) || value.length > MAX_DIGITS) {
                // Mensaje general de formato/longitud al hacer blur o submit
                errorMessage = `La cédula solo debe contener números maximo ${MAX_DIGITS} Digitos`;
            } 
        } else if (fieldName === 'email') {
            if (!value.trim()) {
                errorMessage = 'El correo electrónico es obligatorio.';
            } else if (forbiddenEmailCharsRegex.test(value)) {
                errorMessage = 'El correo contiene caracteres especiales inválidos.';
            } else if (!emailRegex.test(value)) {
                // Validación de formato completa (ej. falta el punto o el dominio)
                errorMessage = 'Formato de correo inválido (ej. usuario@dominio.com).';
            }
        } else if (fieldName === 'password') {
            if (!value.trim()) {
                errorMessage = 'La contraseña es obligatoria.';
            } else if (value.length < 6) { 
                 errorMessage = 'La contraseña debe tener al menos 6 caracteres.';
            }
        }
        return errorMessage; // Devuelve el mensaje de error o una cadena vacía
    }
    
    // ==========================================================
    // FUNCIÓN DE MANEJO DE CAMBIO (onChange)
    // Propósito: Actualiza el estado del input y realiza validación INSTANTÁNEA
    //            solo para caracteres inválidos/prohibidos.
    // ==========================================================
    const handleChange = (e, setter) => {
        const { name: fieldName, value } = e.target;
        setter(value); // 1. Actualiza el estado del input

        let currentErrors = { ...errors }; 
        
        // 2. Validación Instantánea (Solo Caracteres Prohibidos)
        if (fieldName === 'name' && value.trim() && !nameRegex.test(value)) {
            currentErrors.name = 'Solo se permiten letras, espacios, guiones y acentos.';
        } else if (fieldName === 'identification' && value.trim() && !identificationRegex.test(value)) {
             // Mensaje específico de Carácter Inválido (Ej: el usuario teclea una letra)
            currentErrors.identification = 'Caracter Invalido solo Numeros';
        } else if (fieldName === 'email' && forbiddenEmailCharsRegex.test(value)) {
            currentErrors.email = 'El correo contiene caracteres especiales inválidos.';
        } else if (fieldName === 'password' && value.trim() && value.length > 0 && value.length < 6) {
            currentErrors.password = 'La contraseña debe tener al menos 6 caracteres.';
        } else {
            // Si no hay errores instantáneos, borra cualquier error previo en ese campo.
            delete currentErrors[fieldName];
        }

        setErrors(currentErrors); // 3. Actualiza el estado de errores para habilitar/deshabilitar el botón
    };

    // ==========================================================
    // FUNCIÓN BLUR (onBlur)
    // Propósito: Ejecuta la validación COMPLETA de un campo (incluyendo obligatoriedad, formato y longitud) 
    //            una vez que el usuario ha terminado de interactuar con él.
    // ==========================================================
    const handleBlur = (e) => {
        const { name: fieldName, value } = e.target;
        
        // Ejecutamos la validación completa del campo.
        const errorMessage = validateField(fieldName, value);
        
        setErrors(prevErrors => {
            const newErrors = { ...prevErrors };
            if (errorMessage) {
                // Si hay error (obligatoriedad, formato, longitud, etc.), lo establece.
                newErrors[fieldName] = errorMessage;
            } else {
                // Si no hay error, lo borra (desbloquea el botón si era el último error).
                delete newErrors[fieldName];
            }
            return newErrors;
        });
    };

    // ==========================================================
    // FUNCIÓN SUBMIT (onSubmit)
    // Propósito: Previene el envío, ejecuta la validación final de todos los campos 
    //            y llama a la función de registro si todo es válido.
    // ==========================================================
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (setStatusMessage) setStatusMessage(''); // Limpia mensajes de estado previos
        
        // Validación final de todos los campos
        let finalErrors = {};
        let fields = { name, identification, email, password };

        Object.keys(fields).forEach(key => {
            const error = validateField(key, fields[key]);
            if (error) {
                finalErrors[key] = error;
            }
        });

        setErrors(finalErrors);
        const isValid = Object.keys(finalErrors).length === 0;

        if (!isValid) { 
            console.log('Validación de Frontend fallida. No se envía el formulario.');
            return; // Bloquea el envío
        }

        // Si la validación es exitosa, procede al registro (llamada al backend)
        const userData = { name, identification, email, password };
        await handleRegister(userData);
    };

    // ==========================================================
    // ESTRUCTURA DEL COMPONENTE (RENDERIZADO)
    // ==========================================================
    return (
        <main className="auth">
            <section className="auth-card" aria-labelledby="auth-title">
                
                <header className="auth-header">
                    <img src={logo} alt="PFEPS Logo" className="brand-logo" /> 
                    <h1 id="auth-title">PFEPS</h1>
                    <p className="subtitle">{titleText}</p> 
                    <p className="tagline">Software de Facturación Electrónica</p>
                </header>
                
                <form onSubmit={handleSubmit}>
                    
                    {/* 1. Campo de Nombre */}
                    <div className="field">
                        <label htmlFor="name">Nombre Completo</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            placeholder="Ej. Juan Pérez"
                            value={name}
                            onChange={(e) => handleChange(e, setName)} 
                            onBlur={handleBlur} // Valida al salir (obligatoriedad y formato)
                            // ✅ Aplica la clase de error si el campo tiene un error
                            className={errors.name ? 'input-error' : ''}
                        />
                        {/* Muestra el error si existe en el estado 'errors' */}
                        {errors.name && <p className="help error">{errors.name}</p>}
                    </div>

                    {/* 2. Campo de Identificación */}
                    <div className="field">
                        <label htmlFor="identification">Identificación (Cédula)</label>
                        <input
                            type="text"
                            id="identification"
                            name="identification"
                            placeholder="Tu número de cédula"
                            value={identification}
                            // Limita la entrada máxima a 10 dígitos
                            maxLength={MAX_DIGITS} 
                            onChange={(e) => handleChange(e, setIdentification)}
                            onBlur={handleBlur} // Valida al salir (obligatoriedad y longitud)
                            // ✅ Aplica la clase de error si el campo tiene un error
                            className={errors.identification ? 'input-error' : ''}
                        />
                        <small className="help">Este campo es obligatorio y único.</small>
                        {/* Muestra el error de Carácter/Longitud */}
                        {errors.identification && <p className="help error">{errors.identification}</p>}
                    </div>

                    {/* 3. Campo de Email */}
                    <div className="field">
                        <label htmlFor="email">Correo electrónico</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Usa tu correo registrado"
                            value={email}
                            onChange={(e) => handleChange(e, setEmail)}
                            onBlur={handleBlur} // Valida al salir (obligatoriedad y formato)
                            // ✅ Aplica la clase de error si el campo tiene un error
                            className={errors.email ? 'input-error' : ''}
                        />
                        {/* Muestra el error de Carácter/Formato */}
                        {errors.email && <p className="help error">{errors.email}</p>}
                    </div>

                    {/* 4. Campo de Contraseña */}
                    <div className="field">
                        <div className="label-row">
                            <label htmlFor="password">Contraseña</label>
                            <button
                                type="button"
                                className="link-button" 
                                onClick={() => setShowPassword(prev => !prev)}
                            >
                                {showPassword ? 'Ocultar' : 'Mostrar'}
                            </button>
                        </div>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            name="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => handleChange(e, setPassword)}
                            onBlur={handleBlur} // Valida al salir (obligatoriedad y longitud mínima)
                            // ✅ Aplica la clase de error si el campo tiene un error
                            className={errors.password ? 'input-error' : ''}
                        />
                        {errors.password && <p className="help error">{errors.password}</p>}
                    </div>

                    {/* Acciones del Formulario */}
                    <div className="form-actions">
                        <button 
                            type="submit" 
                            className="btn primary" 
                            // Deshabilita el botón si está cargando O si hay errores en el estado 'errors'
                            disabled={isLoading || Object.keys(errors).length > 0} 
                        >
                            {/* ✅ Muestra el icono de candado si el botón está deshabilitado */}
                            {isLoading || Object.keys(errors).length > 0 ? (
                                <>
                                    <i className="fa-solid fa-lock icon-locked"></i> 
                                    {buttonText}
                                </>
                            ) : (
                                buttonText
                            )}
                        </button>
                    </div>
                    
                    {/* Enlace de Navegación a Login */}
                    <div className="register-wrapper">
                        <p className="subtitle">
                            ¿Ya tienes una cuenta? <Link to="/login" className="link">Iniciar sesión</Link>
                        </p>
                    </div>

                    {/* Mensaje de estado (éxito/error) */}
                    {statusMessage && <p className="status error-message" role="status" aria-live="polite">{statusMessage}</p>}
                </form>

            </section>
        </main>
    );
}

export default Register;