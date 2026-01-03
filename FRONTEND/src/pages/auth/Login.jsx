// src/pages/auth/Login.jsx

<<<<<<< HEAD
import { useState } from 'react';
import { Link } from 'react-router-dom'; 
import { useAuth } from '../../context/AuthContext'; 
=======
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
>>>>>>> login
import logo from '../../assets/logo.png';
import './styles1.css';

function Login() {
<<<<<<< HEAD
    // Obtenemos las funciones y estados del Vigilante (AuthContext)
    // Desestructuramos statusMessage que ahora es { type, message }
    const { handleLogin, isLoading, statusMessage, setStatusMessage } = useAuth();

    // Estados locales del formulario
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    
    // ==========================================================
    // ¡DEFINICIÓN DEL ESTADO 'role'
    // ==========================================================
    const [role, setRole] = useState('usuario'); // Valores posibles: 'usuario' o 'administrador'
    const titleText = 'Accede a tu cuenta';
    const buttonText = isLoading ? 'Iniciando...' : 'Iniciar sesión';
    
    // Función para generar la clase CSS condicional
    const statusClassName = `status ${statusMessage.type || ''}`;


<<<<<<< HEAD
    const handleSubmit = async (e) => {
        e.preventDefault();
=======
    // Patrones de expresiones regulares (Regex) para validación
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s\.-]+$/; 
    const identificationRegex = /^[0-9]+$/; 
    const forbiddenEmailCharsRegex = /[<>"'();:\\,]/; 
    const MAX_DIGITS = 10; 

    // ==========================================================
    // ✅ NUEVO: EFECTO PARA VERIFICAR SI YA EXISTE UN ADMINISTRADOR
    // ==========================================================
=======
    // ========================================================
    // 1. HOOKS Y ESTADOS
    // ========================================================
    const navigate = useNavigate();
    const { login, isLoading, statusMessage, setStatusMessage, isAuthenticated } = useAuth();

    // Estados para los campos del formulario y UI
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [selectedRole, setSelectedRole] = useState('Usuario'); // Rol por defecto

    // ========================================================
    // 2. EFECTOS SECUNDARIOS
    // ========================================================

    // Efecto para redirigir si el usuario ya está autenticado
>>>>>>> login
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/welcome', { replace: true }); // O a la ruta principal de la app
        }
    }, [isAuthenticated, navigate]);

    // Efecto para limpiar el mensaje de estado al cargar o desmontar el componente
    useEffect(() => {
        return () => {
            if (setStatusMessage) setStatusMessage('');
        };
<<<<<<< HEAD
>>>>>>> 683d8e2857ad81384ac7131f38c8a0e366b9e2c7
        
        // 💡 AJUSTE 1: Limpiamos el mensaje estableciendo el objeto a vacío
        setStatusMessage({ type: null, message: '' }); 

        if (!email || !password) {
            // 💡 AJUSTE 2: Los mensajes de validación ahora son objetos de tipo 'error'
            setStatusMessage({ type: 'error', message: 'Ingresa correo y contraseña.' });
            return;
        }

        // Llamamos a la función handleLogin del contexto, que maneja el fetch al backend
        await handleLogin(email, password);
    };

    return (
        <main className="auth">
            <section className="auth-card" aria-labelledby="auth-title">
                <header className="auth-header">
                    {/* INSERCIÓN DEL LOGO */}
                    <img src={logo} alt="PFEPS Logo" className="brand-logo" /> 
                    <h1 id="auth-title">PFEPS</h1>
                    <p className="subtitle">{titleText}</p>
                    <p className="tagline">Software de Facturación Electrónica</p>
                </header>

                {/* 3. NUEVO BLOQUE JSX: Selector de Rol */}
                {/* ... (Cuerpo del Login sin cambios) ... */}

                {/* FIN DEL NUEVO BLOQUE */}
                

                <form onSubmit={handleSubmit}>
                    
                    {/* ... (Campos de formulario sin cambios) ... */}
                    
                    {/* Botón de Submit */}
                    <div className="form-actions">
                        <button type="submit" className="btn primary" disabled={isLoading}>
                            {buttonText}
                        </button>
                    </div>
                    
                    {/* Enlace de Navegación a Registro */}
                    <div className="register-wrapper">
                    </div>
                    
                    {/* 💡 AJUSTE 3: Mensaje de estado (éxito/error) con clase condicional */}
                    {statusMessage.message && (
                        <p className={statusClassName} role="status" aria-live="polite">
                            {statusMessage.message}
                        </p>
                    )}
                </form>

            </section>
        </main>
    );
=======
    }, [setStatusMessage]);

    // ========================================================
    // 3. MANEJADORES Y LÓGICA DE VALIDACIÓN
    // ========================================================

    // Función para validar los campos antes del envío
    const validateForm = () => {
        const newErrors = {};
        if (!email.trim()) {
            newErrors.email = 'El correo electrónico es obligatorio.';
        }
        if (!password) {
            newErrors.password = 'La contraseña es obligatoria.';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Manejador del envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (setStatusMessage) setStatusMessage('');

        if (!validateForm()) {
            setStatusMessage('Por favor, completa todos los campos.');
            return;
        }

        try {
            // Se pasa el rol seleccionado a la función de login
            const success = await login({ email, password, role: selectedRole });
            if (success) {
                navigate('/welcome', { replace: true });
            }
            // El AuthContext se encarga de gestionar el mensaje de error si 'success' es false
        } catch (error) {
            console.error("Fallo inesperado durante el login:", error);
            if (setStatusMessage) {
                setStatusMessage('Ocurrió un error inesperado al iniciar sesión.');
            }
        }
    };

    // ==========================================================
    // 4. ESTRUCTURA DEL COMPONENTE (RENDERIZADO)
    // ==========================================================
    return (
        <main className="auth-login">
            <section className="auth-card" aria-labelledby="auth-title">
                {/* Encabezado */}
                <header className="auth-header">
                    <img src={logo} alt="PFEPS Logo" className="brand-logo" />
                    <h1 id="auth-title">PFEPS</h1>
                    <p className="tagline">Software de Facturación Electrónica</p>
                </header>

                {/* Mensajes de estado (errores/éxito) */}
                {statusMessage && (
                    <p className="status error-message" role="status" aria-live="polite">
                        {statusMessage}
                    </p>
                )}

                {/* Selector de Roles */}
                <div className="role-selector-container">
                    <p className="role-selector-title">Iniciar sesión como:</p>
                    <div className="role-options">
                        <button
                            type="button"
                            className={`role-option ${selectedRole === 'Administrador' ? 'selected' : ''}`}
                            onClick={() => setSelectedRole('Administrador')}
                        >
                            Administrador
                        </button>
                        <button
                            type="button"
                            className={`role-option ${selectedRole === 'Usuario' ? 'selected' : ''}`}
                            onClick={() => setSelectedRole('Usuario')}
                        >
                            Usuario
                        </button>
                    </div>
                </div>

                {/* Formulario de Login */}

                <form onSubmit={handleSubmit}>
                    {/* Campo de Email */}

                    <div className="field">

                    

                         <label htmlFor="email">Correo electrónico</label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="tu.correo@ejemplo.com"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                if (errors.email) setErrors(p => ({...p, email: null}));
                            }}
                            className={errors.email ? 'input-error' : ''}
                          />
                          {errors.email && <p className="help error">{errors.email}</p>}
            </div>
                 


                    {/* Campo de Contraseña */}
                    <div className="field">
                        
                        <div className="label-mostrar">
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
                            onChange={(e) => {
                                setPassword(e.target.value);
                                if (errors.password) setErrors(p => ({...p, password: null}));
                            }}
                            className={errors.password ? 'input-error' : ''}
                        />
                        {errors.password && <p className="help error">{errors.password}</p>}
                    </div>


                    {/* Opciones Recordarme-Recuperar Contraseña */}
                    <div className="Options-row">

                        <div className="remember-me">
                        
                        <input
                                type="checkbox"
                                id="rememberMe"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                            />
                            <label htmlFor="rememberMe">Recordarme</label>
                        </div>
                        <Link to="/forgot-password" tabIndex="0" className="link-button">Recuperar contraseña</Link>
                    </div>



                    {/* Botón de Envío */}
                    <div className="form-actions">
                        <button
                            type="submit"
                            className="btn primary"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Ingresando...' : 'Iniciar Sesión'}
                        </button>
                    </div>
                </form>
            </section>
        </main>
    );
>>>>>>> login
}

export default Login;