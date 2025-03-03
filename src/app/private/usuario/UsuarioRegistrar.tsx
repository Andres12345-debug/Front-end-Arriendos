import { useState, useEffect } from "react";
import { Button, Form, Card, Row, Col } from "react-bootstrap";
import { ServicioPost } from "../../../services/ServicioPost";
import { ServicioGet } from "../../../services/ServicioGet";
import { crearMensaje } from "../../../utilities/funciones/mensaje";
import { Usuario } from "../../../models/Usuario";
import { Role } from "../../../models/Rol";
import { URLS } from "../../../utilities/dominios/urls";

export const UsuarioRegistrar = () => {
  // Estado del formulario
  const [formData, setFormData] = useState<Usuario>(
    new Usuario(0, "", new Date(), "", 0, 0, "") // Inicialización con valores vacíos
  );

  // Estado para almacenar los roles
  const [roles, setRoles] = useState<Role[]>([]);

  // Obtener los roles desde el backend
  const obtenerRoles = async () => {
    const urlServicio = URLS.URL_BASE + URLS.LISTAR_ROLES;
    try {
      const resultado = await ServicioGet.peticionGet(urlServicio);
      setRoles(Array.isArray(resultado) ? resultado : []);
    } catch (error) {
      console.error("Error al obtener los roles:", error);
      crearMensaje("error", "No se pudo cargar la lista de roles.");
    }
  };

  // Método para registrar usuario
  const crearUsuario = async () => {
    const urlServicio = URLS.URL_BASE + URLS.CREAR_USUARIO;

    if (
      !formData.nombreUsuario ||
      !formData.telefonoUsuario ||
      !formData.fechaNacimientoUsuario ||
      formData.generoUsuario <= 0 ||
      formData.codRol <= 0
    ) {
      crearMensaje("error", "Por favor, complete todos los campos.");
      return;
    }

    try {
      const { codUsuario, ...datosAEnviar } = formData;
      const resultado = await ServicioPost.peticionPost(urlServicio, datosAEnviar);

      if (resultado.success) {
        crearMensaje("success", resultado.message || "Usuario registrado con éxito.");
        setFormData(new Usuario(0, "", new Date(), "", 0, 0, "")); // Resetear el formulario
      } else {
        crearMensaje("error", resultado.message || "Error al registrar el usuario.");
      }
    } catch (error) {
      console.error("Error en la creación:", error);
      crearMensaje("error", "Error de conexión con el servidor.");
    }
  };

  // Ejecutar obtenerRoles al cargar el componente
  useEffect(() => {
    obtenerRoles();
  }, []);

  // Renderización
  return (
    <div className="m-4">
      <h3 className="text-center mb-4">Formulario de Registro de Usuario</h3>

      <Card className="shadow-sm p-4">
        <Card.Body>
          <Form>
            <Row className="mb-3">
              <Col sm={12} md={6}>
                <Form.Group controlId="formNombreUsuario">
                  <Form.Label>Nombre del Usuario</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.nombreUsuario}
                    onChange={(e) =>
                      setFormData({ ...formData, nombreUsuario: e.target.value })
                    }
                    placeholder="Ingresa el nombre completo"
                  />
                </Form.Group>
              </Col>

              <Col sm={12} md={6}>
                <Form.Group controlId="formTelefonoUsuario">
                  <Form.Label>Teléfono</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.telefonoUsuario}
                    onChange={(e) =>
                      setFormData({ ...formData, telefonoUsuario: e.target.value })
                    }
                    placeholder="Ingresa el número de teléfono"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col sm={12} md={6}>
                <Form.Group controlId="formFechaNacimientoUsuario">
                  <Form.Label>Fecha de Nacimiento</Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.fechaNacimientoUsuario
                      .toISOString()
                      .split("T")[0]} // Formatear correctamente
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        fechaNacimientoUsuario: new Date(e.target.value),
                      })
                    }
                  />
                </Form.Group>
              </Col>

              <Col sm={12} md={6}>
                <Form.Group controlId="formGeneroUsuario">
                  <Form.Label>Género</Form.Label>
                  <Form.Control
                    as="select"
                    value={formData.generoUsuario}
                    onChange={(e) =>
                      setFormData({ ...formData, generoUsuario: parseInt(e.target.value) })
                    }
                  >
                    <option value="0">Seleccione un género</option>
                    <option value="1">Masculino</option>
                    <option value="2">Femenino</option>
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col sm={12} md={6}>
                <Form.Group controlId="formRolUsuario">
                  <Form.Label>Rol</Form.Label>
                  <Form.Control
                    as="select"
                    value={formData.codRol}
                    onChange={(e) =>
                      setFormData({ ...formData, codRol: parseInt(e.target.value) })
                    }
                  >
                    <option value="0">Seleccione un rol</option>
                    {roles.map((rol) => (
                      <option key={rol.codRol} value={rol.codRol}>
                        {rol.nombreRol}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>

            <Button variant="primary" onClick={crearUsuario} className="w-100 mt-3">
              Registrar
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};
