// src/App.jsx

import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ThemeSwitch from './components/ThemeSwitch'; 

function App() {
    const { user } = useAuth(); // Obtenemos el estado de la sesión

    return (
        // Usamos un fragmento (<>) para poder incluir elementos hermanos a <Routes>
        <>
            {/* 2. COMPONENTE GLOBAL: Se renderiza en todas las rutas (Login, Register, Home) 
               * y se mantiene fijo gracias a los estilos 'position: fixed' definidos en global.css. */}
            <ThemeSwitch /> 

            <Routes>
                
                {/* RUTA RAÍZ ( / ): Redirige al Login si no hay usuario, o a Home si lo hay */}
                <Route 
                    path="/" 
                    element={
                        user ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />
                    } 
                />

                {/* RUTAS DE AUTENTICACIÓN (Públicas) */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* RUTA TEMPORAL HOME: Solo para verificar que el login funciona */}
                <Route path="/home" element={
                    <div style={{ padding: '50px', color: 'var(--color-text-light)' }}>
                        <h2>🎉 ÉXITO: REDIRECCIÓN A HOME (Temporal)</h2>
                        <p>El switch de tema debe estar visible en la esquina superior derecha.</p>
                    </div>
                } />

                {/* RUTA 404 */}
                <Route path="*" element={<h1>404 | Página no encontrada</h1>} />

            </Routes>
        </>
    );
}

export default App;