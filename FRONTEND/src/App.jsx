/**
 * ============================================================
 * ENRUTADOR PRINCIPAL DE LA APLICACIÓN
 * Archivo: App.jsx
 * RESPONSABILIDAD:
 *  - Definir las rutas públicas principales (Welcome, Login, Register).
 *  - Consultar al backend si el sistema ya tiene usuarios creados.
 *  - Redirigir automáticamente según el estado inicial del sistema.
 * ============================================================
 */

import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import WelcomePage from './auth/WelcomePage';
import Login from './auth/Login';
import Register from './auth/Register';
import ThemeSwitch from './components/ThemeSwitch'; 
import { API_URL } from './api'; // Importamos la configuración local del Frontend

// Componente Guard: Se monta cada vez que se visita la ruta "/"
// asegurando que siempre se verifique el estado actual de la BD.
const RootGuard = () => {
    const [hasUsers, setHasUsers] = useState(null);

    useEffect(() => {
        // LOG DE PRUEBA: Muestra en la consola a dónde se está conectando
        console.log("📡 Conectando a la API en:", API_URL);

        const checkSystem = async () => {
            try {
                const res = await fetch(`${API_URL}/system-status`);
                const data = await res.json();
                setHasUsers(data.hasUsers);
            } catch (error) {
                console.error("Error verificando sistema:", error);
                // En caso de error, asumimos false para no bloquear la app
                setHasUsers(false);
            }
        };
        checkSystem();
    }, []);

    if (hasUsers === null) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'var(--color-background-dark)', color: 'var(--color-text-light)' }}>
                Cargando sistema...
            </div>
        );
    }

    return hasUsers ? <Navigate to="/login" replace /> : <WelcomePage />;
};

function App() {
    return (
        <>
            <ThemeSwitch /> 

            <Routes>
                {/* PÁGINA DE BIENVENIDA (ruta inicial) */}
                {/* Usamos RootGuard para que la validación ocurra al entrar a esta ruta */}
                <Route path="/" element={<RootGuard />} />

                {/* RUTAS DE AUTENTICACIÓN (Públicas) */}
                <Route path="/login" element={<Login />} />
                
                {/* RUTA DE REGISTRO */}
                <Route path="/register" element={<Register />} />
                
                {/* RUTA TEMPORAL HOME */}
                <Route 
                    path="/home" 
                    element={
                        <div style={{ padding: '50px', color: 'var(--color-text-light)' }}>
                            <h2>🎉 ÉXITO: REDIRECCIÓN A HOME (Temporal)</h2>
                            <p>El switch de tema debe estar visible en la esquina superior derecha.</p>
                        </div>
                    } 
                />

                {/* CUALQUIER OTRA RUTA → REDIRIGE A BIENVENIDA */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </>
    );
}

export default App;