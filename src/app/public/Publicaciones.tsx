import { jwtDecode } from "jwt-decode";
import { URLS } from "../../utilities/dominios/Urls";
import { ServicioGet } from "../../services/ServicioGet";
import { useEffect, useState } from "react";
import { Publicacion } from "../../models/Publicacion";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { ModalPublicacion } from "../../app/shared/components/modalPublicacion/ModalPublicacion"; // ⬅ Importas tu modal

export const Publicaciones = () => {
    const [arrPubli, setArrPubli] = useState<Publicacion[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedPublicacion, setSelectedPublicacion] = useState<Publicacion | null>(null);

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

    const handleShowModal = (publicacion: Publicacion) => {
        setSelectedPublicacion(publicacion);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedPublicacion(null);
    };

    return (        
        <div className="container mt-5">
            <div className="row gy-4">
                <h3 className="text-center">Todos</h3>
                {arrPubli.length > 0 ? (
                    arrPubli.map((publicacion, index) => (
                        <div className="col-md-4" key={index}>
                            <div 
                                className="card shadow-sm bg-dark-subtle"
                                style={{ cursor: "pointer" }}
                                onClick={() => handleShowModal(publicacion)}
                            >
                                <div className="card-img-top p-3" style={{ height: "200px", overflow: "hidden" }}>
                                    {publicacion.imagenesUrls && publicacion.imagenesUrls.length > 0 ? (
                                        <>
                                            <img
                                                src={URLS.URL_BASE + publicacion.imagenesUrls[0]}
                                                alt="Publicación"
                                                className="img-fluid w-100 h-100 rounded-3"
                                                style={{ objectFit: "cover" }}
                                            />
                                            {publicacion.imagenesUrls.length > 1 && (
                                                <div 
                                                    className="position-absolute top-0 end-0 bg-dark text-white px-2 py-1 rounded-2 m-2"
                                                    style={{ fontSize: "0.8rem", zIndex: 2 }}
                                                >
                                                    +{publicacion.imagenesUrls.length - 1}
                                                </div>
                                            )}
                                        </>
                                    ) : publicacion.imagenUrl ? (
                                        <img
                                            src={URLS.URL_BASE + publicacion.imagenUrl}
                                            alt="Publicación"
                                            className="img-fluid w-100 h-100 rounded-3"
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
                                    <p className="card-text">{publicacion.tipo}</p>
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

            {/* Modal reutilizable */}
            <ModalPublicacion
                show={showModal}
                handleClose={handleCloseModal}
                publicacion={selectedPublicacion}
            />
        </div>
    );
};
