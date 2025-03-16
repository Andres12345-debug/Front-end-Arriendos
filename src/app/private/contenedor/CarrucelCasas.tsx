import { useEffect, useState } from "react";
import { Carousel } from "react-bootstrap";
import { Publicacion } from "../../../models/Publicacion";
import { URLS } from "../../../utilities/dominios/urls";
import { ServicioGet } from "../../../services/ServicioGet";

const CarrucelCasas = () => {
    const [casas, setCasas] = useState<Publicacion[]>([]);
    const [cargando, setCargando] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [tipoVivienda, setTipoVivienda] = useState<string>("Casa");

    // Obtener publicaciones según el tipo de vivienda seleccionado
    const cargarCasas = async () => {
        setCargando(true);
        setError(null);

        // URL correcta según el backend
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

    // Cargar publicaciones cuando cambia el tipo de vivienda
    useEffect(() => {
        cargarCasas();
    }, [tipoVivienda]);

    return (
        <div className="container mt-4">
            <h3 className="text-center">Viviendas Destacadas</h3>

            {/* Botones para cambiar el tipo de vivienda */}
            <div className="text-center mb-3">
                <button className="btn btn-primary m-2" onClick={() => setTipoVivienda("Casa")}>Casas</button>
                <button className="btn btn-primary m-2" onClick={() => setTipoVivienda("Apartamento")}>Apartamentos</button>
                <button className="btn btn-primary m-2" onClick={() => setTipoVivienda("Finca")}>Fincas</button>
            </div>

            {cargando && <p className="text-center">Cargando...</p>}
            {error && <p className="text-center text-danger">{error}</p>}

            {/* Carrusel con publicaciones */}
            {casas.length > 0 && (
                <Carousel>
                    {casas.map((casa, index) => (
                        <Carousel.Item key={index}>
                            <img
                                className="d-block w-100"
                                src={URLS.URL_BASE + casa.imagenUrl}
                                alt={casa.tituloPublicacion}
                                style={{ height: "400px", objectFit: "cover" }}
                            />
                            <Carousel.Caption>
                                <h5>{casa.tituloPublicacion}</h5>
                                <p>{casa.contenidoPublicacion}</p>
                            </Carousel.Caption>
                        </Carousel.Item>
                    ))}
                </Carousel>
            )}
        </div>
    );
};

export default CarrucelCasas;
