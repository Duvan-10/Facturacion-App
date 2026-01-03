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
    // ✅ setStatusMessage ES LA FUNCIÓN QUE FALTABA EXPORTAR
    const [statusMessage, setStatusMessage] = useState(''); 

    /* * =======================================================
     * FUNCIÓN NUEVA: GESTIÓN DEL MODO CLARO/OSCURO (THEME)
     * =======================================================
     */
    
    // 3. ESTADO DEL TEMA: true = Light Mode (Claro), false = Dark Mode (Oscuro)
    // Se inicializa leyendo la última preferencia del usuario desde el almacenamiento local.
    const [isLightMode, setIsLightMode] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme === 'light'; // Si guardó 'light', es true
    });

    // 4. FUNCIÓN PARA CAMBIAR EL TEMA
    const toggleTheme = () => {
        setIsLightMode(prev => !prev);
    };

    // 5. EFECTO PARA APLICAR LA CLASE CSS GLOBAL Y GUARDAR PREFERENCIA
    useEffect(() => {
        const root = document.documentElement; // Selecciona la etiqueta <html>

        // Aplicar/Remover la clase 'light-mode' para cambiar las variables CSS
        if (isLightMode) {
            root.classList.add('light-mode');
            localStorage.setItem('theme', 'light');
        } else {
            root.classList.remove('light-mode');
            localStorage.setItem('theme', 'dark');
        }
    }, [isLightMode]); // Se ejecuta cada vez que el modo cambia
    
    /* * =======================================================
     * FIN: GESTIÓN DEL MODO CLARO/OSCURO
     * =======================================================
     */


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

        try {
            // SIMULACIÓN DE RETARDO (2 segundos) para probar el estado 'isLoading'
            await new Promise(resolve => setTimeout(resolve, 2000)); 
            
            // SIMULACIÓN: Asumimos que el registro es exitoso en el front-end
            setStatusMessage(`🎉 SIMULACIÓN EXITOSA. Usuario creado, redirigiendo a Login.`);
            
            // Navegamos al login después de la simulación de éxito
            navigate('/login'); 
            return { success: true };

        } catch (error) {
            // Esto solo se ejecutaría por errores internos de JS, no por errores de red en este modo.
            setStatusMessage('⚠️ Error interno durante la simulación.');
            return { success: false, message: 'Error interno.' };
        } finally {
            // Importante: deshabilita el estado de carga
            setIsLoading(false);
        }
    };

    // --- FUNCIÓN DE LOGIN (MODO SIMULACIÓN) ---
    const handleLogin = async (email, password) => {
        setIsLoading(true);
        setStatusMessage('');

        try {
            // SIMULACIÓN DE RETARDO (2 segundos) para probar el estado 'isLoading'
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // --- LÓGICA DE PRUEBA DE ÉXITO/FALLO EN SIMULACIÓN ---
            
            // Ejemplo de credenciales simuladas
            if (email === 'test@pfeps.com' && password === '123456') {
                
                // SIMULACIÓN DE LOGIN EXITOSO: 
                const mockUser = { id: 1, name: 'Usuario Prueba', email: email };
                const mockToken = 'mock-jwt-token-12345';

                localStorage.setItem('token', mockToken);
                localStorage.setItem('user', JSON.stringify(mockUser));
                setToken(mockToken);
                setUser(mockUser);
                setStatusMessage(`🎉 SIMULACIÓN EXITOSA. Redirigiendo a Home...`);
                // El useEffect de arriba se encargará de la redirección a /home

                return { success: true };

            } else {
                // SIMULACIÓN DE LOGIN FALLIDO:
                setStatusMessage(`❌ SIMULACIÓN FALLIDA: Credenciales incorrectas.`);
                return { success: false, message: 'Credenciales incorrectas.' };
            }
            
        } catch (error) {
            setStatusMessage('⚠️ Error interno durante la simulación.');
            return { success: false, message: 'Error interno.' };
        } finally {
            // Importante: deshabilita el estado de carga
            setIsLoading(false);
        }
    };


    // 3. Objeto que se pasa a los componentes que usan el contexto
    const contextValue = {
        user,
        token,
        isLoading,
        statusMessage,
        setStatusMessage,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
        
        // --- VALORES DEL TEMA A EXPORTAR ---
        isLightMode,
        toggleTheme,
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
