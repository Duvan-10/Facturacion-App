/**
 * ============================================================
 * COMPONENTE PRINCIPAL DEL DASHBOARD (HOME)
 * Archivo: home.jsx
 * RESPONSABILIDAD:
 *  - Mostrar la vista principal del sistema una vez autenticado.
 *  - Renderizar el menú lateral (Sidebar) y los widgets principales.
 *  - Utilizar iconos optimizados (react-icons) en lugar de fuentes externas.
 * ============================================================
 */
import React from 'react';
import '../styles/home.css';
import { 
  FaUserCog, 
  FaHome, 
  FaFileInvoiceDollar, 
  FaUsers, 
  FaBox, 
  FaChartLine, 
  FaCog 
} from 'react-icons/fa';

const Home = () => {
  return (
    <>
      {/* --- SIDEBAR / MENÚ LATERAL --- */}
      {/* Contiene la información del usuario y la navegación principal */}
      <div className="sidebar">
        <h2>Usuario</h2>
        <div className="user-icon">
          <img src="https://via.placeholder.com/80" alt="Foto del usuario" />
        </div>
        <ul>
          {/* Lista de navegación con iconos importados */}
          <li><FaUserCog /> Gestión de Usuarios</li>
          <li><FaHome /> Dashboard</li>
          <li><FaFileInvoiceDollar /> Facturas</li>
          <li><FaUsers /> Clientes</li>
          <li><FaBox /> Productos</li>
          <li><FaChartLine /> Reportes</li>
          <li><FaCog /> Configuración</li>
        </ul>
      </div>

      {/* --- CONTENIDO PRINCIPAL (MAIN) --- */}
      {/* Área derecha donde se muestran los datos y tarjetas */}
      <div className="main-content">
        <div className="header">
          <h1>Bienvenido al sistema de Facturación Electrónica</h1>
        </div>

        {/* Sección de Tarjetas / Widgets informativos */}
        <div className="cards">
          <div className="card">
            <h3>Facturas recientes</h3>
            <p>Consulta las últimas facturas emitidas.</p>
          </div>
          <div className="card">
            <h3>Clientes</h3>
            <p>Administra tu base de clientes fácilmente.</p>
          </div>
          <div className="card">
            <h3>Reportes</h3>
            <p>Genera reportes detallados de tus ventas.</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
