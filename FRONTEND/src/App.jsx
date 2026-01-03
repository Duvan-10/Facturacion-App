// src/App.jsx

import { Routes, Route, Navigate } from 'react-router-dom';
import WelcomePage from './pages/auth/WelcomePage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ThemeSwitch from './components/ThemeSwitch'; 

function App() {
    return (
        <>
            <ThemeSwitch /> 

            <Routes>
                {/* PÁGINA DE BIENVENIDA (ruta inicial) */}
                <Route 
                    path="/" 
                    element={<WelcomePage />} 
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