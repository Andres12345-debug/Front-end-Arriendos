import { useEffect, useState } from "react";
import { Role } from "../../../models/Rol";
import { URLS } from "../../../utilities/dominios/urls";
import { ServicioGet } from "../../../services/ServicioGet";
import { ServicioDelete } from "../../../services/ServicioDelete";
import { crearMensaje } from "../../../utilities/funciones/mensaje";
import { ServicioPut } from "../../../services/ServicioPut";
import { Link } from "react-router-dom";
import { Button, Form, Modal } from "react-bootstrap";
import { Publicacion } from "../../../models/Publicacion";

export const PublicacionAdministrar = () => {
    const [arrPublicacion, setArrPublicacion] = useState<Publicacion[]>([]);
    const [rolSeleccionado, setRolSeleccionado] = useState<Publicacion>(new Publicacion(0,0,"","","","", new Date(), 0,0,0,0,"",0,0));
    const [show, setShow] = useState(false);
    const [showActualizar, setShowActualizar] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const handleCloser = () => setShow(false);
    const handleCloseActualizar = () => {
        setShowActualizar(false);
        setSelectedFile(null);
        setPreviewImage(null);
    };

    const consultarPublicacion = async () => {
        const urlServicio = URLS.URL_BASE + URLS.LISTAR_PUBLICACION;
        const resultado = await ServicioGet.peticionGet(urlServicio);
        setArrPublicacion(resultado);
    };

    const eliminarRoles = async (codigo: number) => {
        const urlServicio = URLS.URL_BASE + URLS.ELIMINAR_PUBLICACION + '/' + codigo;
        const resultado = await ServicioDelete.peticionDelete(urlServicio);
        crearMensaje(resultado.affected ? 'success' : 'error', resultado.affected ? "Publicacion eliminado satisfactoriamente" : "Fallo al eliminar el rol");
        consultarPublicacion();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const actualizarPublicacion = async () => {
        const urlServicio = URLS.URL_BASE + URLS.ACTUALIZAR_PUBLICACION + '/' + rolSeleccionado.codPublicacion;
        try {
            // Prepare the object to send
            const publicacionActualizar = {
                ...rolSeleccionado,
                ...(selectedFile && { imagenFile: selectedFile })
            };
      
            const resultado = await ServicioPut.peticionPut(urlServicio, publicacionActualizar);
      
            if (resultado?.mensaje === "Publicacion actualizada") {
                crearMensaje('success', "Publicación actualizada satisfactoriamente");
      
                // Actualiza directamente el estado arrPublicacion
                setArrPublicacion((prevPublicaciones) =>
                    prevPublicaciones.map((publicacion) =>
                        publicacion.codPublicacion === rolSeleccionado.codPublicacion 
                            ? { 
                                ...publicacion, 
                                ...resultado.objeto,
                                ...(resultado.objeto.imagenUrl && { imagenUrl: resultado.objeto.imagenUrl }) 
                            } 
                            : publicacion
                    )
                );
                setShowActualizar(false); // Cierra el modal
                setSelectedFile(null);
                setPreviewImage(null);
            } else {
                crearMensaje('error', "Fallo al actualizar la publicación");
            }
        } catch (error) {
            console.error("Error en la actualización:", error);
            crearMensaje('error', "Error en el servidor al intentar actualizar la publicación");
        }
    };           
    

    useEffect(() => {
        consultarPublicacion();
    }, []);

    return (
        <div className="m-4">
            <div className="row">
                <div className="col-4">
                    <h4 className="fst-italic fw-bold display-4">Administrar Publicaciones</h4>
                </div>
                <div className="col-8 d-flex justify-content-end">
                    <ol className="breadcrumb breadcrumb-info breadcrumb-transparent fs-3">
                        <li className="breadcrumb-item"><Link to="/dash"><i className="fa fa-home"></i></Link></li>
                        <li className="breadcrumb-item"><a href="#"> Publicacion</a></li>
                        <li className="breadcrumb-item text-warning">Administrar</li>
                    </ol>
                </div>
            </div>
            <div className="d-flex justify-content-center mt-3">
                <div className="col-md-10">
                    <table className="table table-sm table-striped table-hover">
                        <thead className="table-primary text-white fs-2 text-center">
                            <tr>
                                <th style={{ width: "20%" }}>titulo</th>
                                <th style={{ width: "25%" }}>Sub Titulo</th>
                                <th style={{ width: "20%" }}>Contenido</th>
                                <th style={{ width: "10%" }}>Imagen</th>
                                <th style={{ width: "10%" }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="text-center">
                            {arrPublicacion.map((objRol, indice) => (
                                <tr key={indice}>
                                    <td>{objRol.codPublicacion}</td>
                                    <td>{objRol.tituloPublicacion}</td>
                                    <td>{objRol.contenidoPublicacion}</td>
                                    <td>{objRol.imagenUrl}</td>                                    
                                    <td>
                                        <Button
                                            className="btn btn-warning btn-sm mx-1"
                                            onClick={() => {
                                                setRolSeleccionado(objRol);
                                                setShowActualizar(true);
                                            }}
                                        >
                                            <i className="fa fa-edit"></i>
                                        </Button>
                                        <Button
                                            className="btn btn-danger btn-sm mx-1"
                                            onClick={() => {
                                                setRolSeleccionado(objRol);
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

            {/* Modal para Eliminar Rol */}
            <Modal show={show} onHide={handleCloser} backdrop="static" keyboard={false}>
                <Modal.Header closeButton className="bg-primary text-warning">
                    <Modal.Title>Eliminar Publicacion</Modal.Title>
                </Modal.Header>
                <Modal.Body>¿Está seguro de eliminar <strong>{rolSeleccionado.tituloPublicacion}</strong>?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloser}>Cancelar</Button>
                    <Button variant="danger" onClick={() => {
                        eliminarRoles(rolSeleccionado.codPublicacion);
                        setShow(false);
                    }}>Eliminar</Button>
                </Modal.Footer>
            </Modal>

            {/* Modal para Actualizar Rol */}
            <Modal show={showActualizar} onHide={handleCloseActualizar} backdrop="static" keyboard={false}>
                <Modal.Header closeButton className="bg-primary text-warning">
                    <Modal.Title>Actualizar Publicacion</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formTitulo">
                            <Form.Label>Titulo</Form.Label>
                            <Form.Control 
                                type="text" 
                                value={rolSeleccionado.tituloPublicacion} 
                                onChange={(e) =>
                                    setRolSeleccionado({ ...rolSeleccionado, tituloPublicacion: e.target.value })
                                }
                            />
                        </Form.Group>                        
                        
                        <Form.Group controlId="formMetros">
                            <Form.Label>Metros de construccion</Form.Label>
                            <Form.Control 
                                type="text" 
                                value={rolSeleccionado.metros} 
                                onChange={(e) =>
                                    setRolSeleccionado({ ...rolSeleccionado, metros: e.target.value })
                                }
                            />
                        </Form.Group>                        
                        
                        <Form.Group controlId="formContenido">
                            <Form.Label>Contenido</Form.Label>
                            <Form.Control 
                                type="text" 
                                value={rolSeleccionado.contenidoPublicacion} 
                                onChange={(e) =>
                                    setRolSeleccionado({ ...rolSeleccionado, contenidoPublicacion: e.target.value })
                                }
                            />
                        </Form.Group>                        
                        
                        <Form.Group controlId="formImagen">
                            <Form.Label>Imagen</Form.Label>
                            <Form.Control 
                                type="file" 
                                onChange={handleFileChange}
                            />
                            {(previewImage || rolSeleccionado.imagenUrl) && (
                                <div className="mt-2">
                                    <img 
                                        src={previewImage || rolSeleccionado.imagenUrl} 
                                        alt="Preview" 
                                        style={{ maxWidth: '200px', maxHeight: '200px' }} 
                                    />
                                </div>
                            )}
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseActualizar}>Cancelar</Button>
                    <Button variant="primary" onClick={() => {
                        actualizarPublicacion();
                    }}>Actualizar</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};