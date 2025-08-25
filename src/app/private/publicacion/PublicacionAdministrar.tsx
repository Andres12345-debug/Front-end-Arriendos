import { useEffect, useState } from "react";
import { Role } from "../../../models/Rol";
import { URLS } from "../../../utilities/dominios/urls";
import { ServicioGet } from "../../../services/ServicioGet";
import { ServicioDelete } from "../../../services/ServicioDelete";
import { crearMensaje } from "../../../utilities/funciones/mensaje";
import { ServicioPut } from "../../../services/ServicioPut";
import { ServicioPost } from "../../../services/ServicioPost"; // <-- IMPORTAR
import { Link } from "react-router-dom";
import { Button, Form, Modal } from "react-bootstrap";
import { Publicacion, TipoPublicacion, TipoVivienda } from "../../../models/Publicacion";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from "@mui/material";


export const PublicacionAdministrar = () => {
    const [arrPublicacion, setArrPublicacion] = useState<Publicacion[]>([]);
    const [rolSeleccionado, setRolSeleccionado] = useState<Publicacion>(new Publicacion(0, 0, "", "", "", "", new Date(), 0, 0, 0, 0, "", 0, 0, TipoVivienda.CASA, TipoPublicacion.ARRIENDO, 0, "", 0, ""));
    const [show, setShow] = useState(false);
    const [showActualizar, setShowActualizar] = useState(false);
    const [showCrear, setShowCrear] = useState(false);

    // Reutilizamos selectedFiles y previewImages para crear y actualizar
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previewImages, setPreviewImages] = useState<string[]>([]);

    const [nuevaPublicacion, setNuevaPublicacion] = useState<Publicacion>(new Publicacion(0, 0, "", "", "", "", new Date(), 0, 0, 0, 0, "", 0, 0, TipoVivienda.CASA, TipoPublicacion.ARRIENDO, 0, "", 0, ""));

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
        setNuevaPublicacion(new Publicacion(0, 0, "", "", "", "", new Date(), 0, 0, 0, 0, "", 0, 0, TipoVivienda.CASA, TipoPublicacion.ARRIENDO, 0, "", 0, ""));
    };

    const consultarPublicacion = async () => {
        try {
            const urlServicio = URLS.URL_BASE + URLS.LISTAR_PUBLICACION_PRIVADA;
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
        const objActualizar: any = {
            tituloPublicacion: rolSeleccionado.tituloPublicacion,
            contenidoPublicacion: rolSeleccionado.contenidoPublicacion,
            metros: rolSeleccionado.metros,
            tipo: rolSeleccionado.tipo,
            habitaciones: rolSeleccionado.habitaciones,
            banios: rolSeleccionado.banios,
            parqueadero: rolSeleccionado.parqueadero,
            estrato: rolSeleccionado.estrato,
            servicios: rolSeleccionado.servicios,
            administracion: rolSeleccionado.administracion,
            imagenesFiles: selectedFiles // 👈 ahora mandas el array completo
        };

        const resultado = await ServicioPut.putPublicacion(rolSeleccionado.codPublicacion, objActualizar);

        if (resultado?.mensaje === "Publicación actualizada") {
            crearMensaje("success", "Publicación actualizada satisfactoriamente");
            consultarPublicacion();
            setShowActualizar(false);
            setSelectedFiles([]);
            setPreviewImages([]);
        } else {
            crearMensaje("error", "Fallo al actualizar la publicación");
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
                    <ol className="breadcrumb breadcrumb-info breadcrumb-transparent fs-3 mb-0">
                        <li className="breadcrumb-item"><Link to="/dash"><i className="fa fa-home"></i></Link></li>
                        <li className="breadcrumb-item"><a href="#"> Publicacion</a></li>
                        <li className="breadcrumb-item text-warning">Administrar</li>
                    </ol>
                </div>
            </div>

            <div className="d-flex justify-content-center mt-3">
                <div className="col-md-10">
                    <TableContainer component={Paper} sx={{ maxHeight: 500 }}>
                        <Table stickyHeader size="small" aria-label="tabla publicaciones">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center" sx={{ fontWeight: "bold", width: "20%" }}>Título</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: "bold", width: "25%" }}>Tipo de propiedad</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: "bold", width: "20%" }}>Metros</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: "bold", width: "15%" }}>Imagen</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: "bold", width: "20%" }}>Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {arrPublicacion.map((objRol, indice) => (
                                    <TableRow key={indice} hover>
                                        <TableCell align="center">{objRol.tituloPublicacion}</TableCell>
                                        <TableCell align="center">{objRol.tipo}</TableCell>
                                        <TableCell align="center">{objRol.metros}</TableCell>
                                        <TableCell align="center">
                                            {objRol.imagenUrl ? (
                                                <img
                                                    src={URLS.URL_BASE + objRol.imagenUrl}
                                                    alt="Publicación"
                                                    style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "8px" }}
                                                />
                                            ) : "Sin imagen"}
                                        </TableCell>
                                        <TableCell align="center">
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
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
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
                        <Form.Group controlId="formMetros">
                            <Form.Label>Metros</Form.Label>
                            <Form.Control
                                type="text"
                                value={rolSeleccionado.metros}
                                onChange={(e) =>
                                    setRolSeleccionado({ ...rolSeleccionado, metros: e.target.value })
                                }
                            />
                        </Form.Group>
                        <Form.Group controlId="formTipoVivienda">
                            <Form.Label>Tipo de Vivienda</Form.Label>
                            <Form.Control
                                as="select"
                                value={rolSeleccionado.tipo}
                                onChange={(e) =>
                                    setRolSeleccionado({ ...rolSeleccionado, tipo: e.target.value as TipoVivienda })
                                }
                            >
                                {Object.values(TipoVivienda).map((tipo) => (
                                    <option key={tipo} value={tipo}>
                                        {tipo}
                                    </option>
                                ))}
                            </Form.Control>
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
