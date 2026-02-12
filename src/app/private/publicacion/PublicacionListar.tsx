import { useEffect, useState } from "react";
import { URLS } from "../../../utilities/dominios/urls";
import { ServicioGet } from "../../../services/ServicioGet";
import { Link } from "react-router-dom";
import { Publicacion } from "../../../models/Publicacion";
import { Modal, Button, Card } from "react-bootstrap";

export const PublicacionListar = () => {
    const [arrPubli, setArrPubli] = useState<Publicacion[]>([]);
    const [arrMisPubli, setArrMisPubli] = useState<Publicacion[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedPublicacion, setSelectedPublicacion] = useState<Publicacion | null>(null);

    const consultar = async () => {
        const urlServicio = URLS.URL_BASE + URLS.LISTAR_PUBLICACION;
        const resultado = await ServicioGet.peticionGet(urlServicio);
        setArrPubli(Array.isArray(resultado) ? resultado : []);
    };

    const consultarMisPublicaciones = async () => {
        const urlServicio = URLS.URL_BASE + URLS.LISTAR_PUBLICACION_PRIVADA;
        const resultado = await ServicioGet.peticionGet(urlServicio);
        setArrMisPubli(Array.isArray(resultado) ? resultado : []);
    };

    useEffect(() => {
        consultar();
        consultarMisPublicaciones();
    }, []);

    const handleShowModal = (publicacion: Publicacion) => {
        setSelectedPublicacion(publicacion);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedPublicacion(null);
    };

    return (
        <>
            {/* --- CARDS DE MIS PUBLICACIONES --- */}
            <div className="mt-5">
                <h4 className="fw-bold text-primary">Mis Publicaciones</h4>
                <div className="row mt-3">
                    {arrMisPubli.length === 0 ? (
                        <p className="text-muted">No tienes publicaciones aún.</p>
                    ) : (
                        arrMisPubli.map((publi, index) => (
                            <div className="col-md-4 mb-4" key={index}>
                                <Card className="shadow-sm h-100">
                                    {publi.imagenesUrls && publi.imagenesUrls.length > 0 && (
                                        <Card.Img
                                            variant="top"
                                            src={URLS.URL_BASE + publi.imagenesUrls[0]}
                                            style={{ height: "200px", objectFit: "cover", cursor: "pointer" }}
                                            onClick={() => handleShowModal(publi)}
                                        />
                                    )}
                                    <Card.Body>
                                        <Card.Title>{publi.tituloPublicacion}</Card.Title>
                                        <Card.Text className="text-truncate">{publi.contenidoPublicacion}</Card.Text>
                                        <small className="text-muted">
                                            {new Date(publi.fechaCreacionPublicacion).toLocaleDateString("es-ES")}
                                        </small>
                                    </Card.Body>
                                </Card>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* --- MODAL PARA IMÁGENES --- */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{selectedPublicacion?.tituloPublicacion}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="d-flex flex-column align-items-center text-center">
                        {selectedPublicacion?.imagenUrl && (
                            <img
                                src={URLS.URL_BASE + selectedPublicacion.imagenUrl}
                                alt="Imagen de la publicación"
                                className="img-fluid mb-3"
                                style={{ maxHeight: "400px", objectFit: "cover", borderRadius: "8px" }}
                            />
                        )}
                        <div className="mt-3">
                            <h5 className="fw-bold">{selectedPublicacion?.tituloPublicacion}</h5>
                            <p>{selectedPublicacion?.contenidoPublicacion}</p>
                            <p>{selectedPublicacion?.metros} mt² de construcción</p>
                            <p>Tiene {selectedPublicacion?.habitaciones} habitaciones</p>
                            <p>Tiene {selectedPublicacion?.banios} baños</p>
                            <p className={selectedPublicacion?.servicios === 1 ? "text-danger" : "text-success"}>
                                {selectedPublicacion?.servicios === 1 ? "Servicios Compartidos" : "Servicios independientes"}
                            </p>
                            <p className={selectedPublicacion?.administracion === 1 ? "text-danger" : "text-success"}>
                                {selectedPublicacion?.administracion === 1 ? "Paga administración" : "No paga administración"}
                            </p>
                            <p className={selectedPublicacion?.parqueadero === 1 ? "text-success" : "text-danger"}>
                                {selectedPublicacion?.parqueadero === 1 ? "Cuenta con parquedero" : "No cuenta con parqueadero"}
                            </p>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
};