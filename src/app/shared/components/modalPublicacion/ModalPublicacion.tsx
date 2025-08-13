import { Modal } from "react-bootstrap";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Publicacion } from "../../../../models/Publicacion";
import { URLS } from "../../../../utilities/dominios/Urls";



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
  return (
    <Modal show={show} onHide={handleClose} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>{publicacion?.tituloPublicacion}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex flex-column flex-md-row align-items-start">
          {/* Carrusel de imágenes */}
          <div style={{ flex: "0 0 50%", marginRight: "30px" }}>
            {publicacion?.imagenesUrls && publicacion.imagenesUrls.length > 0 ? (
              <Carousel infiniteLoop showArrows showThumbs>
                {publicacion.imagenesUrls.map((img, i) => (
                  <div key={i}>
                    <img
                      src={URLS.URL_BASE + img}
                      alt={`Imagen ${i + 1}`}
                      style={{
                        maxHeight: "400px",
                        objectFit: "contain",
                        borderRadius: "8px"
                      }}
                    />
                  </div>
                ))}
              </Carousel>
            ) : publicacion?.imagenUrl ? (
              <img
                src={URLS.URL_BASE + publicacion.imagenUrl}
                alt="Imagen de la publicación"
                className="img-fluid"
                style={{ maxHeight: "400px", objectFit: "cover", borderRadius: "8px" }}
              />
            ) : (
              <div className="bg-secondary text-white d-flex align-items-center justify-content-center" style={{ height: "300px", borderRadius: "8px" }}>
                Sin imagen
              </div>
            )}
          </div>

          {/* Información */}
          <div className="mt-3" style={{ flex: 1 }}>
            <p><strong>Descripción:</strong> {publicacion?.contenidoPublicacion}</p>
            <p><strong>Área:</strong> {publicacion?.metros} mt²</p>
            <p><strong>Habitaciones:</strong> {publicacion?.habitaciones}</p>
            <p><strong>Baños:</strong> {publicacion?.banios}</p>
            <p><strong>Servicios:</strong> {publicacion?.servicios === 1 ? "Compartidos" : "Independientes"}</p>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};
