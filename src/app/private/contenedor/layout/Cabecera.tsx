import { useNavigate } from "react-router-dom"
import fotoAvatar from "../../../../assets/img/fotoSesion.jpg"
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";

export const Cabecera = () => {

    const navegacion = useNavigate();
    const cerrarSesion = () => {
        localStorage.removeItem("TOKEN_AUTORIZACION")
        navegacion("/login");
    }

    const token: any = localStorage.getItem("TOKEN_AUTORIZACION")
    const datosUsuario: any = jwtDecode(token);




    return (
        <nav className="navbar navbar-top navbar-expand navbar-dashboard navbar-dark ps-0 pe-2 pb-0">
            <div className="container-fluid px-0">
                <div className="d-flex justify-content-between w-100" id="navbarSupportedContent">
                    <div className="d-flex align-items-center">
                        <form className="navbar-search form-inline" id="navbar-search-main">
                            <div className="input-group input-group-merge search-bar">
                                <span className="input-group-text" id="topbar-addon">
                                    <i className="fa fa-search"></i>
                                </span>
                                <input type="text" className="form-control" id="topbarInputIconLeft" placeholder="Search" aria-label="Search" aria-describedby="topbar-addon" />
                            </div>
                        </form>
                    </div>

                    <ul className="navbar-nav align-items-center">
                        <li className="nav-item dropdown">
                            <a className="nav-link text-dark notification-bell unread dropdown-toggle" data-unread-notifications="true" role="button" data-bs-toggle="dropdown" data-bs-display="static" aria-expanded="false">
                                <i className="fa fa-bell fs-4"></i>
                            </a>
                            <div className="dropdown-menu dropdown-menu-lg dropdown-menu-center mt-2 py-0">
                                <div className="list-group list-group-flush">
                                    <a className="text-center text-primary fw-bold border-bottom border-light py-3">Notifications</a>
                                    <a className="list-group-item list-group-item-action border-bottom">
                                        <div className="row align-items-center">
                                            <div className="col ps-0 ms-2">
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <div className="text-center">
                                                        <h4 className="h6 mb-0 text-small">No found</h4>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </a>

                                    <a className="dropdown-item text-center fw-bold rounded-bottom py-3">
                                        <i className="fa fa-eye mx-2"></i>
                                        View all
                                    </a>
                                </div>
                            </div>
                        </li>
                        <li className="nav-item dropdown ms-lg-3">
                            <a className="nav-link dropdown-toggle pt-1 px-0" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <div className="media d-flex align-items-center">
                                    <img className="avatar rounded-circle" alt="" src={fotoAvatar} height={"50px"} width={"60px"} />
                                    <div className="media-body ms-2 text-dark align-items-center d-none d-lg-block">
                                        <span className="mb-0 font-small fw-bold text-gray-900">{datosUsuario.nombre}</span>
                                    </div>
                                </div>
                            </a>
                            <div className="dropdown-menu dashboard-dropdown dropdown-menu-end mt-2 py-1">
                                <Link
                                    className="dropdown-item d-flex align-items-center"
                                    to="/dash/listUser"
                                >
                                    <i className="fa fa-user-circle fs-5 mx-2 text-info"></i>
                                    Perfil
                                </Link>
                                <a className="dropdown-item d-flex align-items-center">
                                    <i className="fa fa-gear fs-5 mx-2 text-info"></i>
                                    Configuración
                                </a>
                                <a className="dropdown-item d-flex align-items-center">
                                    <i className="fa fa-message fs-5 mx-2 text-info"></i>
                                    Mensajes
                                </a>
                                <div role="separator" className="dropdown-divider my-1"></div>
                                <a className="dropdown-item d-flex align-items-center" onClick={cerrarSesion}>
                                    <i className="fa-solid fa-right-from-bracket fs-5 mx-2 text-danger"></i>
                                    Cerrar Sesion
                                </a>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>

    )



}