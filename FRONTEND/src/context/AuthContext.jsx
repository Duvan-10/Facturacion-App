// src/context/AuthContext.jsx

import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// 1. Definición del Contexto
const AuthContext = createContext(null);

// URL base de tu backend
const API_URL = 'http://localhost:4000/api';

// 2. Componente Proveedor (Provider)
export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    // Los estados user y token estarán en null, simulando que nadie ha iniciado sesión
    const [user, setUser] = useState(null); 
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [isLoading, setIsLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState(''); 


    // --- Lógica de recuperación de sesión (Se mantiene por si hay token guardado) ---
    useEffect(() => {
        if (token) {
            try {
                const storedUser = JSON.parse(localStorage.getItem('user'));
                setUser(storedUser);
                // if (storedUser) {
                //     navigate('/home', { replace: true });
                // }
            } catch (e) {
                handleLogout();
            }
        } else {
            setUser(null);
        }
    }, [token, navigate]);

    // --- FUNCIÓN DE LOGOUT (Se mantiene funcional) ---
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
        setStatusMessage('Sesión cerrada correctamente.');
        navigate('/login', { replace: true });
    };

    // --- FUNCIÓN DE REGISTRO ---
    const handleRegister = async (userData) => {
        setIsLoading(true);
        setStatusMessage('');

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
                setStatusMessage(data.message || 'Error en el registro.');
                return false;
            }

            setStatusMessage(data.message || 'Usuario registrado exitosamente.');
            return true;

        } catch (error) {
            console.error('Error en el registro:', error);
            setStatusMessage('Error de conexión con el servidor.');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    // --- FUNCIÓN DE LOGIN ---
    const handleLogin = async ({ email, password }) => {
        setIsLoading(true);
        setStatusMessage('');

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
                setStatusMessage(data.message || 'Error en el inicio de sesión.');
                return false;
            }
            
            const { token, user } = data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            setToken(token);
            setUser(user);
            setStatusMessage('Inicio de sesión exitoso.');

            return true;
            
        } catch (error) {
            console.error('Error en el inicio de sesión:', error);
            setStatusMessage('Error de conexión con el servidor.');
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