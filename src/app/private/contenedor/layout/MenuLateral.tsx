import { useState } from "react";
import { Nav, Navbar, NavItem } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import logo from "../../../../assets/img/logoApp.png";
import SimpleBar from "simplebar-react";
import fotoAvatar from "../../../../assets/img/fotoSesion.jpg";
import { OPCIONES_MENU } from "../../../../utilities/dominios/opcionesMenu";

export const MenuLateral = () => {
    const [show, setShow] = useState(false);
    const showClass = show ? "show" : "";

    const onCollapse = () => setShow(!show);

    const [arrOpciones] = useState<any[]>(OPCIONES_MENU);
    const ubicacion = useLocation();

    return (
        <div>
            {/* Navbar superior solo visible en móvil */}
            <Navbar expand={false} collapseOnSelect variant="dark" className="navbar-theme-primary px-4 d-md-none">
                <Navbar.Brand className="me-lg-5">
                    <img src={fotoAvatar} className="navbar-brand-light" width={"50px"} height={"50px"} />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="main-navbar" onClick={onCollapse}>
                    <span className="navbar-toggler-icon" />
                </Navbar.Toggle>
            </Navbar>

            {/* Sidebar lateral */}
            <SimpleBar className={`collapse ${showClass} sidebar d-md-block bg-primary text-white`}>
                <div className="sidebar-inner px-4 pt-3">

                    {/* Info usuario en móvil */}
                    <div className="user-card d-flex d-md-none align-items-center justify-content-between justify-content-md-center pb-4">
                        <div className="d-flex align-items-center">
                            <div className="user-avatar lg-avatar me-4">
                                <img src="" className="card-img-top rounded-circle border-white" height={"50px"} width={"50px"} />
                            </div>
                            <div className="d-block">
                                <h6>Hi, Jane</h6>
                                <button className="btn btn-sm btn-danger">
                                    Cerrar Sesion
                                </button>
                            </div>
                        </div>
                        <Nav.Link className="collapse-close d-md-none btn-close" onClick={onCollapse}>
                            <i className="fa fa-x"></i>
                        </Nav.Link>
                    </div>

                    {/* Opciones del menú */}
                    <ul className="nav flex-column pt-3 pt-md-0">
                        {/* Link principal Panel */}
                        <li className="nav-item">
                            <Link to="/dash" className="nav-link d-flex align-items-center" onClick={onCollapse}>
                                <span className="sidebar-icon">
                                    <img src={logo} alt="" height={"50px"} />
                                </span>
                                <span className="fst-italic sidebar-text display-5">Panel</span>
                            </Link>
                        </li>

                        {/* Opciones dinámicas */}
                        {arrOpciones.map((opcion, indice) => (
                            opcion.hijos?.length ? (
                                /** LOGICA PARA LOS HIJOS */
                                <NavItem className="nav-item" key={`opcion-${indice}`}>
                                    <Link 
                                        to={opcion.ruta} 
                                        className="nav-link collapsed py-3"
                                        data-bs-toggle="collapse"
                                        data-bs-target={"#menu_" + indice}
                                        onClick={onCollapse} // 👈 Cierra en responsive
                                    >
                                        <span className="sidebar-icon">
                                            <i className={opcion.icono}></i>
                                        </span>
                                        <span className="sidebar-text">{opcion.titulo}</span>
                                    </Link>
                                    <ul id={"menu_" + indice} className="flex-column collapse" data-bs-parent="#sidebar-nav">
                                        {opcion.hijos.map((opcionHijo: any, subIndice: number) => (
                                            <NavItem className="nav-item" key={`opcion-${indice}-hijo-${subIndice}`}>
                                                <Link 
                                                    to={opcionHijo.ruta} 
                                                    className={ubicacion.pathname === opcionHijo.ruta ?
                                                        "nav-link active bg-secondary-app" :
                                                        "nav-link"
                                                    }
                                                    onClick={onCollapse} // 👈 Cierra en responsive
                                                >
                                                    <span className="sidebar-text">{opcionHijo.titulo}</span>
                                                </Link>
                                            </NavItem>
                                        ))}
                                    </ul>
                                </NavItem>
                            ) : (
                                /** LOGICA PARA OPCIONES BASICAS */
                                <NavItem className="nav-item" key={`opcion-${indice}`}>
                                    <Link 
                                        to={opcion.ruta} 
                                        className={ubicacion.pathname === opcion.ruta ?
                                            "active bg-secondary-app nav-link text-primary" :
                                            "nav-link"
                                        }
                                        onClick={onCollapse} // 👈 Cierra en responsive
                                    >
                                        <span className="sidebar-icon">
                                            <i className={opcion.icono}></i>
                                        </span>
                                        <span className="sidebar-text">{opcion.titulo}</span>
                                    </Link>
                                </NavItem>
                            )
                        ))}
                    </ul>
                </div>
            </SimpleBar>
        </div>
    );
};
