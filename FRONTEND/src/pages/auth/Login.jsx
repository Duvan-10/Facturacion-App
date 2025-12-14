// src/pages/auth/Login.jsx

import { useState } from 'react';
import { Link } from 'react-router-dom'; 
import { useAuth } from '../../context/AuthContext'; 
import { User, Settings } from 'lucide-react';
import logo from '../../assets/logo.png';
import './styles1.css'; {/*Habilitado estilo 1*/}

function Login() {
    // Obtenemos las funciones y estados del Vigilante (AuthContext)
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatusMessage(''); // Limpiar mensajes previos

        if (!email || !password) {
            setStatusMessage('Ingresa correo y contraseña.');
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
                <div className="role-selector-container" role="radiogroup" aria-label="Seleccionar tipo de cuenta">
                    <p className="role-selector-title">Ingresar como:</p>
                    <div className="role-options">
                        
                        {/* Opción 1: Usuario */}
                        <label htmlFor="role-user" className={`role-option ${role === 'usuario' ? 'selected' : ''}`}>
                            <input 
                                type="radio" 
                                id="role-user" 
                                name="role" 
                                value="usuario" 
                                checked={role === 'usuario'}
                                onChange={() => setRole('usuario')}
                            />
                            <User size={20} className="role-icon"/>
                            <span>Usuario</span>
                        </label>
                        
                        {/* Opción 2: Administrador */}
                        <label htmlFor="role-admin" className={`role-option ${role === 'administrador' ? 'selected' : ''}`}>
                            <input 
                                type="radio" 
                                id="role-admin" 
                                name="role" 
                                value="administrador" 
                                checked={role === 'administrador'}
                                onChange={() => setRole('administrador')}
                            />
                            <Settings size={20} className="role-icon"/>
                            <span>Administrador</span>
                        </label>

                    </div>
                </div>
                {/* FIN DEL NUEVO BLOQUE */}
                

                <form onSubmit={handleSubmit}>
                    
                    {/* Campo de Email */}
                    <div className="field">
                        <label htmlFor="email">Correo electrónico</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Usa tu correo registrado"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    {/* Campo de Contraseña */}
                    <div className="field">
                        {/* Lógica de Mostrar/Ocultar Contraseña */}
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
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {/* Fila de Checkbox y Olvidé Contraseña */}
                    <div className="form-row">
                        <label className="checkbox">
                            <input
                                type="checkbox"
                                name="remember"
                                checked={rememberMe}
                                onChange={() => setRememberMe(!rememberMe)}
                            />
                            <span>Recordarme</span>
                        </label>
                        <Link to="/reset-password" className="link">Olvidé mi contraseña</Link>
                    </div>

                    {/* Botón de Submit */}
                    <div className="form-actions">
                        <button type="submit" className="btn primary" disabled={isLoading}>
                            {buttonText}
                        </button>
                    </div>
                    
                    {/* Enlace de Navegación a Registro */}
                    <div className="register-wrapper">
                        <p className="subtitle">
                            ¿No tienes una cuenta? <Link to="/register" className="link register-link">Regístrate</Link>
                        </p>
                    </div>

                    {/* Mensaje de estado (éxito/error) */}
                    {statusMessage && <p className="status" role="status" aria-live="polite">{statusMessage}</p>}
                </form>

            </section>
        </main>
    );
}

export default Login;