import { useEffect, useState } from "react";
import { Publicacion } from "../../../models/Publicacion";
import { URLS } from "../../../utilities/dominios/urls";
import { ServicioGet } from "../../../services/ServicioGet";
import { ModalPublicacion } from "../../../app/shared/components/modalPublicacion"; // <-- importar modal

// Imágenes
import CasaImg from '../../../assets/img/Iconos/6.png';
import ApartamentoImg from '../../../assets/img/Iconos/5.png';
import FincaImg from '../../../assets/img/Iconos/4.png';
import HabitacionImg from '../../../assets/img/Iconos/7.png';

const Viviendas = () => {
    const [casas, setCasas] = useState<Publicacion[]>([]);
    const [cargando, setCargando] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [tipoVivienda, setTipoVivienda] = useState<string>("Casa");

    // Estado para el modal
    const [modalAbierto, setModalAbierto] = useState(false);
    const [publicacionSeleccionada, setPublicacionSeleccionada] = useState<Publicacion | null>(null);

    const tiposVivienda = [
        { nombre: "Casa", imagen: CasaImg },
        { nombre: "Apartamento", imagen: ApartamentoImg },
        { nombre: "Habitacion", imagen: HabitacionImg },
        { nombre: "Finca", imagen: FincaImg },
    ];

    const consultarPublicaciones = async () => {
        setCargando(true);
        setError(null);

        const urlServicio = `${URLS.URL_BASE}${URLS.LISTAR_PUBLICACION_POR_TIPO.replace(':tipoVivienda', tipoVivienda)}`;

        try {
            const resultado = await ServicioGet.peticionGetPublica(urlServicio);
            setCasas(Array.isArray(resultado) ? resultado : []);
        } catch (error) {
            console.error("Error al obtener publicaciones:", error);
            setError("No se pudieron cargar las viviendas.");
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        consultarPublicaciones();
    }, [tipoVivienda]);

    const abrirModal = (publicacion: Publicacion) => {
        setPublicacionSeleccionada(publicacion);
        setModalAbierto(true);
    };

    return (
        <div className="container mt-4 rounded-5 BackgroundPublico p-5">
            <h2 className="text-center border-bottom pb-2 mt-4">
                Elige el tipo de <span className="naranjaLetras">vivienda</span>
            </h2>

            {/* Selector de tipo */}
            <div className="row g-3">
                {tiposVivienda.map((tipo) => (
                    <div key={tipo.nombre} className="col-lg-3 col-md-4 col-sm-6 d-flex">
                        <div
                            className={`card shadow-sm flex-grow-1 ${tipoVivienda === tipo.nombre ? "border-primary" : ""}`}
                            style={{ cursor: "pointer" }}
                            onClick={() => setTipoVivienda(tipo.nombre)}
                        >
                            <img src={tipo.imagen} alt={tipo.nombre} className="card-img-top p-2" style={{ height: "100px", objectFit: "contain" }} />
                            <div className="card-body text-center">
                                <h6 className="card-title">{tipo.nombre}</h6>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Listado de viviendas */}
            {cargando && <p className="text-center">Cargando...</p>}
            {error && <p className="text-center text-danger">{error}</p>}

            <div className="row g-2 mt-4">
                {casas.map((casa, index) => (
                    <div key={index} className="col-lg-3 col-md-4 col-sm-6 d-flex">
                        <div
                            className="card shadow-lg p-3 bg-dark-subtle rounded-4 flex-grow-1"
                            style={{ cursor: "pointer", transition: "all 0.3s ease-in-out" }}
                            onClick={() => abrirModal(casa)} // <- abre el modal con esa publicación
                        >
                            <div style={{ position: "relative" }}>
                                <img
                                    src={URLS.URL_BASE + (casa.imagenesUrls?.[0] || casa.imagenUrl)}
                                    alt={casa.tituloPublicacion}
                                    className="card-img-top rounded-3"
                                    style={{ height: "200px", objectFit: "cover" }}
                                />
                            </div>
                            <div className="card-body">
                                <h5 className="card-title">{casa.tituloPublicacion}</h5>
                                <small className="text-muted">
                                    Publicado el{" "}
                                    {new Date(casa.fechaCreacionPublicacion).toLocaleDateString("es-ES", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </small>
                                <p className="card-text naranjaLetrasMasOscuras">{casa.tipo}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            <ModalPublicacion
                show={modalAbierto}
                handleClose={() => setModalAbierto(false)}
                publicacion={publicacionSeleccionada}
            />
        </div>
    );
};

export default Viviendas;
