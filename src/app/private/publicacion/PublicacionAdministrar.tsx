import { useEffect, useState } from "react";
import { Role } from "../../../models/Rol";
import { URLS } from "../../../utilities/dominios/Urls";
import { ServicioGet } from "../../../services/ServicioGet";
import { ServicioDelete } from "../../../services/ServicioDelete";
import { crearMensaje } from "../../../utilities/funciones/mensaje";
import { ServicioPut } from "../../../services/ServicioPut";
import { ServicioPost } from "../../../services/ServicioPost"; // <-- IMPORTAR
import { Link } from "react-router-dom";
import { Button, Form, Modal } from "react-bootstrap";
import { Publicacion, TipoVivienda } from "../../../models/Publicacion";

export const PublicacionAdministrar = () => {
    const [arrPublicacion, setArrPublicacion] = useState<Publicacion[]>([]);
    const [rolSeleccionado, setRolSeleccionado] = useState<Publicacion>(new Publicacion(0, 0, "", "", "", "", new Date(), 0, 0, 0, 0, "", 0, 0, TipoVivienda.CASA));
    const [show, setShow] = useState(false);
    const [showActualizar, setShowActualizar] = useState(false);
    const [showCrear, setShowCrear] = useState(false);

    // Reutilizamos selectedFiles y previewImages para crear y actualizar
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previewImages, setPreviewImages] = useState<string[]>([]);

    const [nuevaPublicacion, setNuevaPublicacion] = useState<Publicacion>(new Publicacion(0, 0, "", "", "", "", new Date(), 0, 0, 0, 0, "", 0, 0, TipoVivienda.CASA));

    const handleCloser = () => setShow(false);
    const handleCloseActualizar = () => {
        setShowActualizar(false);
        setSelectedFiles([]);
        setPreviewImages([]);
    };
    const handleCloseCrear = () => {
        setShowCrear(false);
        setSelectedFiles([]);
        setPreviewImages([]);
        setNuevaPublicacion(new Publicacion(0, 0, "", "", "", "", new Date(), 0, 0, 0, 0, "", 0, 0, TipoVivienda.CASA));
    };

    const consultarPublicacion = async () => {
        try {
            const urlServicio = URLS.URL_BASE + URLS.LISTAR_PUBLICACION;
            const resultado = await ServicioGet.peticionGet(urlServicio);

            if (Array.isArray(resultado)) {
                setArrPublicacion(resultado);
            } else if (resultado && Array.isArray(resultado.objeto)) {
                setArrPublicacion(resultado.objeto);
            } else {
                console.error("Formato inesperado del backend:", resultado);
                setArrPublicacion([]);
            }
        } catch (error) {
            console.error("Error al consultar publicaciones:", error);
            setArrPublicacion([]);
        }
    };

    const eliminarRoles = async (codigo: number) => {
        const urlServicio = URLS.URL_BASE + URLS.ELIMINAR_PUBLICACION + '/' + codigo;
        const resultado = await ServicioDelete.peticionDelete(urlServicio);
        crearMensaje(resultado.affected ? 'success' : 'error', resultado.affected ? "Publicacion eliminado satisfactoriamente" : "Fallo al eliminar el rol");
        consultarPublicacion();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const archivosSeleccionados = Array.from(e.target.files);
            setSelectedFiles(archivosSeleccionados);

            // Generar previews
            const previews: string[] = [];
            archivosSeleccionados.forEach((archivo) => {
                const reader = new FileReader();
                reader.onload = (event) => {
                    if (event.target?.result) {
                        previews.push(event.target.result as string);
                        // Actualiza con el array actual (evita race conditions)
                        setPreviewImages(prev => {
                            const merged = [...prev, (event.target!.result as string)];
                            return merged;
                        });
                    }
                };
                reader.readAsDataURL(archivo);
            });
        }
    };

    // Método para eliminar una imagen específica del preview
    const eliminarImagenPreview = (index: number) => {
        const nuevasImagenes = selectedFiles.filter((_, i) => i !== index);
        const nuevasPreviews = previewImages.filter((_, i) => i !== index);
        setSelectedFiles(nuevasImagenes);
        setPreviewImages(nuevasPreviews);
    };

    const actualizarPublicacion = async () => {
        const urlServicio = URLS.URL_BASE + URLS.ACTUALIZAR_PUBLICACION + '/' + rolSeleccionado.codPublicacion;
        try {
            const formData = new FormData();

            formData.append("tituloPublicacion", rolSeleccionado.tituloPublicacion);
            formData.append("contenidoPublicacion", rolSeleccionado.contenidoPublicacion);
            formData.append("metros", rolSeleccionado.metros);
            formData.append("tipo", rolSeleccionado.tipo);
            formData.append("habitaciones", rolSeleccionado.habitaciones.toString());
            formData.append("banios", rolSeleccionado.banios.toString());
            formData.append("parqueadero", rolSeleccionado.parqueadero.toString());
            formData.append("estrato", rolSeleccionado.estrato.toString());
            formData.append("servicios", rolSeleccionado.servicios.toString());
            formData.append("administracion", rolSeleccionado.administracion.toString());

            // OJO: tu backend PUT actual usa FileInterceptor('imagen') (singular).
            // Si quieres subir múltiples imágenes en el PUT, debes cambiar el backend (FilesInterceptor('imagenes', ...)).
            if (selectedFiles.length > 0) {
                // Si el backend espera 'imagen' (singular) comentar esta parte y usar file único:
                selectedFiles.forEach((archivo) => {
                    formData.append(`imagenes`, archivo); // solo si backend acepta 'imagenes' en PUT
                });
            }

            const resultado = await ServicioPut.peticionPut(urlServicio, formData);

            if (resultado?.mensaje === "Publicacion actualizada") {
                crearMensaje('success', "Publicación actualizada satisfactoriamente");

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
                setShowActualizar(false);
                setSelectedFiles([]);
                setPreviewImages([]);
            } else {
                crearMensaje('error', "Fallo al actualizar la publicación");
            }
        } catch (error) {
            console.error("Error en la actualización:", error);
            crearMensaje('error', "Error en el servidor al intentar actualizar la publicación");
        }
    };

    // --- NUEVO: crearPublicacion con múltiples imágenes ---
    const crearPublicacion = async () => {
        const urlServicio = URLS.URL_BASE + URLS.CREAR_PUBLICACION_CON_IMAGENES;
        try {
            const formData = new FormData();

            formData.append("tituloPublicacion", nuevaPublicacion.tituloPublicacion);
            formData.append("contenidoPublicacion", nuevaPublicacion.contenidoPublicacion);
            formData.append("metros", nuevaPublicacion.metros);
            formData.append("tipo", nuevaPublicacion.tipo);
            formData.append("habitaciones", nuevaPublicacion.habitaciones.toString());
            formData.append("banios", nuevaPublicacion.banios.toString());
            formData.append("parqueadero", nuevaPublicacion.parqueadero.toString());
            formData.append("estrato", nuevaPublicacion.estrato.toString());
            formData.append("servicios", nuevaPublicacion.servicios.toString());
            formData.append("administracion", nuevaPublicacion.administracion.toString());

            // Adjuntar imágenes con el campo EXACTO que espera el backend: 'imagenes'
            if (selectedFiles.length > 0) {
                selectedFiles.forEach((archivo) => {
                    formData.append("imagenes", archivo);
                });
            }

            // IMPORTANTE: pasar isMultipart = true para que ServicioPost NO agregue Content-Type (el navegador lo define)
            const resultado = await ServicioPost.peticionPost(urlServicio, formData, true);

            // Tu servicio en Nest devuelve: { success: true, message: '...', data: publicacionGuardada }
            if (resultado && resultado.success) {
                crearMensaje('success', "Publicación creada correctamente");
                consultarPublicacion();
                handleCloseCrear();
            } else {
                console.error("Respuesta al crear publicación:", resultado);
                crearMensaje('error', resultado?.message || "Fallo al crear la publicación");
            }

        } catch (error) {
            console.error("Error creando publicación:", error);
            crearMensaje('error', "Error en el servidor al crear la publicación");
        }
    };
    // --- FIN crearPublicacion ---

    useEffect(() => {
        consultarPublicacion();
    }, []);

    return (
        <div className="m-4">
            <div className="row">
                <div className="col-4">
                    <h4 className="fst-italic fw-bold display-4">Administrar Publicaciones</h4>
                </div>
                <div className="col-8 d-flex justify-content-end align-items-center">
                    <Button className="me-3" variant="success" onClick={() => setShowCrear(true)}>
                        <i className="fa fa-plus"></i> Nueva Publicación
                    </Button>
                    <ol className="breadcrumb breadcrumb-info breadcrumb-transparent fs-3 mb-0">
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
                        {/* --- (igual que antes) --- */}
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

                        {/* ... otros campos ... */}

                        <Form.Group controlId="formImagenes">
                            <Form.Label>Imágenes (selecciona múltiples imágenes para reemplazar)</Form.Label>
                            <Form.Control
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                            <Form.Text className="text-muted">
                                Puedes seleccionar múltiples imágenes para reemplazar las existentes.
                            </Form.Text>

                            {/* Vista previa de imágenes nuevas */}
                            {previewImages.length > 0 && (
                                <div className="mt-3">
                                    <Form.Label>Nuevas imágenes seleccionadas:</Form.Label>
                                    <div className="d-flex flex-wrap gap-2">
                                        {previewImages.map((preview, index) => (
                                            <div key={index} className="position-relative">
                                                <img
                                                    src={preview}
                                                    alt={`Nueva imagen ${index + 1}`}
                                                    style={{
                                                        width: "120px",
                                                        height: "120px",
                                                        objectFit: "cover",
                                                        borderRadius: "8px"
                                                    }}
                                                />
                                                <button
                                                    type="button"
                                                    className="btn btn-danger btn-sm position-absolute top-0 end-0"
                                                    style={{
                                                        transform: "translate(50%, -50%)",
                                                        borderRadius: "50%",
                                                        width: "25px",
                                                        height: "25px",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        padding: "0"
                                                    }}
                                                    onClick={() => eliminarImagenPreview(index)}
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Mostrar imágenes actuales */}
                            {rolSeleccionado.imagenesUrls && rolSeleccionado.imagenesUrls.length > 0 && (
                                <div className="mt-3">
                                    <Form.Label>Imágenes actuales:</Form.Label>
                                    <div className="d-flex flex-wrap gap-2">
                                        {rolSeleccionado.imagenesUrls.map((imagenUrl, index) => (
                                            <img
                                                key={index}
                                                src={URLS.URL_BASE + imagenUrl}
                                                alt={`Imagen actual ${index + 1}`}
                                                style={{
                                                    width: "120px",
                                                    height: "120px",
                                                    objectFit: "cover",
                                                    borderRadius: "8px",
                                                    border: "2px solid #dee2e6"
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Mostrar imagen única si no hay múltiples */}
                            {(!rolSeleccionado.imagenesUrls || rolSeleccionado.imagenesUrls.length === 0) && rolSeleccionado.imagenUrl && (
                                <div className="mt-2">
                                    <Form.Label>Imagen actual:</Form.Label>
                                    <div>
                                        <img
                                            src={URLS.URL_BASE + rolSeleccionado.imagenUrl}
                                            alt="Imagen actual"
                                            style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: '8px' }}
                                        />
                                    </div>
                                </div>
                            )}
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseActualizar}>Cancelar</Button>
                    <Button variant="primary" onClick={() => { actualizarPublicacion(); }}>Actualizar</Button>
                </Modal.Footer>
            </Modal>

            {/* Modal para CREAR Publicación (NUEVO) */}
            <Modal show={showCrear} onHide={handleCloseCrear} backdrop="static" keyboard={false}>
                <Modal.Header closeButton className="bg-success text-white">
                    <Modal.Title>Crear Nueva Publicación</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formTituloCrear">
                            <Form.Label>Titulo</Form.Label>
                            <Form.Control
                                type="text"
                                value={nuevaPublicacion.tituloPublicacion}
                                onChange={(e) =>
                                    setNuevaPublicacion({ ...nuevaPublicacion, tituloPublicacion: e.target.value })
                                }
                            />
                        </Form.Group>

                        <Form.Group controlId="formTipoViviendaCrear">
                            <Form.Label>Tipo de Vivienda</Form.Label>
                            <Form.Control
                                as="select"
                                value={nuevaPublicacion.tipo}
                                onChange={(e) =>
                                    setNuevaPublicacion({ ...nuevaPublicacion, tipo: e.target.value as TipoVivienda })
                                }
                            >
                                {Object.values(TipoVivienda).map((tipo) => (
                                    <option key={tipo} value={tipo}>
                                        {tipo}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId="formMetrosCrear">
                            <Form.Label>Metros de construcción</Form.Label>
                            <Form.Control
                                type="text"
                                value={nuevaPublicacion.metros}
                                onChange={(e) =>
                                    setNuevaPublicacion({ ...nuevaPublicacion, metros: e.target.value })
                                }
                            />
                        </Form.Group>

                        <Form.Group controlId="formContenidoCrear">
                            <Form.Label>Contenido</Form.Label>
                            <Form.Control
                                type="text"
                                value={nuevaPublicacion.contenidoPublicacion}
                                onChange={(e) =>
                                    setNuevaPublicacion({ ...nuevaPublicacion, contenidoPublicacion: e.target.value })
                                }
                            />
                        </Form.Group>

                        <Form.Group controlId="formImagenesCrear" className="mt-2">
                            <Form.Label>Imágenes (puedes seleccionar múltiples)</Form.Label>
                            <Form.Control
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                            <Form.Text className="text-muted">
                                Selecciona 1 o más imágenes. La primera será la principal.
                            </Form.Text>

                            {previewImages.length > 0 && (
                                <div className="mt-3">
                                    <Form.Label>Imágenes seleccionadas:</Form.Label>
                                    <div className="d-flex flex-wrap gap-2">
                                        {previewImages.map((preview, index) => (
                                            <div key={index} className="position-relative">
                                                <img
                                                    src={preview}
                                                    alt={`Nueva imagen ${index + 1}`}
                                                    style={{
                                                        width: "120px",
                                                        height: "120px",
                                                        objectFit: "cover",
                                                        borderRadius: "8px"
                                                    }}
                                                />
                                                <button
                                                    type="button"
                                                    className="btn btn-danger btn-sm position-absolute top-0 end-0"
                                                    style={{
                                                        transform: "translate(50%, -50%)",
                                                        borderRadius: "50%",
                                                        width: "25px",
                                                        height: "25px",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        padding: "0"
                                                    }}
                                                    onClick={() => eliminarImagenPreview(index)}
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseCrear}>Cancelar</Button>
                    <Button variant="success" onClick={() => crearPublicacion()}>Crear</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};
