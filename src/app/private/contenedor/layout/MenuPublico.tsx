import React from "react";
import "bootstrap-icons/font/bootstrap-icons.css"; // Asegúrate de importar Bootstrap Icons
import logo from "../../../../assets/img/LogoMenu/logoPrincipal.svg";
import "../../../../assets/css/estilosGenerales.css";

const MenuPublico = () => {
  return (
    <div className="px-3 py-3 text-bg-black border-bottom">
      <div className="container">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
          {/* Logo con mayor tamaño */}
          <a href="/" className="d-flex align-items-center text-white text-decoration-none jump">
            <img src={logo} alt="Logo" width="120" height="80" className="me-3" />
          </a>

          {/* Menú */}
          <ul className="nav col-12 col-lg-auto my-2 justify-content-center my-md-0 text-small">
            <li className="mx-3">
              <a href="#" className="nav-link text-warning d-flex flex-column align-items-center gap-2">
                <i className="bi bi-house-door" style={{ fontSize: 28, color: "#fd7e14" }}></i>
                Inicio
              </a>
            </li>
            <li className="mx-3">
              <a href="#" className="nav-link text-white d-flex flex-column align-items-center gap-2">
                <i className="bi bi-people" style={{ fontSize: 28, color: "#fd7e14" }}></i>
                Iniciar Sesión
              </a>
            </li>
          </ul>

        </div>
      </div>
    </div>
  );
};

export default MenuPublico;
