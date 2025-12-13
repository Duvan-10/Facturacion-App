// src/components/ThemeSwitch.jsx

import React from 'react';
import { useAuth } from '../context/AuthContext'; // Importamos el contexto centralizado
import { Sun, Moon } from 'lucide-react'; // Iconos para representar el modo

/**
 * Componente global que renderiza el botón de cambio de modo (Claro/Oscuro).
 * Está diseñado para ser fijo y visible en todas las páginas de la aplicación.
 */
const ThemeSwitch = () => {
    // Obtenemos el estado actual del tema y la función para cambiarlo desde el AuthContext
    const { isLightMode, toggleTheme } = useAuth(); 

    return (
        <div className="theme-switcher-global">
            <button 
                onClick={toggleTheme} // Función que cambia el estado global del tema
                className="theme-button"
                // Atributos de accesibilidad y ayuda
                aria-label={isLightMode ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}
                title={isLightMode ? 'Click Para Cambiar a Modo Oscuro' : 'Click Para Cambiar a Modo Claro'}
            >
                {/* Funcion Desactivada: (Renderiza el icono de la Luna si está en Modo Claro (para cambiar a Oscuro)
                    y el icono del Sol si está en Modo Oscuro (para cambiar a Claro) 
                {isLightMode ? <Moon size={24} /> : <Sun size={24} />}---------Funcion*/}

                {/* 1. Si está en Modo CLARO (isLightMode es true) -> Muestra el SOL (Sun) 
                    2. Si está en Modo OSCURO (isLightMode es false) -> Muestra la LUNA (Moon) */}
                {isLightMode ? <Sun size={24} /> : <Moon size={24} />} {/*Funcion Activa*/}
            </button>
        </div>
    );
};

export default ThemeSwitch;