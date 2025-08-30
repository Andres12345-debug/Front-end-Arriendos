import { useEffect, useState } from "react";
import { URLS } from "../../../utilities/dominios/urls";
import { ServicioGet } from "../../../services/ServicioGet";
import { Usuario } from "../../../models/Usuario";
import { Role } from "../../../models/Rol";
import { Link } from "react-router-dom";

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


    {/* Listar de Roles y Usuarios 

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

    */}


    useEffect(() => {
        const cargarTodo = async () => {
            setLoading(true);
            await consultarPerfil();
            setLoading(false);
        };
        cargarTodo();
    }, []);

    return (
        <div className="m-4">
            <div className="row">
                            <div className="col-4">
                                <h4 className="fst-italic fw-bold display-4">Perfil</h4>
                            </div>
                            <div className="col-8 d-flex justify-content-end align-items-center">
                                <ol className="breadcrumb breadcrumb-info breadcrumb-transparent fs-3 mb-0">
                                    <li className="breadcrumb-item"><Link to="/dash"><i className="fa fa-home"></i></Link></li>
                                    <li className="breadcrumb-item text-warning"><Link to="/dash/listUser"> Perfil</Link></li>
                                </ol>
                            </div>
                        </div>
            {/* --- PERFIL USUARIO LOGUEADO --- */}
            
            {perfil && (
                <div className="card shadow p-4 mb-4 col-md-6">
                    <h2>{perfil?.nombreUsuario}</h2>
                    <p>Rol: {perfil?.rolNombre}</p>
                    <p>Teléfono: {perfil?.telefonoUsuario}</p>
                    <p>Género: {perfil?.generoUsuario === 1 ? "Masculino" : perfil?.generoUsuario === 2 ? "Femenino" : "Otro"}</p>
                </div>
            )}
        </div>
    );
};
