// src/pages/auth/Register.jsx

import { useState } from 'react';
import { Link } from 'react-router-dom'; 
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo.png'; 
import './styles1.css';

function Register() {
    // Obtenemos las funciones y estados del Vigilante (AuthContext)
    const { handleRegister, isLoading, statusMessage, setStatusMessage } = useAuth();

    // Estados locales del formulario de Registro
    const [name, setName] = useState('');
    const [identification, setIdentification] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    
    const titleText = 'Crear una nueva cuenta';
    const buttonText = isLoading ? 'Guardando...' : 'Completar Registro';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatusMessage('');

        if (!name || !identification || !email || !password) {
            setStatusMessage('Todos los campos son obligatorios.');
            return;
        }

        const userData = { name, identification, email, password };
        // Llamamos a la función handleRegister del contexto, que maneja el fetch al backend
        await handleRegister(userData);
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

                <form onSubmit={handleSubmit}>
                    
                    {/* Campo de Nombre */}
                    <div className="field">
                        <label htmlFor="name">Nombre Completo</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            placeholder="Ej. Juan Pérez"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    {/* Campo de Identificación */}
                    <div className="field">
                        <label htmlFor="identification">Identificación (Cédula)</label>
                        <input
                            type="text"
                            id="identification"
                            name="identification"
                            placeholder="Tu número de cédula"
                            value={identification}
                            onChange={(e) => setIdentification(e.target.value)}
                            required
                        />
                        <small className="help">Este campo es obligatorio y único.</small>
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

                    {/* Acciones del Formulario */}
                    <div className="form-actions">
                        <button type="submit" className="btn primary" disabled={isLoading}>
                            {buttonText}
                        </button>
                    </div>
                    
                    {/* Enlace de Navegación a Login */}
                    <div className="register-wrapper">
                        <p className="subtitle">
                            ¿Ya tienes una cuenta? <Link to="/login" className="link">Iniciar sesión</Link>
                        </p>
                    </div>

                    {/* Mensaje de estado (éxito/error) */}
                    {statusMessage && <p className="status" role="status" aria-live="polite">{statusMessage}</p>}
                </form>

            </section>
        </main>
    );
}

export default Register;