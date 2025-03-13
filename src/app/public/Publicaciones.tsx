import { jwtDecode } from "jwt-decode";
import { URLS } from "../../utilities/dominios/urls";
import { ServicioGet } from "../../services/ServicioGet";
import { useEffect, useState } from "react";
import { Publicacion } from "../../models/Publicacion";
import { Modal } from "react-bootstrap";




export const Publicaciones = () => {
    // Estado para almacenar las publicaciones
    const [arrPubli, setArrPubli] = useState<Publicacion[]>([]);

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

    // Estado para mostrar el modal
    const [showModal, setShowModal] = useState(false);
    const [selectedPublicacion, setSelectedPublicacion] = useState<Publicacion | null>(null);


    // Función para abrir el modal con los detalles de la publicación seleccionada
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
            {/* Publicaciones estilo Instagram */}
            <div className="row gy-4">
                {arrPubli.length > 0 ? (
                    arrPubli.map((publicacion, index) => (
                        <div className="col-md-4" key={index}>
                            <div className="card shadow-sm" onClick={() => handleShowModal(publicacion)}
                                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}                                 >
                                <div className="card-img-top" style={{ height: "200px", overflow: "hidden" }}>
                                    {publicacion.imagenUrl ? (
                                        <img
                                            src={URLS.URL_BASE + publicacion.imagenUrl}
                                            alt="Publicación"
                                            className="img-fluid w-100 h-100"
                                            style={{ objectFit: "cover" }}
                                        />
                                    ) : (
                                        <div className="d-flex justify-content-center align-items-center h-100 bg-secondary text-white">
                                            Sin Imagen
                                        </div>
                                    )}
                                </div>
                                <div className="card-body">
                                    <h5 className="card-title text-truncate">{publicacion.tituloPublicacion}</h5>
                                    <p className="card-text">{publicacion.contenidoPublicacion}</p>
                                    <small className="text-muted">
                                        Publicado el{" "}
                                        {new Date(publicacion.fechaCreacionPublicacion).toLocaleDateString("es-ES", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </small>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-12 text-center">
                        <p className="text-muted">No hay publicaciones disponibles en este momento.</p>
                    </div>
                )}
            </div>
            {/* Modal para mostrar los detalles de la publicación */}
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
                            <p className="mb-2"><strong>Área:</strong> {selectedPublicacion?.metros} mt² de construcción</p>
                            <p className="mb-2"><strong>Habitaciones:</strong> Tiene {selectedPublicacion?.habitaciones} habitaciones</p>
                            <p className="mb-2"><strong>Baños:</strong> Tiene {selectedPublicacion?.banios} baños</p>
                            <p className={`mb-2 ${selectedPublicacion?.servicios === 1 ? "text-danger" : "text-success"}`}>
                                <strong>Servicios:</strong> {selectedPublicacion?.servicios === 1 ? "Servicios Compartidos" : "Servicios independientes"}
                            </p>
                            <p className={`mb-2 ${selectedPublicacion?.administracion === 1 ? "text-danger" : "text-success"}`}>
                                <strong>Administración:</strong> {selectedPublicacion?.administracion === 1 ? "Paga administración" : "No paga administración"}
                            </p>
                            <p className={`mb-2 ${selectedPublicacion?.parqueadero === 1 ? "text-success" : "text-danger"}`}>
                                <strong>Parqueadero:</strong> {selectedPublicacion?.parqueadero === 1 ? "Cuenta con parquedero" : "No cuenta con parqueadero"}
                            </p>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};
