// src/context/AuthContext.jsx

import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// 1. Definición del Contexto
const AuthContext = createContext(null);

const API_URL = 'http://localhost:3000/api/auth';

// 2. Componente Proveedor (Provider)
export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();

    // ESTADOS SIMULADOS DE AUTH Y UI
    const [user, setUser] = useState(null); 
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [isLoading, setIsLoading] = useState(false);
    
    // 💡 CAMBIO CLAVE 1: statusMessage ahora es un OBJETO {type, message}
    const [statusMessage, setStatusMessage] = useState({ type: null, message: '' }); 
    
    // SIMULACIÓN DE BASE DE DATOS DE USUARIOS (Persistente)
    const [mockUsers, setMockUsers] = useState(() => {
        const storedUsers = localStorage.getItem('mockUsers');
        return storedUsers ? JSON.parse(storedUsers) : [];
    });
    
    // ... (Mantener lógica de Tema) ...
    const [isLightMode, setIsLightMode] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme === 'light';
    });

    const toggleTheme = () => {
        setIsLightMode(prev => !prev);
    };

    // ==========================================================
    // EFECTOS
    // ==========================================================
    
    // ⚙️ EFECTO CLAVE: VERIFICACIÓN INICIAL DE ONBOARDING/SETUP
    useEffect(() => {
        // No ejecutar si hay sesión activa
        if (token || user) return; 

        const hasAdminRegistered = mockUsers.length > 0;
        const currentPath = location.pathname;

        if (hasAdminRegistered) {
            // Caso 1: Ya hay un administrador. Redirige todo a Login.
            if (currentPath !== '/login') {
                navigate('/login', { replace: true });
                // 💡 CAMBIO: Usamos 'info' para mensajes de onboarding/instrucción
                setStatusMessage({ type: 'info', message: 'Usa Administrador Para el Primer Inicio.' });
            }
        } else {
            // Caso 2: Es la primera vez. Redirige a Bienvenida/Registro.
            if (currentPath !== '/welcome' && currentPath !== '/register') {
                navigate('/welcome', { replace: true });
                // 💡 CAMBIO: Usamos 'info'
                setStatusMessage({ type: 'info', message: 'Bienvenido. Crea la cuenta de Administrador para comenzar.' });
            }
        }
        
    }, [mockUsers.length, navigate, location.pathname, token, user]); 

    // Efecto 1: Persistir usuarios simulados
    useEffect(() => {
        localStorage.setItem('mockUsers', JSON.stringify(mockUsers));
    }, [mockUsers]);
    
    // Efecto 2: Aplicar el tema
    useEffect(() => {
        const root = document.documentElement;
        if (isLightMode) {
            root.classList.add('light-mode');
            localStorage.setItem('theme', 'light');
        } else {
            root.classList.remove('light-mode');
            localStorage.setItem('theme', 'dark');
        }
    }, [isLightMode]);

    // Efecto 3: Recuperación de sesión (si hay token)
    useEffect(() => {
        if (token) {
            try {
                const storedUser = JSON.parse(localStorage.getItem('user'));
                setUser(storedUser);
                if (storedUser) {
                    navigate('/home', { replace: true });
                }
            } catch (e) {
                handleLogout();
            }
        } else {
            setUser(null);
        }
    }, [token, navigate]);

    // ==========================================================
    // FUNCIONES DE AUTENTICACIÓN
    // ==========================================================

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
        // 💡 CAMBIO: Usamos 'info'
        setStatusMessage({ type: 'info', message: 'Sesión cerrada correctamente.' });
        navigate('/login', { replace: true });
    };

    const handleRegister = async (userData) => {
        setIsLoading(true);
        // 💡 CAMBIO: Limpiamos el mensaje estableciendo el objeto a vacío
        setStatusMessage({ type: null, message: '' });

        try {
            await new Promise(resolve => setTimeout(resolve, 2000)); 

            const emailExists = mockUsers.some(user => user.email === userData.email);
            const idExists = mockUsers.some(user => user.identification === userData.identification);

            if (emailExists || idExists) {
                // 💡 CAMBIO: Usamos 'error' para fallos de validación
                setStatusMessage({ 
                    type: 'error', 
                    message: emailExists ? '❌ Error: El correo ya está registrado.' : '❌ Error: La identificación ya está registrada.' 
                });
                return false;
            }
            
            const newUser = {
                id: mockUsers.length > 0 ? Math.max(...mockUsers.map(u => u.id)) + 1 : 1,
                ...userData,
            };

            setMockUsers(prevUsers => [...prevUsers, newUser]);
            
            // 💡 CAMBIO: Usamos 'success' para el registro exitoso
            setStatusMessage({ 
                type: 'success', 
                message: `🎉 SIMULACIÓN EXITOSA. Administrador '${newUser.name}' registrado.`
            });
            
            return true; 

        } catch (error) {
            console.error("Error en simulación de registro:", error);
            // 💡 CAMBIO: Usamos 'error' para errores de ejecución
            setStatusMessage({ type: 'error', message: '⚠️ Error interno durante el proceso de registro.' });
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogin = async (email, password) => {
        setIsLoading(true);
        // 💡 CAMBIO: Limpiamos el mensaje
        setStatusMessage({ type: null, message: '' });

        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            const userFound = mockUsers.find(u => u.email === email && u.password === password);
            
            if (userFound) {
                const mockUser = { id: userFound.id, name: userFound.name, email: userFound.email, role: userFound.role };
                const mockToken = 'mock-jwt-token-' + userFound.id;

                localStorage.setItem('token', mockToken);
                localStorage.setItem('user', JSON.stringify(mockUser));
                setToken(mockToken);
                setUser(mockUser);
                // 💡 CAMBIO: Usamos 'success'
                setStatusMessage({ 
                    type: 'success', 
                    message: `🎉 SIMULACIÓN EXITOSA. ¡Bienvenido, ${userFound.name}! Redirigiendo...` 
                });
                return true;

            } else {
                // 💡 CAMBIO: Usamos 'error' para credenciales incorrectas
                setStatusMessage({ type: 'error', message: `❌ Credenciales incorrectas o usuario no encontrado.` });
                return false;
            }
            
        } catch (error) {
            // 💡 CAMBIO: Usamos 'error'
            setStatusMessage({ type: 'error', message: '⚠️ Error interno durante la simulación.' });
            return false;
        } finally {
            setIsLoading(false);
        }
    };


    // 3. Objeto que se pasa a los componentes que usan el contexto
    // 💡 CAMBIO: setStatusMessage ahora necesita ser compatible con el nuevo tipo de estado
    const contextValue = {
        user,
        token,
        isLoading,
        statusMessage, // Es el objeto { type, message }
        setStatusMessage, // Para limpiar o cambiar el mensaje desde los componentes
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
        
        // VALORES DEL TEMA
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
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};