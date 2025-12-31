// src/App.import { Routes, Route, Navigate } from 'react-router-dom';
import { Routes, Route, Navigate } from 'react-router-dom';
import Welcome from './pages/auth/Welcome'; // ✅ COMPONENTE WELCOME YA IMPORTADO
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
                
                {/* 1. RUTA RAÍZ: Redirigimos la raíz a /login o a /welcome.
                   La lógica del useEffect en AuthContext tomará el control.
                   Si AuthContext detecta 0 usuarios, te moverá de aquí a /welcome.
                   Si AuthContext detecta >0 usuarios, te dejará en /login.
                */}
                <Route path="/" element={<Navigate to="/login" replace />} />
                

                {/* 2. RUTAS PÚBLICAS: AUTENTICACIÓN Y ONBOARDING */}
                
                {/* ✅ RUTA DE BIENVENIDA (Soluciona el error 404) */}
                <Route path="/welcome" element={<Welcome />} />
                
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                
                {/* 3. RUTA PROTEGIDA (Ejemplo) */}
                <Route path="/home" element={
                    // Si el usuario existe, muestra Home. Si no, redirige a Login.
                    user ? (
                        <div style={{ padding: '50px', color: 'var(--color-text)' }}>
                            <h2>🎉 ÉXITO: REDIRECCIÓN A HOME (Temporal)</h2>
                            <p>¡Bienvenido! El usuario ha iniciado sesión.</p>
                        </div>
                    ) : (
                        <Navigate to="/login" replace />
                    )
                } />

                {/* RUTA 404 */}
                <Route path="*" element={
                    <div style={{ padding: '50px', textAlign: 'center' }}>
                        <h1>404 | Página no encontrada</h1>
                        <p>La URL que buscaste no existe.</p>
                    </div>
                } />

            </Routes>
        </>
    );
}

export default App;