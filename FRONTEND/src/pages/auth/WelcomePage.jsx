import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logoOnboarding from '../../assets/logo-welcome.png'; 
import './WelcomePage.css'; 



function WelcomePage() { // ✅ Renombrado el componente a WelcomePage (nombre del archivo)

    // 1. HOOK DE NAVEGACIÓN: Necesario para cambiar de ruta
    const navigate = useNavigate(); 
    
    // 2. LÓGICA DE REDIRECCIÓN: Función que se ejecuta al hacer clic en el botón
    const handleStartRegistration = () => {
        // Redirige al usuario a la ruta del formulario de registro del administrador
        navigate('/register'); 
    };



    return (
        <div className="onboarding-container"> 
            
            {/* ✅ Usamos el logo exclusivo para esta fase */}
            <img 
                src={logoOnboarding} 
                alt="Logo de Bienvenida" 
                className="onboarding-logo" 
            />
            
            {/* ... (resto del contenido, título, texto, botón) ... */}
            
            <h2 className="onboarding-title">
                Bienvenido al Sistema de Facturación Electrónica.
            </h2>
            
            <p className="onboarding-text">
                Para Empezar, por favor, haz clic en registrarse.
                <br></br>
             El usuario que registrarás tendrá la Administración para crear futuros usuarios.
            </p>

{/* BOTÓN DE REGISTRO: Usa la clase .onboarding-button-register */}
                    <div className="form-actions">
                        <button 
                            type="button" 
                            className="onboarding-button-register" 
                            // ✅ Al hacer clic, ejecuta la redirección a /register
                            onClick={handleStartRegistration}
                        >
                            Registrarse
                        </button>
                    </div>

               {/* ENLACE A LOGIN: Usa la clase .onboarding-link-wrapper */}
                    <div className="onboarding-link-wrapper">
                    </div>
                </div>

       
    );
};

export default WelcomePage;