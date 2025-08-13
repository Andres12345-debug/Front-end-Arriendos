import { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Importa estilos del carrusel
import { Publicacion } from "../../../../models/Publicacion";
import { URLS } from "../../../../utilities/dominios/urls";
import { ServicioGet } from "../../../../services/ServicioGet";


export const Carroucel = () => {
    const [arrPubli, setArrPubli] = useState<Publicacion[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedPublicacion, setSelectedPublicacion] = useState<Publicacion | null>(null);

    // Consultar publicaciones
    const consultarPublicaciones = async () => {
        const urlServicio = URLS.URL_BASE + URLS.LISTAR_PUBLICACION_PUBLICA;
        try {
            const resultado = await ServicioGet.peticionGetPublica(urlServicio);
            setArrPubli(Array.isArray(resultado) ? resultado : []);
        } catch (error) {
            console.error("Error al obtener publicaciones:", error);
        }
    };

    useEffect(() => {
        consultarPublicaciones();
    }, []);

    // Función para abrir el modal
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
        <div className="container mt-5">
            {arrPubli.length > 0 ? (
                <Carousel
                    showArrows={true}
                    autoPlay
                    infiniteLoop
                    showThumbs={false}
                    showStatus={false}
                    className="shadow-lg rounded"
                >
                    {arrPubli.map((publicacion, index) => (
                        <div key={index} className="p-3" onClick={() => handleShowModal(publicacion)}>
                            {publicacion.imagenesUrls && publicacion.imagenesUrls.length > 0 ? (
                                <div style={{ position: "relative" }}>
                                    <img
                                        src={URLS.URL_BASE + publicacion.imagenesUrls[0]}
                                        alt="Publicación"
                                        className="img-fluid rounded-3"
                                        style={{ objectFit: "cover", maxHeight: "400px" }}
                                    />
                                    {publicacion.imagenesUrls.length > 1 && (
                                        <div 
                                            className="position-absolute top-0 end-0 bg-dark text-white px-3 py-2 rounded-3 m-3"
                                            style={{ fontSize: "1rem", zIndex: 2 }}
                                        >
                                            +{publicacion.imagenesUrls.length - 1} más
                                        </div>
                                    )}
                                </div>
                            ) : publicacion.imagenUrl ? (
                                <img
                                    src={URLS.URL_BASE + publicacion.imagenUrl}
                                    alt="Publicación"
                                    className="img-fluid rounded-3"
                                    style={{ objectFit: "cover", maxHeight: "400px" }}
                                />
                            ) : (
                                <div className="d-flex justify-content-center align-items-center bg-secondary text-white"
                                    style={{ height: "300px", borderRadius: "8px" }}>
                                    Sin Imagen
                                </div>
                            )}
                            <h5 className="mt-3">{publicacion.tituloPublicacion}</h5>
                            <p className="text-muted">{publicacion.contenidoPublicacion}</p>
                        </div>
                    ))}
                </Carousel>
            ) : (
                <p className="text-center text-muted">No hay publicaciones disponibles en este momento.</p>
            )}

            {/* Modal para mostrar detalles */}
            <Modal show={showModal} onHide={handleCloseModal} size="xl">
                <Modal.Header closeButton>
                    <Modal.Title>{selectedPublicacion?.tituloPublicacion}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="d-flex flex-column flex-md-row align-items-start">
                        {selectedPublicacion?.imagenUrl && (
                            <img
                                src={URLS.URL_BASE + selectedPublicacion.imagenUrl}
                                alt="Imagen de la publicación"
                                className="img-fluid mb-3 mb-md-0"
                                style={{ maxHeight: "400px", objectFit: "cover", borderRadius: "8px", marginRight: "30px" }}
                            />
                        )}
                        <div className="mt-3" style={{ flex: 1 }}>
                            <h5 className="fw-bold mb-3">{selectedPublicacion?.tituloPublicacion}</h5>
                            <p className="mb-2"><strong>Descripción:</strong> {selectedPublicacion?.contenidoPublicacion}</p>
                            <p className="mb-2"><strong>Área:</strong> {selectedPublicacion?.metros} mt²</p>
                            <p className="mb-2"><strong>Habitaciones:</strong> {selectedPublicacion?.habitaciones}</p>
                            <p className="mb-2"><strong>Baños:</strong> {selectedPublicacion?.banios}</p>
                            <p className={`mb-2 ${selectedPublicacion?.servicios === 1 ? "text-danger" : "text-success"}`}>
                                <strong>Servicios:</strong> {selectedPublicacion?.servicios === 1 ? "Servicios Compartidos" : "Servicios Independientes"}
                            </p>
                            <p className={`mb-2 ${selectedPublicacion?.administracion === 1 ? "text-danger" : "text-success"}`}>
                                <strong>Administración:</strong> {selectedPublicacion?.administracion === 1 ? "Paga Administración" : "No Paga Administración"}
                            </p>
                            <p className={`mb-2 ${selectedPublicacion?.parqueadero === 1 ? "text-success" : "text-danger"}`}>
                                <strong>Parqueadero:</strong> {selectedPublicacion?.parqueadero === 1 ? "Cuenta con Parqueadero" : "No Cuenta con Parqueadero"}
                            </p>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};
