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


    const handleSubmit = async (e) => {
        e.preventDefault();
        
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