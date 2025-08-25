import { useEffect, useState } from "react";
import { URLS } from "../../../utilities/dominios/urls";
import { ServicioGet } from "../../../services/ServicioGet";
import { Usuario } from "../../../models/Usuario";
import { Role } from "../../../models/Rol";

export const UsuarioListar = () => {
    const [arrUsuario, setArrUsuario] = useState<any[]>([]);
    const [arrRoles, setArrRoles] = useState<Role[]>([]);
    const [perfil, setPerfil] = useState<Usuario | null>(null);
    const [loading, setLoading] = useState(true);

    // Función para consultar el perfil
    // Función para consultar el perfil
    const consultarPerfil = async () => {
        try {
            const urlPerfil = URLS.URL_BASE + URLS.LISTAR_PERFIL;
            const data = await ServicioGet.peticionGet(urlPerfil);
            const apiUser = data.usuario;
            const perfilMapeado: Usuario = {
                codUsuario: apiUser.id,
                nombreUsuario: apiUser.nombre,
                fechaNacimientoUsuario: apiUser.fechaNacimientoUsuario
                    ? new Date(apiUser.fechaNacimientoUsuario)
                    : new Date(),
                telefonoUsuario: apiUser.telefono,
                generoUsuario: apiUser.genero ?? 0,
                codRol: apiUser.codRol ?? 0,
                rolNombre: apiUser.rol,
            };
            setPerfil(perfilMapeado);


        } catch (error) {
            console.error("Error al cargar perfil:", error);
        }
    };



    // Función para consultar los roles y usuarios
    const consultarDatos = async () => {
        try {
            const urlRoles = URLS.URL_BASE + URLS.LISTAR_ROLES;
            const roles = await ServicioGet.peticionGet(urlRoles);

            const urlUsuarios = URLS.URL_BASE + URLS.LISTAR_USUARIOS;
            const usuarios = await ServicioGet.peticionGet(urlUsuarios);

            // Mapear usuarios con sus roles
            const usuariosConRol = usuarios.map((usuario: Usuario) => {
                const rol = roles.find((rol: Role) => rol.codRol === usuario.codRol);
                return {
                    ...usuario,
                    rolNombre: rol ? rol.nombreRol : "No asignado",
                };
            });

            setArrRoles(roles);
            setArrUsuario(usuariosConRol);
        } catch (error) {
            console.error("Error al cargar usuarios:", error);
        }
    };

    useEffect(() => {
        const cargarTodo = async () => {
            setLoading(true);
            await consultarPerfil();
            await consultarDatos();
            setLoading(false);
        };
        cargarTodo();
    }, []);

    return (
        <div className="m-4">
            {/* --- PERFIL USUARIO LOGUEADO --- */}
            {perfil && (
                <div className="card shadow p-4 mb-4 col-md-6">
                    <h2>{perfil?.nombreUsuario}</h2>
                    <p>Rol: {perfil?.rolNombre}</p>
                    <p>Teléfono: {perfil?.telefonoUsuario}</p>
                    <p>Email: {perfil?.codUsuario}</p>

                </div>
            )}


            {/* --- LISTADO DE USUARIOS --- */}
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
