// src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// 1. Componente que maneja la navegación del navegador (el sistema de rutas).
import { BrowserRouter } from 'react-router-dom';
// 2. Proveedor de autenticación para toda la App.
import { AuthProvider } from './context/AuthContext.jsx'; 
// 3. Proveedor de tema (claro/oscuro) global.
import { ThemeProvider } from './context/ThemeContext.jsx';

import './global.css'; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider> 
          <App />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
);