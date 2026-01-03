// src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// 1. Componente que maneja la navegación del navegador (el sistema de rutas).
import { BrowserRouter } from 'react-router-dom';
// 2. Componente que provee la información de usuario y funciones de Auth a toda la App.
import { AuthProvider } from './context/AuthContext.jsx'; 

import './global.css'; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Habilita React Router en toda la aplicación */}
    <BrowserRouter>
      {/* Hace que 'useAuth()' esté disponible para todos los componentes internos */}
      <AuthProvider> 
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);