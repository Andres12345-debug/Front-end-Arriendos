import { useEffect, useState } from "react";
import { URLS } from "../../../utilities/dominios/urls";
import { ServicioGet } from "../../../services/ServicioGet";
import { Link } from "react-router-dom";
import { Publicacion } from "../../../models/Publicacion";
import { Modal, Button } from "react-bootstrap";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { ServicioPost } from "../../../services/ServicioPost";

export const PublicacionListar = () => {
    const [arrPubli, setArrRoles] = useState<Publicacion[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedPublicacion, setSelectedPublicacion] = useState<Publicacion | null>(null);

    const consultar = async () => {
        const urlServicio = URLS.URL_BASE + URLS.LISTAR_PUBLICACION;
        const resultado = await ServicioGet.peticionGet(urlServicio);
        setArrRoles(Array.isArray(resultado) ? resultado : []); // Asegura que sea un arreglo
    };

    useEffect(() => {
        consultar();
    }, []);

    // Función para abrir el modal con las imágenes
    const handleShowModal = (publicacion: Publicacion) => {
        setSelectedPublicacion(publicacion);
        setShowModal(true);
    };

    // Función para cerrar el modal
    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedPublicacion(null);
    };

    return (
        <div className="m-4">
            <div className="row">
                <div className="col-4">
                    <h4 className="fst-italic fw-bold display-4">TODAS LAS PUBLICACIONES</h4>
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
                                <th style={{ width: "5%" }} className="text-center">Id</th>
                                <th style={{ width: "20%" }} className="text-center">Titulo</th>
                                <th style={{ width: "20%" }} className="text-center">Sub Titulo</th>
                                <th style={{ width: "20%" }} className="text-center">Cuerpo</th>
                                <th style={{ width: "10%" }} className="text-center">Imagen</th>
                                <th style={{ width: "30%" }} className="text-center">Fecha Publicacion</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                arrPubli.map((objPubli, indice) => (
                                    <tr key={indice}>
                                        <td className="text-center">{objPubli.codPublicacion}</td>
                                        <td className="text-center">{objPubli.tituloPublicacion}</td>
                                        <td className="text-center">{objPubli.metros}</td>
                                        <td className="text-center">{objPubli.contenidoPublicacion}</td>

                                        {/* Mostrar múltiples imágenes */}
                                        <td className="text-center">
                                            {objPubli.imagenesUrls && objPubli.imagenesUrls.length > 0 ? (
                                                <div>
                                                    <img
                                                        src={URLS.URL_BASE + objPubli.imagenesUrls[0]}
                                                        alt="Primera imagen"
                                                        style={{
                                                            width: "100px",
                                                            height: "80px",
                                                            objectFit: "cover",
                                                            cursor: "pointer",
                                                            borderRadius: "4px"
                                                        }}
                                                        onClick={() => handleShowModal(objPubli)}
                                                    />
                                                    {objPubli.imagenesUrls.length > 1 && (
                                                        <div className="text-muted small mt-1">
                                                            +{objPubli.imagenesUrls.length - 1} más
                                                        </div>
                                                    )}
                                                </div>
                                            ) : objPubli.imagenUrl ? (
                                                <img
                                                    src={URLS.URL_BASE + objPubli.imagenUrl}
                                                    alt="Imagen de la publicación"
                                                    style={{
                                                        width: "100px",
                                                        height: "80px",
                                                        objectFit: "cover",
                                                        cursor: "pointer",
                                                        borderRadius: "4px"
                                                    }}
                                                    onClick={() => handleShowModal(objPubli)}
                                                />
                                            ) : (
                                                "No disponible"
                                            )}
                                        </td>

                                        <td className="text-center">
                                            <button
                                                className="btn btn-sm btn-success"
                                                onClick={() =>
                                                    document.getElementById(`fileInput-${objPubli.codPublicacion}`)?.click()
                                                }
                                            >
                                                Agregar imágenes
                                            </button>

                                            <input
                                                type="file"
                                                id={`fileInput-${objPubli.codPublicacion}`}
                                                multiple
                                                accept="image/*"
                                                style={{ display: "none" }}
                                                onChange={async (e) => {
                                                    if (e.target.files && e.target.files.length > 0) {
                                                        const formData = new FormData();
                                                        formData.append("codPublicacion", objPubli.codPublicacion.toString());

                                                        Array.from(e.target.files).forEach((file) => {
                                                            formData.append("imagenes", file); // "imagenes" coincide con @UploadedFiles() del backend
                                                        });

                                                        const resultado = await ServicioPost.peticionPost(
                                                            URLS.URL_BASE + URLS.CREAR_PUBLICACION,
                                                            formData,
                                                            true // activamos modo multipart
                                                        );

                                                        console.log("Respuesta al subir imágenes:", resultado);
                                                        consultar(); // recarga la lista para ver las nuevas imágenes
                                                    }
                                                }}
                                            />
                                        </td>



                                        <td className="text-center">
                                            {new Date(objPubli.fechaCreacionPublicacion).toLocaleString("es-ES", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal para mostrar el carrusel de imágenes */}
            <Modal show={showModal} onHide={handleCloseModal} size="xl">
                <Modal.Header closeButton>
                    <Modal.Title>{selectedPublicacion?.tituloPublicacion}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedPublicacion && (
                        <div>
                            {/* Mostrar carrusel si hay múltiples imágenes */}
                            {selectedPublicacion.imagenesUrls && selectedPublicacion.imagenesUrls.length > 0 ? (
                                <Carousel
                                    showArrows={true}
                                    showThumbs={true}
                                    showStatus={true}
                                    infiniteLoop={true}
                                    autoPlay={false}
                                    className="shadow-lg rounded"
                                >
                                    {selectedPublicacion.imagenesUrls.map((imagenUrl, index) => (
                                        <div key={index}>
                                            <img
                                                src={URLS.URL_BASE + imagenUrl}
                                                alt={`Imagen ${index + 1}`}
                                                style={{
                                                    maxHeight: "500px",
                                                    objectFit: "contain",
                                                    borderRadius: "8px"
                                                }}
                                            />
                                        </div>
                                    ))}
                                </Carousel>
                            ) : selectedPublicacion.imagenUrl ? (
                                <div className="text-center">
                                    <img
                                        src={URLS.URL_BASE + selectedPublicacion.imagenUrl}
                                        alt="Imagen de la publicación"
                                        style={{
                                            maxHeight: "500px",
                                            maxWidth: "100%",
                                            objectFit: "contain",
                                            borderRadius: "8px"
                                        }}
                                    />
                                </div>
                            ) : (
                                <div className="text-center text-muted">
                                    No hay imágenes disponibles
                                </div>
                            )}

                            {/* Información adicional */}
                            <div className="mt-4">
                                <h5>Información de la publicación</h5>
                                <p><strong>Contenido:</strong> {selectedPublicacion.contenidoPublicacion}</p>
                                <p><strong>Metros:</strong> {selectedPublicacion.metros}</p>
                                <p><strong>Habitaciones:</strong> {selectedPublicacion.habitaciones}</p>
                                <p><strong>Baños:</strong> {selectedPublicacion.banios}</p>
                                <p><strong>Tipo:</strong> {selectedPublicacion.tipo}</p>
                                <p><strong>Fecha:</strong> {new Date(selectedPublicacion.fechaCreacionPublicacion).toLocaleDateString("es-ES")}</p>
                            </div>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};
