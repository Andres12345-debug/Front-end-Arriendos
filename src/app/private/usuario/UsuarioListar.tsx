import { useEffect, useState } from "react";
import { URLS } from "../../../utilities/dominios/Urls";
import { ServicioGet } from "../../../services/ServicioGet";
import { Usuario } from "../../../models/Usuario";
import { Role } from "../../../models/Rol";

export const UsuarioListar = () => {
    const [arrUsuario, setArrUsuario] = useState<any[]>([]);
    const [arrRoles, setArrRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(true); // Estado para gestionar la carga

    // Función para consultar los roles y usuarios
    const consultarDatos = async () => {
        setLoading(true);
        try {
            // Consultar roles
            const urlRoles = URLS.URL_BASE + URLS.LISTAR_ROLES;
            const roles = await ServicioGet.peticionGet(urlRoles);

            // Consultar usuarios
            const urlUsuarios = URLS.URL_BASE + URLS.LISTAR_USUARIOS;
            const usuarios = await ServicioGet.peticionGet(urlUsuarios);

            // Mapear usuarios con los roles
            const usuariosConRol = usuarios.map((usuario: Usuario) => {
                const rol = roles.find((rol: Role) => rol.codRol === usuario.codRol);
                return {
                    ...usuario,
                    rolNombre: rol ? rol.nombreRol : "No asignado",
                };
            });

            setArrRoles(roles); // Guardar roles
            setArrUsuario(usuariosConRol); // Guardar usuarios
        } catch (error) {
            console.error("Error al cargar datos:", error);
        } finally {
            setLoading(false); // Finalizar la carga
        }
    };

    useEffect(() => {
        consultarDatos(); // Consultar roles y usuarios al montar
    }, []);

    return (
        <div className="m-4">
            <div className="row align-items-center mb-4">
                <div className="col-lg-6">
                    <h4 className="fst-italic fw-bold display-5">Listar Usuarios</h4>
                </div>
                <div className="col-lg-6 d-flex justify-content-lg-end">
                    <ol className="breadcrumb breadcrumb-info breadcrumb-transparent fs-5">
                        <li className="breadcrumb-item">
                            <a href="#">Usuarios</a>
                        </li>
                        <li className="breadcrumb-item text-warning">Listar</li>
                    </ol>
                </div>
            </div>

            {loading ? (
                <div className="text-center">Cargando...</div>
            ) : (
                <div className="d-flex justify-content-center mt-3">
                    <div className="col-md-10">
                        <table className="table table-hover text-center align-middle">
                            <thead className="table-primary text-white fs-2">
                                <tr>
                                    <th style={{ width: "15%" }}>Código</th>
                                    <th style={{ width: "35%" }}>Nombre</th>
                                    <th style={{ width: "15%" }}>Fecha de Nacimiento</th>
                                    <th style={{ width: "15%" }}>Teléfono</th>
                                    <th style={{ width: "10%" }}>Género</th>
                                    <th style={{ width: "10%" }}>Rol</th>
                                </tr>
                            </thead>
                            <tbody>
                                {arrUsuario.map((objUsuario, indice) => (
                                    <tr key={indice}>
                                        <td>{objUsuario.codUsuario}</td>
                                        <td>{objUsuario.nombreUsuario}</td>
                                        <td>{new Date(objUsuario.fechaNacimientoUsuario).toLocaleDateString()}</td>
                                        <td>{objUsuario.telefonoUsuario}</td>
                                        <td>{objUsuario.generoUsuario}</td>
                                        <td>{objUsuario.rolNombre}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};
