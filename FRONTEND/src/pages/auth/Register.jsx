// src/pages/auth/Register.jsx

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo.png'; 
import './styles1.css';
import { useEffect } from 'react';


function Register() {
    // ========================================================
    // HOOKS Y CONTEXTO
    // ========================================================
    const navigate = useNavigate();
    // ✅ CORRECCIÓN CLAVE AQUÍ: Cambiamos 'handleRegister' por 'register'
    const { register, isLoading, statusMessage, setStatusMessage } = useAuth();
    
    // Estados locales para almacenar los datos del formulario
    const [identification, setIdentification] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    
    // Estado para manejar si el registro fue exitoso (para aplicar estilos y redirección)
    const [registrationSuccess, setRegistrationSuccess] = useState(false);
    
    // Estado para manejar y mostrar los errores de validación de Frontend por campo
    const [errors, setErrors] = useState({}); 
    
    // Limpia el mensaje de estado al cargar el componente
    useEffect(() => {
        if (setStatusMessage) setStatusMessage('');
    }, [setStatusMessage]);

    // ========================================================
    // DECLARACIÓN DE VARIABLES Y REGEX
    // ========================================================
    const titleText = 'Crear cuenta Administrador';
    const buttonText = isLoading ? 'Guardando...' : 'Completar Registro';

    // Patrones de expresiones regulares (Regex) para validación
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Validar Formato básico de correo electrónico
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s\.-]+$/; // Letras, espacios, guiones y acentos
    const identificationRegex = /^[0-9]+$/; // Solo números
    const forbiddenEmailCharsRegex = /[?¡¿*<>"'();:\\,]/; // Caracteres peligrosos en el correo
    const MAX_DIGITS = 10; // Límite máximo para la cédula

    // ==========================================================
    // FUNCIÓN DE VALIDACIÓN COMPLETA POR CAMPO
    // ==========================================================
    const validateField = (fieldName, value) => {
        let errorMessage = '';

        if (fieldName === 'name') {
            if (!value.trim()) {
                errorMessage = 'El nombre es obligatorio.';
            } else if (!nameRegex.test(value)) {
                errorMessage = 'Solo se permiten letras y espacios.';
            }
        } else if (fieldName === 'identification') {
            if (!value.trim()) {
                errorMessage = 'La cédula es obligatoria.';
            } 
            else if (!identificationRegex.test(value) || value.length > MAX_DIGITS) {
                errorMessage = `La cédula solo debe contener números (máx. ${MAX_DIGITS} dígitos).`;
            } 
        } else if (fieldName === 'email') {
            if (!value.trim()) {
                errorMessage = 'El correo electrónico es obligatorio.';
            } else if (forbiddenEmailCharsRegex.test(value)) {
                errorMessage = 'El correo contiene caracteres especiales inválidos.';
            } else if (!emailRegex.test(value)) {
                errorMessage = 'Formato de correo inválido (ej. usuario@dominio.com).';
            }
        } else if (fieldName === 'password') {
            if (!value.trim()) {
                errorMessage = 'La contraseña es obligatoria.';
            } else if (value.length < 6) { 
                errorMessage = 'La contraseña debe tener al menos 6 caracteres.';
            }
        } else if (fieldName === 'confirmPassword') {
            if (value !== password) {
                errorMessage = 'Las contraseñas no coinciden.';
            }
        }
        return errorMessage;
    }
    
    // ==========================================================
    // FUNCIÓN DE MANEJO DE CAMBIO (onChange)
    // ==========================================================
    const handleChange = (e, setter) => {
        const { name: fieldName, value } = e.target;
        setter(value); 

        setErrors(prevErrors => {
            const newErrors = { ...prevErrors };
    
            // Limpieza de mensajes de estado/éxito al empezar a editar
            if (statusMessage || registrationSuccess) {
                setStatusMessage('');
                setRegistrationSuccess(false);
            }
            
            // --- Lógica de validación y limpieza de errores ---
    
            if (fieldName === 'name') {
                // Si el valor es inválido (y no está vacío), muestra el error.
                if (value && !nameRegex.test(value)) {
                    newErrors.name = 'Solo se permiten letras y espacios.';
                } else {
                    // Si es válido o está vacío, borra cualquier error que tuviera el campo.
                    delete newErrors.name;
                }
            }
    
            if (fieldName === 'identification') {
                if (value && !identificationRegex.test(value)) {
                    newErrors.identification = 'Caracter Inválido (solo números)';
                } else {
                    delete newErrors.identification;
                }
            }
    
            if (fieldName === 'email') {
                if (forbiddenEmailCharsRegex.test(value)) {
                    newErrors.email = 'El correo contiene caracteres especiales inválidos.';
                } else if (newErrors.email === 'El correo contiene caracteres especiales inválidos.') {
                    // Borra solo este error específico si se corrige, para no interferir
                    // con el error de formato que se valida en el blur.
                    delete newErrors.email;
                }
            }
            
            // Validación cruzada para la confirmación de contraseña
            if (fieldName === 'password' || fieldName === 'confirmPassword') {
                const currentPassword = fieldName === 'password' ? value : password;
                const currentConfirmPassword = fieldName === 'confirmPassword' ? value : confirmPassword;
    
                // Si el campo de confirmación tiene algo y no coincide, muestra el error.
                if (currentConfirmPassword && currentPassword !== currentConfirmPassword) {
                    newErrors.confirmPassword = 'Las contraseñas no coinciden.';
                } else {
                    // Si coinciden o el campo está vacío, borra el error.
                    delete newErrors.confirmPassword;
                }
            }
    
            // Para la contraseña, el error de longitud se manejará en el blur para mejor UX.
            // Si el usuario borra la contraseña, el error de 'no coinciden' debe desaparecer.
            if (fieldName === 'password' && !value) {
                delete newErrors.password;
            }

            return newErrors;
        });
    };

    // FUNCIÓN BLUR (onBlur)
    const handleBlur = (e) => {
        const { name: fieldName, value } = e.target;
        
        const errorMessage = validateField(fieldName, value);
        
        setErrors(prevErrors => {
            const newErrors = { ...prevErrors };
            if (errorMessage) {
                newErrors[fieldName] = errorMessage;
            } else {
                delete newErrors[fieldName];
            }
            // Validación cruzada: si se valida la contraseña, también valida la confirmación
            if (fieldName === 'password') {
                 if (confirmPassword && confirmPassword !== value) {
                     newErrors.confirmPassword = 'Las contraseñas no coinciden.';
                 } else {
                     delete newErrors.confirmPassword;
                 }
            }
            return newErrors;
        });
    };

    // ==========================================================
    // FUNCIÓN SUBMIT (onSubmit) - LÓGICA CENTRAL DE REGISTRO
    // ==========================================================
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (setStatusMessage) setStatusMessage('');
        
        // Validación final de todos los campos
        let finalErrors = {};
        let fields = { name, identification, email, password, confirmPassword }; 

        Object.keys(fields).forEach(key => {
            const error = validateField(key, fields[key]);
            if (error) {
                finalErrors[key] = error;
            }
        });

        setErrors(finalErrors);
        const isValid = Object.keys(finalErrors).length === 0;

        if (!isValid) { 
            setStatusMessage('Por favor, corrige los errores en el formulario para continuar.');
            return;
        }
        
        // 1. Datos a enviar con el ROL FIJO
        const userData = { 
            name, 
            identification, 
            email, 
            password, 
            role: 'ADMINISTRADOR'
        };
        
        // 2. Llamada al Contexto de Autenticación
        try {
            // ✅ CORRECCIÓN CLAVE AQUÍ: Llamamos a 'register'
            const success = await register(userData); 

            if (success) {
                // 3. REGISTRO EXITOSO: Mostrar mensaje de éxito y preparar redirección
                setRegistrationSuccess(true);
                // El statusMessage ya es establecido por AuthContext con el mensaje de éxito del registro
                setStatusMessage('✅ ¡Registro Exitoso! Serás redirigido para Iniciar Sesión.');
                
                // 4. REDIRECCIÓN A LOGIN después de 2 segundos
                setTimeout(() => {
                    navigate('/login', { replace: true });
                }, 2000); 
                
            } else {
                // Si 'register' devuelve false, el mensaje de error (ej: usuario duplicado) 
                // ya fue establecido por AuthContext.
                setRegistrationSuccess(false);
            }
        } catch (error) {
            console.error("Fallo inesperado durante el registro:", error);
            setStatusMessage('Ocurrió un error inesperado al intentar registrar. Revisa la consola para detalles.');
            setRegistrationSuccess(false);
        }
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
                </header>
                
                {/* MENSAJES DE ESTADO (Éxito / Error) */}
                {statusMessage && (
                    <p 
                        className={`status ${registrationSuccess ? 'success-message' : 'error-message'}`} 
                        role="status" 
                        aria-live="polite"
                    >
                        {statusMessage}
                    </p>
                )}
                
                <form onSubmit={handleSubmit}>
                    
                    {/* Campo de Identificación */}
                    <div className="field">
                        <label htmlFor="identification">Identificación (Cédula)</label>
                        <input
                            type="text"
                            id="identification"
                            name="identification"
                            placeholder="Tu número de cédula"
                            value={identification}
                            maxLength={MAX_DIGITS} 
                            onChange={(e) => handleChange(e, setIdentification)}
                            onBlur={handleBlur} 
                            className={errors.identification ? 'input-error' : ''}
                        />
                        <small className="help">Este campo es obligatorio y único.</small>
                        {errors.identification && <p className="help error">{errors.identification}</p>}
                    </div>

                    {/* Campo de Nombre */}
                    <div className="field">
                        <label htmlFor="name">Nombre Completo</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            placeholder="Ej. Juan Pérez"
                            value={name}
                            onChange={(e) => handleChange(e, setName)} 
                            onBlur={handleBlur}
                            className={errors.name ? 'input-error' : ''}
                        />
                        {errors.name && <p className="help error">{errors.name}</p>}
                    </div>

                    {/* Campo de Email */}
                    <div className="field">
                        <label htmlFor="email">Correo electrónico</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Usa tu correo registrado"
                            value={email}
                            onChange={(e) => handleChange(e, setEmail)}
                            onBlur={handleBlur} 
                            className={errors.email ? 'input-error' : ''}
                        />
                        {errors.email && <p className="help error">{errors.email}</p>}
                    </div>

                    {/* Campo de Contraseña */}
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
                            onBlur={handleBlur} 
                            className={errors.password ? 'input-error' : ''}
                        />
                        {errors.password && <p className="help error">{errors.password}</p>}
                    </div>
                    
                    {/* Campo: Confirmar Contraseña */}
                    <div className="field">
                        <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="confirmPassword"
                            name="confirmPassword"
                            placeholder="Vuelve a escribir la contraseña"
                            value={confirmPassword}
                            onChange={(e) => handleChange(e, setConfirmPassword)}
                            onBlur={handleBlur} 
                            className={errors.confirmPassword ? 'input-error' : ''}
                        />
                        {errors.confirmPassword && <p className="help error">{errors.confirmPassword}</p>}
                    </div>

                    {/* Acciones del Formulario */}
                    <div className="form-actions">
                        <button 
                            type="submit" 
                            className="btn primary" 
                            disabled={isLoading || Object.keys(errors).length > 0 || !email}
                        >
                            {/* El texto del botón ahora considera el estado de error/carga/éxito */}
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
            
                    </div>
                </form>

            </section>
        </main>
    );
}

export default Register;