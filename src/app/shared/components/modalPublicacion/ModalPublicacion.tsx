import { Modal } from "react-bootstrap";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Publicacion } from "../../../../models/Publicacion";
import { URLS } from "../../../../utilities/dominios/urls";
import { useEffect } from "react";
import { useTheme } from "@mui/material/styles";


interface ModalPublicacionProps {
  show: boolean;
  handleClose: () => void;
  publicacion: Publicacion | null;
}

export const ModalPublicacion: React.FC<ModalPublicacionProps> = ({
  show,
  handleClose,
  publicacion
}) => {

   //usamos el tema
      const theme = useTheme();
  // Efecto para manejar los metadatos SEO
  useEffect(() => {
    if (show && publicacion) {
      const metaTitle = `${publicacion.tituloPublicacion} - Detalles de la propiedad`;
      const metaDescription = `Propiedad en venta: ${publicacion.contenidoPublicacion}. ${publicacion.habitaciones} habitaciones, ${publicacion.banios} baños, ${publicacion.metros} m²`;
      const imageUrl = `${URLS.URL_BASE}${publicacion.imagenesUrls?.[0] || publicacion.imagenUrl}`;

      // Actualizar el título de la página
      document.title = metaTitle;

      // Actualizar o agregar meta tags dinámicamente
      const updateMetaTag = (name: string, content: string) => {
        let tag = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
        if (!tag) {
          tag = document.createElement('meta');
          tag.name = name;
          document.head.appendChild(tag);
        }
        tag.content = content;
      };


     


      const updateOGTag = (property: string, content: string) => {
        let tag = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
        if (!tag) {
          tag = document.createElement('meta');
          tag.setAttribute('property', property);
          document.head.appendChild(tag);
        }
        tag.content = content;
      };

      updateMetaTag('description', metaDescription);
      updateOGTag('og:title', metaTitle);
      updateOGTag('og:description', metaDescription);
      updateOGTag('og:image', imageUrl);
      updateOGTag('og:type', 'website');
    }

    // Limpieza al desmontar
    return () => {
      document.title = 'Tu título por defecto'; // Restablece el título original
    };
  }, [show, publicacion]);

  return (
    <Modal show={show} onHide={handleClose} size="xl" centered aria-labelledby="property-modal-title"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.64)' }}>
      <Modal.Header closeButton>
        <Modal.Title id="property-modal-title"
          itemProp="name">
          {publicacion?.tituloPublicacion}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body itemScope itemType="https://schema.org/RealEstateListing">
        <div className="row">
          {/* Carrusel de imágenes */}
          <div className="col-12 col-md-6 mb-3 mb-md-0" itemProp="image" itemScope itemType="https://schema.org/ImageObject">
            {publicacion?.imagenesUrls && publicacion.imagenesUrls.length > 0 ? (
              <Carousel
                infiniteLoop
                showArrows
                showThumbs={false}
                dynamicHeight={true}
                aria-label="Galería de imágenes de la propiedad"
              >
                {publicacion.imagenesUrls.map((img, i) => (
                  <div key={i} className="d-flex justify-content-center">
                    <img
                      src={URLS.URL_BASE + img}
                      alt={`Imagen ${i + 1} de la propiedad ${publicacion.tituloPublicacion}`}
                      className="img-fluid"
                      style={{
                        maxHeight: "60vh",
                        maxWidth: "100%",
                        objectFit: "contain",
                        borderRadius: "8px"
                      }}
                      loading="lazy"
                      decoding="async"
                      itemProp="contentUrl"
                    />
                  </div>
                ))}
              </Carousel>
            ) : publicacion?.imagenUrl ? (
              <div className="d-flex justify-content-center">
                <img
                  src={URLS.URL_BASE + publicacion.imagenUrl}
                  alt={`Imagen principal de la propiedad ${publicacion.tituloPublicacion}`}
                  className="img-fluid"
                  style={{
                    maxHeight: "60vh",
                    maxWidth: "100%",
                    objectFit: "contain",
                    borderRadius: "8px"
                  }}
                  loading="lazy"
                  decoding="async"
                  itemProp="contentUrl"
                />
              </div>
            ) : (
              <div className="bg-secondary text-white d-flex align-items-center justify-content-center"
                style={{
                  height: "300px",
                  borderRadius: "8px",
                  width: "100%"
                }}
                aria-hidden="true">
                Sin imagen disponible
              </div>
            )}
          </div>

          {/* Información de la propiedad con microdatos */}
          <div className="col-12 col-md-6" itemProp="description">
            <p>{publicacion?.contenidoPublicacion}</p>
            <p><strong>Área:</strong> <span itemProp="floorSize">{publicacion?.metros} m²</span></p>
            <p><strong>Habitaciones:</strong> <span itemProp="numberOfRooms">{publicacion?.habitaciones}</span></p>
            <p><strong>Baños:</strong> <span itemProp="numberOfBathroomsTotal">{publicacion?.banios}</span></p>
            <p><strong>Servicios:</strong> {publicacion?.servicios === 1 ? "Compartidos" : "Independientes"}</p>

          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};