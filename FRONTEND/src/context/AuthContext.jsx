/**
 * ============================================================
 * CONTEXTO DE AUTENTICACIÓN
 * Archivo: AuthContext.jsx
 * RESPONSABILIDAD:
 *  - Centralizar el estado de sesión (usuario, token).
 *  - Exponer funciones de login, registro y logout al resto de la app.
 *  - Gestionar mensajes de estado para pantallas de Login y Registro.
 * ============================================================
 */

import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// 1. Definición del Contexto
const AuthContext = createContext(null);

// URL base de tu backend
const API_URL = 'http://localhost:4000/api';

// 2. Componente Proveedor (Provider)
export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();

    // Estado global de autenticación
    const [user, setUser] = useState(null); 
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [isLoading, setIsLoading] = useState(false);

    // Mensaje de estado global (error / éxito / info)
    // Siempre se maneja como objeto: { type: 'error' | 'success' | null, message: string }
    const [statusMessage, setStatusMessage] = useState({ type: null, message: '' }); 


    // --- Lógica de recuperación de sesión (Se mantiene por si hay token guardado) ---
    useEffect(() => {
        if (token) {
            try {
                const storedUser = JSON.parse(localStorage.getItem('user'));
                setUser(storedUser);
                // Podrías redirigir automáticamente a /home si existe sesión válida
                // navigate('/home', { replace: true });
            } catch (e) {
                handleLogout();
            }
        } else {
            setUser(null);
        }
    }, [token, navigate]);

    // --- FUNCIÓN DE LOGOUT ---
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
        setStatusMessage({ type: 'success', message: 'Sesión cerrada correctamente.' });
        navigate('/login', { replace: true });
    };

    // --- FUNCIÓN DE REGISTRO ---
    const handleRegister = async (userData) => {
        setIsLoading(true);
        setStatusMessage({ type: null, message: '' });

        try {
            const response = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            const data = await response.json();

            if (!response.ok) {
                setStatusMessage({ type: 'error', message: data.message || 'Error en el registro.' });
                return false;
            }

            setStatusMessage({ type: 'success', message: data.message || 'Usuario registrado exitosamente.' });
            return true;

        } catch (error) {
            console.error('Error en el registro:', error);
            setStatusMessage({ type: 'error', message: 'Error de conexión con el servidor.' });
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    // --- FUNCIÓN DE LOGIN ---
    const handleLogin = async ({ email, password }) => {
        setIsLoading(true);
        setStatusMessage({ type: null, message: '' });

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                setStatusMessage({ type: 'error', message: data.message || 'Error en el inicio de sesión.' });
                return false;
            }

            const { token, user } = data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            setToken(token);
            setUser(user);
            setStatusMessage({ type: 'success', message: 'Inicio de sesión exitoso.' });

            return true;
            
        } catch (error) {
            console.error('Error en el inicio de sesión:', error);
            setStatusMessage({ type: 'error', message: 'Error de conexión con el servidor.' });
            return false;
        } finally {
            setIsLoading(false);
        }
    };


    const isAuthenticated = !!user;

    // 3. Objeto que se pasa a los componentes que usan el contexto
    const contextValue = {
        user,
        token,
        isAuthenticated,
        isLoading,
        statusMessage,
        setStatusMessage,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

// 4. Hook para facilitar el uso del contexto
export const useAuth = () => {
    return useContext(AuthContext);
};