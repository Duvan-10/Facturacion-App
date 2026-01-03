// src/context/ThemeContext.jsx

/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';

// 1. Crear el Contexto del Tema
const ThemeContext = createContext(null);

// 2. Crear el Componente Proveedor (Provider)
export const ThemeProvider = ({ children }) => {
    // Estado para saber si el modo claro está activo.
    // Se inicializa leyendo la preferencia guardada en el almacenamiento local.
    const [isLightMode, setIsLightMode] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme === 'light'; // Será true si el tema guardado es 'light'
    });

    // Función para alternar entre modo claro y oscuro
    const toggleTheme = () => {
        setIsLightMode(prevMode => !prevMode);
    };

    // Efecto que se ejecuta cada vez que 'isLightMode' cambia.
    // Aplica la clase CSS al HTML y guarda la preferencia.
    useEffect(() => {
        const root = document.documentElement; // La etiqueta <html>

        if (isLightMode) {
            root.classList.add('light-mode');
            localStorage.setItem('theme', 'light');
        } else {
            root.classList.remove('light-mode');
            localStorage.setItem('theme', 'dark');
        }
    }, [isLightMode]);

    // 3. Valor que se compartirá con los componentes hijos
    const value = {
        isLightMode,
        toggleTheme,
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

// 4. Hook personalizado para usar el contexto fácilmente
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme debe ser usado dentro de un ThemeProvider');
    }
    return context;
};
