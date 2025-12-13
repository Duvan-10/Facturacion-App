// src/components/ProtectedRoute.jsx

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
    const { user } = useAuth(); // Consulta al Vigilante (AuthContext)

    // Si hay un usuario (está logueado), permite el paso (Outlet).
    // Si NO hay usuario, lo saca y lo envía a /login.
    return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;