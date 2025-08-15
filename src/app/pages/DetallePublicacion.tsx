import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { URLS } from "../../utilities/dominios/urls";
import { ServicioGet } from "../../services/ServicioGet";
import {
  Typography,
  CircularProgress,
  Container,
  Box
} from "@mui/material";
import { Publicacion } from "../../models/Publicacion";
import { Padding } from "@mui/icons-material";

export const DetallePublicacion = () => {
  const { codPublicacion } = useParams<{ codPublicacion: string }>();
  const [publicacion, setPublicacion] = useState<Publicacion | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!codPublicacion) return;

    const url = `${URLS.URL_BASE}${URLS.LISTAR_PUBLICACION_POR_ID.replace(
      ":codPublicacion",
      encodeURIComponent(codPublicacion)
    )}`;

    console.log("🔍 Fetching:", url);

    ServicioGet.peticionGetPublica(url)
      .then((data) => {
        console.log("✅ Respuesta API:", data);
        setPublicacion(data); // guardamos el objeto plano que devuelve el backend
      })
      .catch((err) => {
        console.error("❌ Error cargando la publicación", err);
      })
      .finally(() => setLoading(false));
  }, [codPublicacion]);

  if (loading) return <CircularProgress />;
  if (!publicacion) return <Typography>No se encontró la publicación</Typography>;

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h1"
      color="text.secondary">
        {publicacion.tituloPublicacion}
      </Typography>
      <Typography variant="body1" paragraph>
        {publicacion.contenidoPublicacion}
      </Typography>

      <Typography variant="body2" color="text.secondary">
        Estrato: {publicacion.estrato} | Parqueadero:{" "}
        {publicacion.parqueadero ? "Sí" : "No"} | Habitaciones:{" "}
        {publicacion.habitaciones} | Baños: {publicacion.banios}
      </Typography>

      <Typography variant="caption" display="block" sx={{ mt: 1 }}>
        Publicado el{" "}
        {new Date(publicacion.fechaCreacionPublicacion).toLocaleDateString(
          "es-ES",
          { year: "numeric", month: "long", day: "numeric" }
        )}
      </Typography>

      {/* Galería de imágenes */}
      <Box
      sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 3 }}>
        {publicacion.imagenesUrls?.map((url, idx) => (
          <Box          
      className="pointer-hover"
            key={idx}
            component="img"
            src={`${URLS.URL_BASE}${url}`}
            alt={`Imagen ${idx + 1}`}
            sx={{
              maxWidth: "300px",
              borderRadius: 2,
              boxShadow: 2
            }}
          />
        ))}
      </Box>
    </Container>
  );
};
