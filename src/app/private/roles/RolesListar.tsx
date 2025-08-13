import { useEffect, useState } from "react";
import { URLS } from "../../../utilities/dominios/urls"; 
import { ServicioGet } from "../../../services/ServicioGet";
import { Link } from "react-router-dom";
import { Role, User } from "../../../models/Rol";

export const RolesListar = () => {
    const [arrRoles, setArrRoles] = useState<Role[]>([]);

    const consultar = async () => {
        const urlServicio = URLS.URL_BASE + URLS.LISTAR_ROLES;
        const resultado = await ServicioGet.peticionGet(urlServicio);
        setArrRoles(Array.isArray(resultado) ? resultado : []); // Asegura que sea un arreglo
    };

    useEffect(() => {
        consultar();
    }, []);

    return (
        <div className="m-4">
            <div className="row">
                <div className="col-4">
                    <h4 className="fst-italic fw-bold display-4">TODOS LOS ROLES</h4>
                </div>
                <div className="col-8">
                    <div className="d-flex">
                        <ol className="breadcrumb breadcrumb-dark breadcrumb-transparent">
                            <li className="breadcrumb-item">
                                <Link to="/dash" className="text-warning">
                                    <i className="fa fa-home"></i>
                                </Link>
                            </li>
                            <li className="breadcrumb-item">
                                <a href="#">Role</a>
                            </li>
                            <li className="breadcrumb-item text-warning">Listar</li>
                        </ol>
                    </div>
                </div>
            </div>
            <div className="d-flex justify-content-center">
                <div className="col-md-10">
                    <table className="table table-sm table-striped table-hover">
                        <thead className="table-primary text-white fs-2">
                            <tr>
                                <th style={{ width: "30%" }} className="text-center">Código</th>
                                <th style={{ width: "30%" }} className="text-center">Nombre</th>
                                <th style={{ width: "30%" }} className="text-center">Usuarios</th>
                                <th style={{ width: "30%" }} className="text-center">Estado Rol</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                arrRoles.map((objRol, indice) => (
                                    <tr key={indice}>
                                        <td className="text-center">{objRol.codRol}</td>
                                        <td className="text-center">{objRol.nombreRol}</td>
                                        {/* Mostrar usuarios asignados al rol */}
                                        <td className="text-center">
                                            {objRol.usuarios && objRol.usuarios.length > 0 ? (
                                                objRol.usuarios.map((user, idx) => (
                                                    <div key={idx}>{user.nombre}</div>
                                                ))
                                            ) : (
                                                <div>No hay usuarios asignados</div>
                                            )}
                                        </td>
                                        <td className="text-center">{objRol.estadoRol === 1 ? 'Rol Activo' : 'Rol Inactivo'}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
