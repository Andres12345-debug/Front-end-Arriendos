import { jwtDecode } from "jwt-decode";
import { URLS } from "../../utilities/dominios/urls";
import { ServicioGet } from "../../services/ServicioGet";
import { useEffect, useState } from "react";
import { Publicacion } from "../../models/Publicacion";




export const Publicaciones = () => {
        // Estado para almacenar las publicaciones
    const [arrPubli, setArrPubli] = useState<Publicacion[]>([]);

    // Consultar publicaciones
    const consultarPublicaciones = async () => {
        const urlServicio = URLS.URL_BASE + URLS.LISTAR_PUBLICACION;
        try {
            const resultado = await ServicioGet.peticionGet(urlServicio);
            setArrPubli(Array.isArray(resultado) ? resultado : []);
        } catch (error) {
            console.error("Error al obtener publicaciones:", error);
        }
    };

    useEffect(() => {
        consultarPublicaciones();
    }, []);

    return (
        <div className="container mt-5">
        

            {/* Publicaciones estilo Instagram */}
            <div className="row gy-4">
                {arrPubli.length > 0 ? (
                    arrPubli.map((publicacion, index) => (
                        <div className="col-md-4" key={index}>
                            <div className="card shadow-sm">
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
                                    <p className="card-text text-muted text-truncate">{publicacion.metros}</p>
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
        </div>
    );
};
