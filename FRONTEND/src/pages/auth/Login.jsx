// src/pages/auth/Register.jsx

import { useState, useEffect } from 'react'; // ✅ Añadido useEffect
import { Link } from 'react-router-dom'; 
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo.png';
import './styles1.css';

function Register() {
    // ========================================================
    // HOOKS Y CONTEXTO
    // ========================================================
    const { handleRegister, isLoading, statusMessage, setStatusMessage } = useAuth();

    // Estados locales para almacenar los datos del formulario
    const [identification, setIdentification] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({}); 
    
    // ========================================================
    // ✅ NUEVOS ESTADOS PARA CONTROL DE ROLES Y VERIFICACIÓN
    // ========================================================
    const [selectedRole, setSelectedRole] = useState('Admin'); // Rol por defecto
    const [isAdminRegistered, setIsAdminRegistered] = useState(false);
    const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);

    // ========================================================
    // DECLARACIÓN DE VARIABLES Y REGEX
    // ========================================================
    const titleText = 'Crear una nueva cuenta';
    const buttonText = isLoading ? 'Guardando...' : `Completar Registro`; // Texto genérico

    // Patrones de expresiones regulares (Regex) para validación
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s-]+$/; 
    const identificationRegex = /^[0-9]+$/; 
    const forbiddenEmailCharsRegex = /[<>"'();:\\,]/; 
    const MAX_DIGITS = 10; 

    // ==========================================================
    // ✅ NUEVO: EFECTO PARA VERIFICAR SI YA EXISTE UN ADMINISTRADOR
    // ==========================================================
    useEffect(() => {
        const checkAdminStatus = async () => {
            // *** ATENCIÓN: ESTA LÓGICA ES UNA SIMULACIÓN TEMPORAL ***
            // DEBES REEMPLAZARLA CON UNA LLAMADA HTTP A TU BACKEND:
            // 
            // try {
            //    const response = await fetch('/api/check-admin-exists');
            //    const data = await response.json();
            //    const exists = data.isAdminExists;
            //    setIsAdminRegistered(exists);
            // } catch (error) {
            //    console.error("Error al verificar Admin:", error);
            // } finally {
            //    setIsCheckingAdmin(false);
            // }

            // SIMULACIÓN:
            await new Promise(resolve => setTimeout(resolve, 800)); 
            const exists = false; // <-- Cambiar a TRUE para simular que ya hay Admin

            setIsAdminRegistered(exists);
            setIsCheckingAdmin(false);
            
            // Si el Admin ya existe, forzamos la vista al rol 'Usuario' 
            if (exists) {
                 setSelectedRole('Client');
            }
        };
        
        checkAdminStatus();
    }, []);

    // ... (validateField, handleChange, y handleBlur se mantienen iguales)
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
            else if (!identificationRegex.test(value) || value.length > MAX_DIGITS) {
                errorMessage = `La cédula solo debe contener números maximo ${MAX_DIGITS} Digitos`;
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
        }
        return errorMessage; 
    }
    
    const handleChange = (e, setter) => {
        const { name: fieldName, value } = e.target;
        setter(value); 

        let currentErrors = { ...errors }; 
        
        if (fieldName === 'name' && value.trim() && !nameRegex.test(value)) {
            currentErrors.name = 'Solo se permiten letras, espacios, guiones y acentos.';
        } else if (fieldName === 'identification' && value.trim() && !identificationRegex.test(value)) {
            currentErrors.identification = 'Caracter Invalido solo Numeros';
        } else if (fieldName === 'email' && forbiddenEmailCharsRegex.test(value)) {
            currentErrors.email = 'El correo contiene caracteres especiales inválidos.';
        } else if (fieldName === 'password' && value.trim() && value.length > 0 && value.length < 6) {
            currentErrors.password = 'La contraseña debe tener al menos 6 caracteres.';
        } else {
            delete currentErrors[fieldName];
        }

        setErrors(currentErrors); 
    };

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
            return newErrors;
        });
    };

    // ==========================================================
    // FUNCIÓN SUBMIT (onSubmit)
    // ==========================================================
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Bloqueo de lógica: El registro solo debe proceder si es Admin y no hay otro Admin registrado.
        if (selectedRole === 'Client' || isAdminRegistered) {
            console.log('Intento de registro bloqueado por lógica de negocio o rol.');
            return;
        }

        if (setStatusMessage) setStatusMessage(''); 
        
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
            return; 
        }

        // Si la validación es exitosa, procede al registro
        // ✅ Pasamos el rol seleccionado al manejador de registro
        const userData = { name, identification, email, password, role: selectedRole }; 
        await handleRegister(userData);
    };

    // ==========================================================
    // VARIABLES DE CONTROL DE RENDERIZADO
    // ==========================================================
    
    // El formulario solo se muestra si el rol es Admin y no hay Admin registrado
    const showFormInputsAndButton = 
        !isCheckingAdmin && 
        selectedRole === 'Admin' && 
        !isAdminRegistered;
        
    // Mensaje alternativo si el formulario está oculto
    let controlMessage = '';
    if (isCheckingAdmin) {
        controlMessage = "Verificando el estado del sistema...";
    } else if (selectedRole === 'Client') {
        controlMessage = "El registro de usuarios está actualmente deshabilitado en esta vista. Por favor, inicia sesión.";
    } else if (isAdminRegistered) { 
        controlMessage = "El administrador principal ya ha sido registrado. Por favor, inicia sesión.";
    }
    
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
                
                {/* ✅ NUEVO: Selector de Roles */}
                <div className="role-selector-container">
                    <p className="role-selector-title">Registrar como:</p>
                    {isCheckingAdmin ? (
                        <p className="help">Cargando roles...</p>
                    ) : (
                        <div className="role-options">
                            <button 
                                type="button" 
                                className={`role-option ${selectedRole === 'Admin' ? 'selected' : ''}`}
                                onClick={() => setSelectedRole('Admin')}
                                // Deshabilita la opción de Admin si ya hay uno
                                disabled={isAdminRegistered} 
                            >
                                Administrador
                            </button>
                            <button 
                                type="button" 
                                className={`role-option ${selectedRole === 'Client' ? 'selected' : ''}`}
                                onClick={() => setSelectedRole('Client')}
                                // Opción de Cliente siempre disponible (aunque el botón de registro se oculte)
                            >
                                Usuario
                            </button>
                        </div>
                    )}
                </div>

                {/* ✅ Renderizado Condicional del Formulario */}
                <form onSubmit={handleSubmit}>
                    
                    {/* Campos del formulario: Se muestran solo para el registro de Admin permitido */}
                    {showFormInputsAndButton && (
                        <>
                            {/* 2. Campo de Identificación */}
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
                                    onBlur={handleBlur} 
                                    className={errors.name ? 'input-error' : ''}
                                />
                                {errors.name && <p className="help error">{errors.name}</p>}
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
                                    onBlur={handleBlur} 
                                    className={errors.email ? 'input-error' : ''}
                                />
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
                                    onBlur={handleBlur} 
                                    className={errors.password ? 'input-error' : ''}
                                />
                                {errors.password && <p className="help error">{errors.password}</p>}
                            </div>
                        </>
                    )}


                    {/* 5. Acciones del Formulario (Botón o Mensaje de Control) */}
                    <div className="form-actions">
                        {showFormInputsAndButton ? (
                            // El botón SÓLO se muestra si el registro de Admin es permitido
                            <button 
                                type="submit" 
                                className="btn primary" 
                                disabled={isLoading || Object.keys(errors).length > 0} 
                            >
                                {isLoading || Object.keys(errors).length > 0 ? (
                                    <>
                                        <i className="fa-solid fa-lock icon-locked"></i> 
                                        {buttonText}
                                    </>
                                ) : (
                                    buttonText
                                )}
                            </button>
                        ) : (
                            // ✅ Mensaje de control si el botón NO está visible
                            <p className="status warning-message" role="alert">{controlMessage}</p>
                        )}
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