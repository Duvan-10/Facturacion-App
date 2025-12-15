// src/App.jsx

import { Routes, Route, Navigate } from 'react-router-dom';
import WelcomePage from './pages/auth/WelcomePage';
import { useAuth } from './context/AuthContext';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ThemeSwitch from './components/ThemeSwitch'; 

function App() {
    const { user } = useAuth(); // Obtenemos el estado de la sesión

    return (
        <>
            <ThemeSwitch /> 

            <Routes>
                
     
                <Route 
                    path="/" 
                    element={<WelcomePage />} />
                

                {/* RUTAS DE AUTENTICACIÓN (Públicas) */}
                <Route path="/login" element={<Login />} />
                
                {/* RUTA DE REGISTRO: Aquí cargamos el componente Register, el cual debe 
                    tener la lógica de Bienvenida que preparamos para la prueba. */}
                <Route path="/register" element={<Register />} />
                
                {/* RUTA TEMPORAL HOME: (Se mantiene igual) */}
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