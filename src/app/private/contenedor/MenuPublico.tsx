import React from 'react';
import { Menu } from 'react-feather';
import logo from '../../../assets/img/LogoMenu/logoPrincipal.svg';
import '../../../assets/css/estilosGenerales.css';

const MenuPublico = () => {
  return (
    <nav className="navbar navbar-expand-lg rounded bg-dark-subtle">
      <div className="container-fluid">
        {/* Botón para abrir el menú en móviles */}
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarsExample11" 
          aria-controls="navbarsExample11" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menú desplegable */}
        <div className="collapse navbar-collapse d-lg-flex justify-content-between w-100" id="navbarsExample11">
          {/* Botón de cerrar menú en móviles */}
          <button 
            className="btn-close d-lg-none position-absolute top-0 end-0 m-3" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarsExample11"
            aria-label="Cerrar menú"
          ></button>

          {/* Logo */}
          <a className="navbar-brand me-0" href="#">
            <img src={logo} alt="Logo" className="jump" style={{ height: '80px' }} />
          </a>

          {/* Links de navegación */}
          <ul className="navbar-nav justify-content-center flex-grow-1 gap-lg-4 mt-3 mt-lg-0">
            <li className="nav-item">
              <a className="nav-link active px-3 py-2 text-center" href="#" data-bs-toggle="collapse" data-bs-target="#navbarsExample11">
                Inicio
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link px-3 py-2 text-center" href="#" data-bs-toggle="collapse" data-bs-target="#navbarsExample11">
                Hospedaje
              </a>
            </li>
          </ul>

          {/* Botón de Iniciar Sesión */}
          <div className="d-flex justify-content-end mt-3 mt-lg-0">
            <button className="btn btn-outline-dark d-flex align-items-center gap-2 px-4 py-2">
              <i className="bi bi-person-circle"></i>
              Iniciar sesión
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default MenuPublico;
