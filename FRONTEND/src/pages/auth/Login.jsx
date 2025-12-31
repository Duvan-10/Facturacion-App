// src/pages/auth/Login.jsx

import { useState } from 'react';
import { Link } from 'react-router-dom'; 
import { useAuth } from '../../context/AuthContext'; 
import logo from '../../assets/logo.png';
import './styles1.css';

function Login() {
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
}

export default Login;