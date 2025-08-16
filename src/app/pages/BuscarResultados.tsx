import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { URLS } from "../../utilities/dominios/urls";
import { Publicacion } from "../../models/Publicacion";
import { ServicioGet } from "../../services/ServicioGet";
import { Typography, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

export default function BuscarResultados() {
  const { termino } = useParams<{ termino: string }>();
  const [resultados, setResultados] = useState<Publicacion[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const resultadosRef = useRef<HTMLDivElement>(null);

  const theme = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const buscar = async () => {
      setCargando(true);
      setError(null);
      try {
        const url = `${URLS.URL_BASE}${URLS.LISTAR_PUBLICACION_POR_TITULO.replace(":titulo", termino || "")}`;
        const data = await ServicioGet.peticionGetPublica(url);
        setResultados(Array.isArray(data) ? data : []);
        setTimeout(() => {
          resultadosRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      } catch (err) {
        console.error("Error en búsqueda:", err);
        setError("Hubo un error al cargar las publicaciones.");
      } finally {
        setCargando(false);
      }
    };
    buscar();
  }, [termino]);

  const abrirDetalle = (publicacion: Publicacion) => {
    navigate(`/land/publicacion/${publicacion.codPublicacion}`);
  };

  return (
    <div className="container rounded-5 BackgroundPublico p-5">
      <Box sx={{ display: "flex", justifyContent: "center", flex: 1 }}>
        <Typography
          variant="h6"
          component="h1"
          color="text.primary"
          padding={2}
          sx={{ fontWeight: 600, textAlign: "center" }}
        >
          Resultados de búsqueda para: "{termino}"
        </Typography>
      </Box>

      <div ref={resultadosRef}>
        {cargando && <p className="text-center">Cargando...</p>}
        {error && <p className="text-center text-danger">{error}</p>}

        <div className="row g-2 mt-4">
          {resultados.length > 0 ? (
            resultados.map((publi, index) => (
              <div key={index} className="col-lg-3 col-md-4 col-sm-6 d-flex">
                <div
                  className="card shadow-lg p-3 rounded-4 flex-grow-1 pointer-hover"
                  style={{
                    backgroundColor:
                      theme.palette.mode === "light"
                        ? theme.palette.primary.main
                        : theme.palette.common.white,
                    color:
                      theme.palette.mode === "light"
                        ? theme.palette.common.white
                        : theme.palette.text.primary,
                    cursor: "pointer",
                  }}
                  onClick={() => abrirDetalle(publi)}
                >
                  <div style={{ position: "relative" }}>
                    <LazyLoadImage
                      src={URLS.URL_BASE + (publi.imagenesUrls?.[0] || publi.imagenUrl)}
                      alt={`Vivienda: ${publi.tituloPublicacion}`}
                      className="card-img-top rounded-3"
                      effect="blur"
                      width="100%"
                      height="200px"
                      style={{ objectFit: "cover" }}
                      loading="lazy"
                      placeholderSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 2'%3E%3C/svg%3E"
                    />
                  </div>
                  <div className="card-body">
                    <Typography
                      className="uppercase"
                      sx={{
                        color:
                          theme.palette.mode === "light"
                            ? theme.palette.common.white
                            : theme.palette.common.black,
                      }}
                    >
                      {publi.tituloPublicacion}
                    </Typography>
                    <small
                      style={{
                        color:
                          theme.palette.mode === "light"
                            ? theme.palette.common.white
                            : theme.palette.common.black,
                      }}
                    >
                      Publicado el{" "}
                      {new Date(publi.fechaCreacionPublicacion).toLocaleDateString("es-ES", {
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
            !cargando && <p>No se encontraron publicaciones.</p>
          )}
        </div>
      </div>
    </div>
  );
}
