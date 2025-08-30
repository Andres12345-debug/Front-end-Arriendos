import { useEffect, useState } from "react"
import { Usuario } from "../../../models/Usuario";
import { URLS } from "../../../utilities/dominios/urls";
import { ServicioGet } from "../../../services/ServicioGet";
import { ServicioDelete } from "../../../services/ServicioDelete";
import { crearMensaje } from "../../../utilities/funciones/mensaje";
import { Link } from "react-router-dom";
import { Button, Form, Modal } from "react-bootstrap";
import { ServicioPutUsuario } from "../../../services/ServicioPutUsuarios";
import { Role } from "../../../models/Rol";

export const UsuarioAdministrar = () => {
    const [arrUsuario, setArrUsuario] = useState<Usuario[]>([]);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<Usuario>(new Usuario(0, "", new Date(), "", 0, 0, ""));
    const [show, setShow] = useState(false);
    const [showActualizar, setShowActualizar] = useState(false);

    const handleCloser = () => setShow(false);
    const handleCloseActualizar = () => setShowActualizar(false);

    const [arrRoles, setArrRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(true); // Estado para gestionar la carga

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




    const consultarUsuarios = async () => {
        const urlServicio = URLS.URL_BASE + URLS.LISTAR_USUARIOS;

        try {
            const resultado = await ServicioGet.peticionGet(urlServicio);

            if (Array.isArray(resultado)) {
                setArrUsuario(resultado);
            } else if (resultado && Array.isArray(resultado.objeto)) {
                setArrUsuario(resultado.objeto);
            } else {
                console.error("Formato inesperado del backend:", resultado);
                setArrUsuario([]);
            }
        } catch (error) {
            console.error("Error al consultar usuarios:", error);
            setArrUsuario([]);
        }
    };


    const eliminarUsuario = async (codigo: number) => {
        const urlServicio = URLS.URL_BASE + URLS.ELIMINAR_USUARIO + '/' + codigo;
        const resultado = await ServicioDelete.peticionDelete(urlServicio);
        crearMensaje(resultado.affected ? 'success' : 'error', resultado.affected ? "Usuario eliminado satisfactoriamente" : "Fallo al eliminar el Usuario");
        consultarUsuarios();
    }

   const actualizarUsuario = async () => {
    try {
        const resultado = await ServicioPutUsuario.actualizarUsuario(
            usuarioSeleccionado.codUsuario, 
            usuarioSeleccionado
        );

        // Verificar diferentes posibles respuestas del backend
        if (resultado?.mensaje?.includes("actualizado") || 
            resultado?.message?.includes("success") ||
            resultado?.status === "success") {
            crearMensaje('success', "Usuario actualizado satisfactoriamente");
        } else {
            // Mostrar el mensaje específico del backend si existe
            const mensajeError = resultado?.mensaje || resultado?.message || "Fallo al actualizar el Usuario";
            crearMensaje('error', mensajeError);
        }
    } catch (error: any) {
        console.error("Error en la actualización", error);
        
        // Mensaje más específico del error
        const mensajeError = error.message || "Error en el servidor al intentar actualizar el usuario";
        crearMensaje('error', mensajeError);
    } finally {
        consultarUsuarios();
    }
}
    useEffect(() => {
        consultarUsuarios();
    }, []);

    /* Rendirizacion */
    return (
        <div className="m-4">
            {/* Encabezado */}
            <div className="row align-items-center mb-4">
                <div className="col-lg-6">
                    <h4 className="fst-italic fw-bold display-5">Administrar Usuarios</h4>
                </div>
                <div className="col-lg-6 d-flex justify-content-lg-end">
                    <ol className="breadcrumb breadcrumb-info breadcrumb-transparent fs-5">
                        <li className="breadcrumb-item">
                            <Link to="/dash">
                                <i className="fa fa-home"></i>
                            </Link>
                        </li>
                        <li className="breadcrumb-item">
                            <a href="#">Usuarios</a>
                        </li>
                        <li className="breadcrumb-item text-warning">Administrar</li>
                    </ol>
                </div>
            </div>

            {/* Tabla de usuarios */}
            <div className="d-flex justify-content-center">
                <div className="col-lg-10">
                    <table className="table table-bordered table-hover text-center align-middle">
                        <thead className="table-primary text-white fs-5">
                            <tr>
                                <th style={{ width: "10%" }}>Código</th>
                                <th style={{ width: "30%" }}>Nombre</th>
                                <th style={{ width: "15%" }}>Fecha de Nacimiento</th>
                                <th style={{ width: "10%" }}>Teléfono</th>
                                <th style={{ width: "10%" }}>Género</th>
                                <th style={{ width: "15%" }}>Rol</th>
                                <th style={{ width: "15%" }}>Acciones</th>
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

                                    <td>
                                        <Button
                                            className="btn btn-warning btn-sm mx-1"
                                            onClick={() => {
                                                setUsuarioSeleccionado(objUsuario);
                                                setShowActualizar(true);
                                            }}
                                        >
                                            <i className="fa fa-edit"></i>
                                        </Button>
                                        <Button
                                            className="btn btn-danger btn-sm mx-1"
                                            onClick={() => {
                                                setUsuarioSeleccionado(objUsuario);
                                                setShow(true);
                                            }}
                                        >
                                            <i className="fa fa-trash"></i>
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal para Eliminar Municipio */}
            <Modal
                show={show}
                onHide={handleCloser}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton className="bg-primary text-white">
                    <Modal.Title>Eliminar Usuario</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    ¿Está seguro de eliminar el usuario{" "}
                    <strong>{usuarioSeleccionado.nombreUsuario}</strong>?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloser}>
                        Cancelar
                    </Button>
                    <Button
                        variant="danger"
                        onClick={() => {
                            eliminarUsuario(usuarioSeleccionado.codUsuario);
                            setShow(false);
                        }}
                    >
                        Eliminar
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal para Actualizar Municipio */}
            <Modal
                show={showActualizar}
                onHide={handleCloseActualizar}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton className="bg-primary text-white">
                    <Modal.Title>Actualizar Usuario</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        {/* Nombre del Usuario */}
                        <Form.Group controlId="formNombreUsuario">
                            <Form.Label>Nombre del Usuario</Form.Label>
                            <Form.Control
                                type="text"
                                value={usuarioSeleccionado.nombreUsuario}
                                onChange={(e) =>
                                    setUsuarioSeleccionado({
                                        ...usuarioSeleccionado,
                                        nombreUsuario: e.target.value,
                                    })
                                }
                            />
                        </Form.Group>

                        <Form.Group controlId="formFechaNacimiento" className="mt-3">
                            <Form.Label>Fecha de Nacimiento</Form.Label>
                            <Form.Control
                                type="date"
                                value={usuarioSeleccionado.fechaNacimientoUsuario instanceof Date
                                    ? usuarioSeleccionado.fechaNacimientoUsuario.toISOString().split("T")[0]  // Convierte la fecha a 'YYYY-MM-DD'
                                    : ""}  // Si no es un objeto Date, deja el campo vacío
                                onChange={(e) => {
                                    const newFechaNacimiento = new Date(e.target.value);  // Convierte la cadena 'YYYY-MM-DD' a un objeto Date
                                    setUsuarioSeleccionado({
                                        ...usuarioSeleccionado,
                                        fechaNacimientoUsuario: newFechaNacimiento,
                                    });
                                }}
                            />
                        </Form.Group>
                        {/* Teléfono */}
                        <Form.Group controlId="formTelefonoUsuario" className="mt-3">
                            <Form.Label>Teléfono</Form.Label>
                            <Form.Control
                                type="text"
                                value={usuarioSeleccionado.telefonoUsuario}
                                onChange={(e) =>
                                    setUsuarioSeleccionado({
                                        ...usuarioSeleccionado,
                                        telefonoUsuario: e.target.value,
                                    })
                                }
                            />
                        </Form.Group>

                        {/* Género */}
                        <Form.Group controlId="formGeneroUsuario" className="mt-3">
                            <Form.Label>Género</Form.Label>
                            <Form.Select
                                value={usuarioSeleccionado.generoUsuario}
                                onChange={(e) =>
                                    setUsuarioSeleccionado({
                                        ...usuarioSeleccionado,
                                        generoUsuario: Number(e.target.value),
                                    })
                                }
                            >
                                <option value="">Seleccione el género</option>
                                <option value={1}>Masculino</option>
                                <option value={2}>Femenino</option>
                                <option value={3}>Otro</option>
                            </Form.Select>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseActualizar}>
                        Cancelar
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => {
                            actualizarUsuario();
                            setShowActualizar(false);
                        }}
                    >
                        Actualizar
                    </Button>
                </Modal.Footer>
            </Modal>

        </div>
    );

};