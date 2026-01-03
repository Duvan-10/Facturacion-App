// src/context/AuthContext.jsx

import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// 1. Definición del Contexto
const AuthContext = createContext(null);

// URL base de tu backend (La dejamos por referencia, pero NO se usará en este modo de prueba)
const API_URL = 'http://localhost:3000/api/auth';

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

    // --- FUNCIÓN DE REGISTRO (MODO SIMULACIÓN) ---
    const handleRegister = async (userData) => {
        setIsLoading(true);
        setStatusMessage('');

        // 1. Limpiamos cualquier sesión previa para evitar que el Login nos redirija a Home
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);

        try {
            // SIMULACIÓN DE RETARDO (2 segundos) para probar el estado 'isLoading'
            await new Promise(resolve => setTimeout(resolve, 2000)); 

            // Puedes inspeccionar en consola lo que se intentaría registrar
            console.log('Simulación registro usuario:', userData);
            
            // SIMULACIÓN: Asumimos que el registro es exitoso en el front-end
            setStatusMessage('🎉 SIMULACIÓN EXITOSA. Usuario creado, redirigiendo a Login.');
            
            // Eliminamos navigate() aquí para que Register.jsx maneje la redirección tras mostrar el mensaje
            return true;

        } catch (error) {
            // Esto solo se ejecutaría por errores internos de JS, no por errores de red en este modo.
            console.error('Error interno durante la simulación de registro:', error);
            setStatusMessage('⚠️ Error interno durante la simulación.');
            return false;
        } finally {
            // Importante: deshabilita el estado de carga
            setIsLoading(false);
        }
    };

    // --- FUNCIÓN DE LOGIN (MODO SIMULACIÓN) ---
    const handleLogin = async ({ email, password }) => {
        setIsLoading(true);
        setStatusMessage('');

        try {
            // SIMULACIÓN DE RETARDO (2 segundos) para probar el estado 'isLoading'
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Ejemplo de credenciales simuladas
            if (email === 'test@pfeps.com' && password === '123456') {
                
                // SIMULACIÓN DE LOGIN EXITOSO: 
                const mockUser = { id: 1, name: 'Usuario Prueba', email };
                const mockToken = 'mock-jwt-token-12345';

                localStorage.setItem('token', mockToken);
                localStorage.setItem('user', JSON.stringify(mockUser));
                setToken(mockToken);
                setUser(mockUser);
                setStatusMessage('🎉 SIMULACIÓN EXITOSA. Redirigiendo a Home...');

                return true;

            } else {
                // SIMULACIÓN DE LOGIN FALLIDO:
                setStatusMessage('❌ SIMULACIÓN FALLIDA: Credenciales incorrectas.');
                return false;
            }
            
        } catch (error) {
            console.error('Error interno durante la simulación de login:', error);
            setStatusMessage('⚠️ Error interno durante la simulación.');
            return false;
        } finally {
            // Importante: deshabilita el estado de carga
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