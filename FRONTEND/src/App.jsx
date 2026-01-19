/**
 * ============================================================
 * ENRUTADOR PRINCIPAL DE LA APLICACIÓN
 * Archivo: App.jsx
 * RESPONSABILIDAD:
 *  - Definir las rutas públicas principales (Welcome, Login, Register).
 *  - Consultar al backend si el sistema ya tiene usuarios creados.
 *  - Proteger rutas privadas (Home) verificando el token.
 *  - Gestionar la navegación global.
 * ============================================================
 */

import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import WelcomePage from './auth/WelcomePage';
import Login from './auth/Login';
import Register from './auth/Register';
import ThemeSwitch from './components/ThemeSwitch'; 
import Home from './home/home';
import { API_URL } from './api'; // Importamos la configuración local del Frontend

// --- COMPONENTE DE SEGURIDAD ---
// Verifica si existe el token en sessionStorage.
// Si no hay token, expulsa al usuario al Login.
const ProtectedRoute = ({ children }) => {
    const token = sessionStorage.getItem('token');
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

// --- COMPONENTE GUARD (ROOT) ---
// Se monta cada vez que se visita la ruta "/"
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

                 {/* RUTA DE REGISTRO */}
                <Route path="/register" element={<Register />} />

                {/* RUTAS DE AUTENTICACIÓN (Públicas) */}
                <Route path="/login" element={<Login />} />

                {/* --- RUTA PROTEGIDA: HOME / DASHBOARD --- */}
                {/* Solo accesible si hay token en sessionStorage */}
                <Route path="/home" element={
                    <ProtectedRoute>
                        <Home />
                    </ProtectedRoute>
                } />

            </Routes>
        </>
    );
}

export default App;