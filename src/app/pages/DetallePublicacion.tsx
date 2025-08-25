import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { URLS } from "../../utilities/dominios/urls";
import { ServicioGet } from "../../services/ServicioGet";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { Fab, Typography, CircularProgress, Container, Box } from "@mui/material";
import { Publicacion } from "../../models/Publicacion";

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
        setPublicacion(data); // guardamos el objeto plano que devuelve el backend
      })
      .catch((err) => {
        console.error("❌ Error cargando la publicación", err);
      })
      .finally(() => setLoading(false));
  }, [codPublicacion]);

  // 🟢 Función para limpiar y formatear el número
  const formatPhoneNumber = (num: string) => {
    if (!num) return "";
    const soloDigitos = num.replace(/\D/g, ""); // quitar todo lo que no sea número
    return soloDigitos.startsWith("57") ? soloDigitos : `57${soloDigitos}`;
  };

  if (loading) return <CircularProgress />;
  if (!publicacion) return <Typography>No se encontró la publicación</Typography>;

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h1" color="text.secondary">
        {publicacion.tituloPublicacion}
      </Typography>

      <Typography variant="body1" paragraph>
        {publicacion.contenidoPublicacion}
      </Typography>

      <Typography
        variant="body2"
        sx={{
          color: (theme) =>
            theme.palette.mode === "light"
              ? theme.palette.common.black
              : theme.palette.common.white,
        }}
      >
        Precio:{" "}
        {new Intl.NumberFormat("es-CO", {
          style: "currency",
          currency: "COP",
          minimumFractionDigits: 0, // sin decimales
        }).format(publicacion.precio)}
      </Typography>

      <Typography variant="body2" color="text.secondary">
        Estrato: {publicacion.estrato} | Parqueadero:{" "}
        {publicacion.parqueadero ? "Sí" : "No"} | Habitaciones:{" "}
        {publicacion.habitaciones} | Baños: {publicacion.banios}
      </Typography>

      {/* 🟢 Botón flotante de WhatsApp con número siempre en formato correcto */}
      {publicacion.contactoWhatsapp && (
        <Fab
          color="success"
          aria-label="whatsapp"
          href={`https://wa.me/${formatPhoneNumber(
            publicacion.contactoWhatsapp
          )}?text=${encodeURIComponent(
            `Hola, estoy interesado en la propiedad "${publicacion.tituloPublicacion}" publicada en Nido`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            position: "fixed",
            bottom: 16,
            right: 16,
            zIndex: 1000,
          }}
        >
          <WhatsAppIcon sx={{ fontSize: 30 }} />
        </Fab>
      )}

      <Typography variant="caption" display="block" sx={{ mt: 1 }}>
        Publicado el{" "}
        {new Date(publicacion.fechaCreacionPublicacion).toLocaleDateString(
          "es-ES",
          { year: "numeric", month: "long", day: "numeric" }
        )}
      </Typography>

      {/* Galería de imágenes */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 3 }}>
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
              boxShadow: 2,
            }}
          />
        ))}
      </Box>
    </Container>
  );
};
