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
import WelcomePage from './pages/auth/WelcomePage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ThemeSwitch from './components/ThemeSwitch'; 

function App() {
    // Estado que indica si ya existen usuarios en el sistema
    // null => aún verificando en el backend
    const [hasUsers, setHasUsers] = useState(null);

    useEffect(() => {
        // Llama al endpoint del backend que indica si existe al menos un usuario
        const checkSystem = async () => {
            try {
                const res = await fetch('http://localhost:4000/api/system-status');
                const data = await res.json();
                setHasUsers(data.hasUsers);
            } catch (error) {
                console.error("Error verificando sistema:", error);
                // En caso de error de conexión, asumimos false para permitir ver la bienvenida/configuración
                setHasUsers(false);
            }
        };
        checkSystem();
    }, []);

    // Pantalla de carga simple mientras verificamos el estado
    if (hasUsers === null) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'var(--color-background-dark)', color: 'var(--color-text-light)' }}>
                Cargando sistema...
            </div>
        );
    }

    return (
        <>
            <ThemeSwitch /> 

            <Routes>
                {/* PÁGINA DE BIENVENIDA (ruta inicial) */}
                {/* Si hay usuarios, redirige a Login. Si no, muestra WelcomePage */}
                <Route 
                    path="/" 
                    element={hasUsers ? <Navigate to="/login" replace /> : <WelcomePage />} 
                />

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