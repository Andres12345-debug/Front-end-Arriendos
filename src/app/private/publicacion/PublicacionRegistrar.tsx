import { useEffect, useState } from "react";
import { Button, Form, Card, Row, Col } from "react-bootstrap";
import { ServicioPost } from "../../../services/ServicioPost";
import { crearMensaje } from "../../../utilities/funciones/mensaje";
import { Publicacion, TipoPublicacion, TipoVivienda } from "../../../models/Publicacion";
import { URLS } from "../../../utilities/dominios/urls";
import { Usuario } from "../../../models/Usuario";
import { ServicioGet } from "../../../services/ServicioGet";

export const PublicacionRegistrar = () => {
  // Estado inicial del formulario
  const [formData, setFormData] = useState<Publicacion>(() =>
    new Publicacion(0, 1, "", "", "", "", new Date(), 0, 0, 0, 0, "", 0, 0, TipoVivienda.CASA, TipoPublicacion.ARRIENDO, 0, "", 0, "") // Añadir codUsuario por defecto
  );

  // Estado para almacenar los usuarios
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  // Estado para almacenar múltiples archivos de imagen
  const [imagenes, setImagenes] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  // Obtener los usuarios desde el backend
  const obtenerUsuarios = async () => {
    const urlServicio = URLS.URL_BASE + URLS.LISTAR_USUARIOS; 
    try {
      const resultado = await ServicioGet.peticionGet(urlServicio);
      setUsuarios(Array.isArray(resultado) ? resultado : []);
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
      crearMensaje("error", "No se pudo cargar la lista de usuarios.");
    }
  };

  // Ejecutar obtenerUsuarios al cargar el componente
  useEffect(() => {
    obtenerUsuarios();
  }, []);

  // Método para manejar múltiples archivos de imagen
  const manejarImagenes = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const archivosSeleccionados = Array.from(e.target.files);

      // Guardar las imágenes en el estado
      setImagenes((prev) => [...prev, ...archivosSeleccionados]);

      // Generar previews
      const nuevasPreviews = archivosSeleccionados.map((archivo) =>
        URL.createObjectURL(archivo)
      );

      setPreviewImages((prev) => [...prev, ...nuevasPreviews]);
    }
  };


  //Para puntos y comas
  const formatNumber = (value: string) => {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, "."); // agrega puntos
  };

  // Método para eliminar una imagen específica
  const eliminarImagen = (index: number) => {
    const nuevasImagenes = imagenes.filter((_, i) => i !== index);
    const nuevasPreviews = previewImages.filter((_, i) => i !== index);
    setImagenes(nuevasImagenes);
    setPreviewImages(nuevasPreviews);
  };

  // Método para registrar la publicación
  const crearPublicacion = async () => {
    // Validación de campos
    if (
      !formData.tituloPublicacion.trim() ||
      !formData.metros ||
      !formData.habitaciones ||
      !formData.banios ||
      !formData.contenidoPublicacion.trim() ||
      imagenes.length === 0 // Verificamos que haya al menos una imagen
    ) {
      crearMensaje("error", "Por favor, complete todos los campos obligatorios y suba al menos una imagen.");
      return;
    }

    // Crear el objeto FormData
    const formDataToSend = new FormData();
    formDataToSend.append("tituloPublicacion", formData.tituloPublicacion);
    formDataToSend.append("metros", formData.metros);
    formDataToSend.append("habitaciones", formData.habitaciones.toString());
    formDataToSend.append("banios", formData.banios.toString());
    formDataToSend.append("contenidoPublicacion", formData.contenidoPublicacion);

    // Agregar múltiples imágenes
    imagenes.forEach((imagen, index) => {
      formDataToSend.append(`imagenes`, imagen);
    });

    formDataToSend.append("codUsuario", formData.codUsuario.toString());
    formDataToSend.append("fechaCreacionPublicacion", formData.fechaCreacionPublicacion.toISOString());
    formDataToSend.append("parqueadero", formData.parqueadero.toString()); // Añadimos el valor de parqueadero
    formDataToSend.append("estrato", formData.estrato.toString()); // Añadimos el valor de estrato
    formDataToSend.append("tipo", formData.tipo); // Añadir el tipo de vivienda
    formDataToSend.append("servicios", formData.servicios.toString()); // Añadimos el valor de servicios
    formDataToSend.append("administracion", formData.administracion.toString()); // Añadimos el valor de administración

    formDataToSend.append("tipoPublicacion", formData.tipoPublicacion); // Añadir el tipo de publicación
    formDataToSend.append("periodoAlquiler", formData.periodoAlquiler.toString()); // Añadimos el valor de periodoAlquiler
    formDataToSend.append("precio", formData.precio.toString()); // Añadimos el valor de precio
    formDataToSend.append("contactoWhatsapp", formData.contactoWhatsapp.toString());



    // URL del servicio
    const urlServicio = URLS.URL_BASE + URLS.CREAR_PUBLICACION;

    try {
      // Llamamos al servicio para crear la publicación
      const resultado = await ServicioPost.peticionPost(urlServicio, formDataToSend, true); // true para multipart

      // Manejar la respuesta
      if (resultado.success) {
        crearMensaje("success", resultado.message || "Publicación registrada con éxito.");

        // Resetear formulario
        setFormData(new Publicacion(0, 1, "", "", "", "", new Date(), 0, 0, 0, 0, "", 0, 0, TipoVivienda.CASA, TipoPublicacion.ARRIENDO, 0, "", 0, "")); // Reiniciar el formulario
        setImagenes([]); // Limpiar las imágenes
        setPreviewImages([]); // Limpiar las previews
      } else {
        crearMensaje("error", resultado.message || "Error al crear la publicación.");
      }
    } catch (error) {
      console.error("Error en la creación:", error);
      crearMensaje("error", "Error de conexión con el servidor.");
    }
  };

  // Renderización del formulario
  return (
    <div className="m-4">
      <h3 className="text-center mb-4">Formulario de Registro de Publicación</h3>

      <Card className="shadow-sm p-4">
        <Card.Body>
          <Form>
            <Row className="mb-3">


              {/* Tipo de Publicacion */}
              <Col sm={12} md={6}>
                <Form.Group controlId="formTipoPublicacion">
                  <Form.Label>Tipo de Publicación</Form.Label>
                  <Form.Select
                    value={formData.tipoPublicacion}
                    onChange={(e) =>
                      setFormData({ ...formData, tipoPublicacion: e.target.value as TipoPublicacion })
                    }
                  >
                    {Object.values(TipoPublicacion).map((tipoPublicacion) => (
                      <option key={tipoPublicacion} value={tipoPublicacion}>
                        {tipoPublicacion}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>


              {/* Tipo de Vivienda */}
              <Col sm={12} md={6}>
                <Form.Group controlId="formTipoVivienda">
                  <Form.Label>Tipo de Vivienda</Form.Label>
                  <Form.Select
                    value={formData.tipo}
                    onChange={(e) =>
                      setFormData({ ...formData, tipo: e.target.value as TipoVivienda })
                    }
                  >
                    {Object.values(TipoVivienda).map((tipo) => (
                      <option key={tipo} value={tipo}>
                        {tipo}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              {/* Título Publicación */}
              <Col sm={12} md={6}>
                <Form.Group controlId="formTituloPublicacion">
                  <Form.Label>Título Publicación</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.tituloPublicacion}
                    onChange={(e) =>
                      setFormData({ ...formData, tituloPublicacion: e.target.value })
                    }
                    placeholder="Ejemplo: Casa en arriendo – Barrio Altamira, Tunja"
                  />
                </Form.Group>
              </Col>




              {/* Contenido Publicación */}
              <Col sm={12} md={6}>
                <Form.Group controlId="formContenidoPublicacion">
                  <Form.Label>Contenido Publicación</Form.Label>
                  <Form.Control
                    as="textarea"  // Cambiar a textarea para contenido más extenso
                    rows={6}
                    value={formData.contenidoPublicacion}
                    onChange={(e) =>
                      setFormData({ ...formData, contenidoPublicacion: e.target.value })
                    }
                    placeholder="Especifica el contenido de la publicación, por ejemplo: Hermoso apartamento, con excelente vista"
                  />
                </Form.Group>
              </Col>

              {/* Precio */}
              <Col sm={12} md={6}>
                <Form.Group controlId="formPrecio">
                  <Form.Label>Precio</Form.Label>
                  <Form.Control
                    type="text"
                    value={formatNumber(formData.precio.toString())}
                    onChange={(e) => {
                      const rawValue = e.target.value.replace(/\./g, ""); // quitar puntos
                      setFormData({
                        ...formData,
                        precio: rawValue === "" ? 0 : Number(rawValue),
                      });
                    }}
                    placeholder="Ejemplo: 1200000"
                  />
                </Form.Group>
                <Form.Text className="text-muted">
                  Agrega el valor sin puntos ni comas
                </Form.Text>
              </Col>



              {/* Metros de construccion */}
              <Col sm={12} md={6}>
                <Form.Group controlId="formMetros">
                  <Form.Label>Metros de Construccion</Form.Label>
                  <Form.Control
                    type="text"  // Cambiar a textarea para contenido más extenso
                    value={formData.metros}
                    onChange={(e) =>
                      setFormData({ ...formData, metros: e.target.value })
                    }
                    placeholder="Ejemplo: 80"
                  />
                </Form.Group>
                <Form.Text className="text-muted">
                  Agrega los metros solo numéricos
                </Form.Text>
              </Col>

              {/* Estrato */}
              <Col sm={12} md={6}>
                <Form.Group controlId="formEstrato">
                  <Form.Label>Estrato</Form.Label>
                  <Form.Select
                    value={formData.estrato}
                    onChange={(e) =>
                      setFormData({ ...formData, estrato: parseInt(e.target.value) })
                    }
                  >
                    <option value="0">Seleccione el estrato</option>
                    <option value="1">Estrato 1</option>
                    <option value="2">Estrato 2</option>
                    <option value="3">Estrato 3</option>
                    <option value="4">Estrato 4</option>
                    <option value="5">Estrato 5</option>
                    <option value="6">Estrato 6</option>
                    <option value="7">No aplica estrato</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              {/* Administración */}
              <Col sm={12} md={6}>
                <Form.Group controlId="formAdministracion">
                  <Form.Label>Administración</Form.Label>
                  <Form.Select
                    value={formData.administracion}
                    onChange={(e) =>
                      setFormData({ ...formData, administracion: parseInt(e.target.value) })
                    }
                  >
                    <option value="0">Seleccione administración</option>
                    <option value="1">Paga administración</option>
                    <option value="2">No paga administración</option>
                  </Form.Select>
                  <Form.Text className="text-muted">
                    Indica si se debe pagar administración (El precio debe estar incluido en el precio general).
                  </Form.Text>
                </Form.Group>
              </Col>

              {/* Servicios */}
              <Col sm={12} md={6}>
                <Form.Group controlId="formServicios">
                  <Form.Label>Servicios</Form.Label>
                  <Form.Select
                    value={formData.servicios}
                    onChange={(e) =>
                      setFormData({ ...formData, servicios: parseInt(e.target.value) })
                    }
                  >
                    <option value="0">Seleccione los servicios</option>
                    <option value="1">Compartidos</option>
                    <option value="2">Independientes</option>
                  </Form.Select>
                  <Form.Text className="text-muted">
                    Indica si los servicios básicos (agua, luz, gas, etc.) se deben pagar compartidos o independientes.
                  </Form.Text>
                </Form.Group>
              </Col>

              {/* Parqueadero */}
              <Col sm={12} md={6}>
                <Form.Group controlId="formParqueadero">
                  <Form.Label>Cuenta con Parqueadero?</Form.Label>
                  <Form.Select
                    value={formData.parqueadero}
                    onChange={(e) =>
                      setFormData({ ...formData, parqueadero: parseInt(e.target.value) })
                    }
                  >
                    <option value="0">No</option>
                    <option value="1">Sí</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              {/* Habitaciones */}
              <Col sm={12} md={6}>
                <Form.Group controlId="formHabitaciones">
                  <Form.Label>¿Cantidad Habitaciones?</Form.Label>
                  <Form.Select
                    value={formData.habitaciones}
                    onChange={(e) =>
                      setFormData({ ...formData, habitaciones: parseInt(e.target.value) })
                    }
                  >
                    <option value="0">Seleccione</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">Mas de 8</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              {/* Baños */}
              <Col sm={12} md={6}>
                <Form.Group controlId="formBanios">
                  <Form.Label>Baños</Form.Label>
                  <Form.Select
                    value={formData.banios}
                    onChange={(e) =>
                      setFormData({ ...formData, banios: parseInt(e.target.value) })
                    }
                  >
                    <option value="0">Seleccione</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">Mas de 8</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Row className="mb-3">
                <Col sm={12} md={6}>
                  <Form.Group controlId="formRolUsuario">
                    <Form.Label>Usuario</Form.Label>
                    <Form.Control
                      as="select"
                      value={formData.codUsuario}
                      onChange={(e) =>
                        setFormData({ ...formData, codUsuario: parseInt(e.target.value) })
                      }
                    >
                      <option value="0">Seleccione un usuario</option>
                      {usuarios.map((usuario) => (
                        <option key={usuario.codUsuario} value={usuario.codUsuario}>
                          {usuario.nombreUsuario}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                </Col>
              </Row>
              {/* Contacto de WhatsApp */}
              <Col sm={12} md={6}>
                <Form.Group controlId="formContacto">
                  <Form.Label>Contacto WhatsApp</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.contactoWhatsapp}
                    onChange={(e) => {
                      // Limpieza automática: solo números
                      const soloDigitos = e.target.value.replace(/\D/g, "");
                      setFormData({ ...formData, contactoWhatsapp: soloDigitos });
                    }}
                    placeholder="Ej: 3001234567"
                  />
                  <Form.Text className="text-muted">
                    Ingrese solo dígitos (sin espacios, guiones ni +57).
                  </Form.Text>
                </Form.Group>
              </Col>


              {/* Múltiples imágenes */}
              <Col sm={12}>
                <Form.Group controlId="formImagenes">
                  <Form.Label>Imágenes (selecciona múltiples imágenes)</Form.Label>
                  <Form.Control
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={manejarImagenes}
                  />
                  <Form.Text className="text-muted">
                    Puedes seleccionar múltiples imágenes para tu publicación.
                  </Form.Text>
                </Form.Group>


                {/* Vista previa de imágenes */}
                {previewImages.length > 0 && (
                  <div className="mt-3">
                    <Form.Label>Vista previa de imágenes:</Form.Label>
                    <div className="d-flex flex-wrap gap-2">
                      {previewImages.map((preview, index) => (
                        <div key={index} className="position-relative">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            style={{
                              width: "120px",
                              height: "120px",
                              objectFit: "cover",
                              borderRadius: "8px"
                            }}
                          />
                          <button
                            type="button"
                            className="btn btn-danger btn-sm position-absolute top-0 end-0"
                            style={{
                              transform: "translate(50%, -50%)",
                              borderRadius: "50%",
                              width: "25px",
                              height: "25px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              padding: "0"
                            }}
                            onClick={() => eliminarImagen(index)}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Col>

              {/* Fecha de Publicación */}

            </Row>



            {/* Botón de Enviar */}
            <Button variant="primary" onClick={crearPublicacion}>
              Registrar Publicación
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};
