import { useEffect, useState } from "react";
import { Role } from "../../../models/Rol";
import { URLS } from "../../../utilities/dominios/urls";
import { ServicioGet } from "../../../services/ServicioGet";
import { ServicioDelete } from "../../../services/ServicioDelete";
import { crearMensaje } from "../../../utilities/funciones/mensaje";
import { ServicioPutRoles } from "../../../services/ServicioPutRoles";
import { Link } from "react-router-dom";
import { Button, Form, Modal } from "react-bootstrap";

export const RolAdministrar = () => {
    const [arrRoles, setArrRoles] = useState<Role[]>([]);
    const [rolSeleccionado, setRolSeleccionado] = useState<Role>(new Role(0, "", 0));
    const [show, setShow] = useState(false);
    const [showActualizar, setShowActualizar] = useState(false);

    const handleCloser = () => setShow(false);
    const handleCloseActualizar = () => setShowActualizar(false);

    const consultarRoles = async () => {
        try {
            const urlServicio = URLS.URL_BASE + URLS.LISTAR_ROLES;
            console.log("Consultando roles en:", urlServicio);
            
            const resultado = await ServicioGet.peticionGet(urlServicio);

            if (Array.isArray(resultado)) {
                setArrRoles(resultado);
            } else if (resultado && Array.isArray(resultado.objeto)) {
                setArrRoles(resultado.objeto);
            } else {
                console.error("Formato inesperado del backend:", resultado);
                crearMensaje('error', "Error al cargar los roles. Verifica la conexión con el servidor.");
                setArrRoles([]);
            }
        } catch (error) {
            console.error("Error al consultar roles:", error);
            crearMensaje('error', "Error de conexión con el servidor. Verifica que el backend esté funcionando.");
            setArrRoles([]);
        }
    };


    const eliminarRoles = async (codigo: number) => {
        const urlServicio = URLS.URL_BASE + URLS.ELIMINAR_ROLES + '/' + codigo;
        const resultado = await ServicioDelete.peticionDelete(urlServicio);
        crearMensaje(resultado.affected ? 'success' : 'error', resultado.affected ? "Rol eliminado satisfactoriamente" : "Fallo al eliminar el rol");
        consultarRoles();
    };

    const actualizarRol = async () => {
        const urlServicio = URLS.URL_BASE + URLS.ACTUALIZAR_ROLES + '/' + rolSeleccionado.codRol;
        try {
            const resultado = await ServicioPutRoles.putRol(rolSeleccionado.codRol, rolSeleccionado);

            if (resultado?.mensaje === "Rol actualizado") {
                crearMensaje('success', "Rol actualizado satisfactoriamente");
    
                // Actualiza directamente el estado arrRoles
                setArrRoles((prevRoles) =>
                    prevRoles.map((rol) =>
                        rol.codRol === rolSeleccionado.codRol ? { ...rol, ...rolSeleccionado } : rol
                    )
                );
                setShowActualizar(false); // Cierra el modal
            } else {
                crearMensaje('error', "Fallo al actualizar el Rol");
            }
        } catch (error) {
            console.error("Error en la actualización:", error);
            crearMensaje('error', "Error en el servidor al intentar actualizar el Rol");
        }
    };
            
    

    useEffect(() => {
        consultarRoles();
    }, []);

    return (
        <div className="m-4">
            <div className="row">
                <div className="col-4">
                    <h4 className="fst-italic fw-bold display-4">Administrar Roles</h4>
                </div>
                <div className="col-8 d-flex justify-content-end">
                    <ol className="breadcrumb breadcrumb-info breadcrumb-transparent fs-3">
                        <li className="breadcrumb-item"><Link to="/dash"><i className="fa fa-home"></i></Link></li>
                        <li className="breadcrumb-item"><a href="#"> Roles</a></li>
                        <li className="breadcrumb-item text-warning">Administrar</li>
                    </ol>
                </div>
            </div>
            <div className="d-flex justify-content-center mt-3">
                <div className="col-md-10">
                    <table className="table table-sm table-striped table-hover">
                        <thead className="table-primary text-white fs-2 text-center">
                            <tr>
                                <th style={{ width: "20%" }}>Codigo</th>
                                <th style={{ width: "25%" }}>Nombre</th>
                                <th style={{ width: "20%" }}>Estado</th>
                                <th style={{ width: "20%" }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="text-center">
                            {arrRoles.map((objRol, indice) => (
                                <tr key={indice}>
                                    <td>{objRol.codRol}</td>
                                    <td>{objRol.nombreRol}</td>
                                    <td   className={objRol.estadoRol === 1 ? "text-success" : "text-danger"}>
                                    {objRol.estadoRol === 1 ? "Activo" : "Inactivo"}</td>
                                    <td>
                                        <Button className="btn btn-warning btn-sm mx-2"
                                            onClick={() => {
                                                setRolSeleccionado(objRol);
                                                setShowActualizar(true);
                                            }}>
                                            <i className="fa fa-edit"></i>
                                        </Button>
                                        <Button className="btn btn-danger btn-sm mx-2"
                                            onClick={() => {
                                                setRolSeleccionado(objRol);
                                                setShow(true);
                                            }}>
                                            <i className="fa fa-trash"></i>
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal para Eliminar Rol */}
            <Modal show={show} onHide={handleCloser} backdrop="static" keyboard={false}>
                <Modal.Header closeButton className="bg-primary text-warning">
                    <Modal.Title>Eliminar Rol</Modal.Title>
                </Modal.Header>
                <Modal.Body>¿Está seguro de eliminar el rol <strong>{rolSeleccionado.nombreRol}</strong>?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloser}>Cancelar</Button>
                    <Button variant="danger" onClick={() => {
                        eliminarRoles(rolSeleccionado.codRol);
                        setShow(false);
                    }}>Eliminar</Button>
                </Modal.Footer>
            </Modal>

            {/* Modal para Actualizar Rol */}
            <Modal show={showActualizar} onHide={handleCloseActualizar} backdrop="static" keyboard={false}>
                <Modal.Header closeButton className="bg-primary text-warning">
                    <Modal.Title>Actualizar Rol</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formNombreRol">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control type="text" value={rolSeleccionado.nombreRol} onChange={(e) =>
                                setRolSeleccionado({ ...rolSeleccionado, nombreRol: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="formEstadoRol" className="mt-3">
                            <Form.Label>Estado</Form.Label>
                            <Form.Select value={rolSeleccionado.estadoRol} onChange={(e) =>
                                setRolSeleccionado({ ...rolSeleccionado, estadoRol: parseInt(e.target.value) })}>
                                <option value={1}>Activo</option>
                                <option value={0}>Inactivo</option>
                            </Form.Select>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseActualizar}>Cancelar</Button>
                    <Button variant="primary" onClick={() => {
                        actualizarRol();
                        setShowActualizar(false);
                    }}>Actualizar</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};
