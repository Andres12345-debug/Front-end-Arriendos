import { useEffect, useState } from "react";
import { Publicacion } from "../../../models/Publicacion";
import { URLS } from "../../../utilities/dominios/urls";
import { ServicioGet } from "../../../services/ServicioGet";

// Importamos las imágenes PNG
import CasaImg from '../../../assets/img/Iconos/6.png';
import ApartamentoImg from '../../../assets/img/Iconos/5.png';
import FincaImg from '../../../assets/img/Iconos/4.png';
import HabitacionImg from '../../../assets/img/Iconos/7.png';


const Viviendas = () => {
    const [casas, setCasas] = useState<Publicacion[]>([]);
    const [cargando, setCargando] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [tipoVivienda, setTipoVivienda] = useState<string>("Casa");

    // Opciones de tipo de vivienda con imágenes PNG
    const tiposVivienda = [
        { nombre: "Casa", imagen: CasaImg },
        { nombre: "Apartamento", imagen: ApartamentoImg },
        { nombre: "Habitacion", imagen: HabitacionImg },
        { nombre: "Finca", imagen: FincaImg },
    ];

    const cargarCasas = async () => {
        setCargando(true);
        setError(null);

        const urlServicio = `${URLS.URL_BASE}/public/publicaciones/tipoCasa/${tipoVivienda}`;
        try {
            const resultado = await ServicioGet.peticionGetPublica(urlServicio);
            setCasas(Array.isArray(resultado) ? resultado : []);
        } catch (error) {
            console.error("Error al obtener las viviendas:", error);
            setError("No se pudieron cargar las viviendas.");
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarCasas();
    }, [tipoVivienda]);

    return (
        <div className="container mt-4 rounded-5 BackgroundPublico p-5">
            {/* Título */}
            <h2 className="text-center border-bottom pb-2 mt-4">
                Elige el tipo de <span className="naranjaLetras">vivienda</span>
            </h2>

            {/* Cards de selección de tipo de vivienda */}
            <div className="row g-3">
                {tiposVivienda.map((tipo) => (
                    <div key={tipo.nombre} className="col-lg-3 col-md-4 col-sm-6 d-flex">
                        <div
                            onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(80%)")}
                            onMouseLeave={(e) => (e.currentTarget.style.filter = "brightness(100%)")}
                            className={`card shadow-sm flex-grow-1 ${tipoVivienda === tipo.nombre ? "border-primary" : ""}`}
                            style={{ cursor: "pointer" }}
                            onClick={() => setTipoVivienda(tipo.nombre)}
                        >
                            <img
                                src={tipo.imagen}
                                alt={tipo.nombre}
                                className="card-img-top p-2"
                                style={{ height: "100px", objectFit: "contain" }}
                            />
                            <div className="card-body text-center">
                                <h6 className="card-title">{tipo.nombre}</h6>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Contenido de las viviendas */}
            {cargando && <p className="text-center">Cargando...</p>}
            {error && <p className="text-center text-danger">{error}</p>}

            {/* Listado de viviendas como cards */}
            <div className="row g-2 mt-4">
                {casas.map((casa, index) => (
                    <div key={index} className="col-lg-3 col-md-4 col-sm-6 d-flex">
                        <div className="card shadow-lg p-3 bg-dark-subtle rounded-4 flex-grow-1"
                            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
                            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                            style={{ cursor: "pointer", transition: "all 0.3s ease-in-out" }}>

                            <img
                                src={URLS.URL_BASE + casa.imagenUrl}
                                alt={casa.tituloPublicacion}
                                className="card-img-top rounded-3"
                                style={{ height: "200px", objectFit: "cover" }}
                            />
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

        </div>

    );
};

export default Viviendas;