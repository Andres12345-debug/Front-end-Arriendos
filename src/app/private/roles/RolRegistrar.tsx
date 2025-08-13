import { useEffect, useState } from "react";
import { Role } from "../../../models/Rol";
import { useNavigate } from "react-router-dom";
import { URLS } from "../../../utilities/dominios/urls";
import { ServicioGet } from "../../../services/ServicioGet";
import { crearMensaje } from "../../../utilities/funciones/mensaje";
import { ServicioPost } from "../../../services/ServicioPost";
import { Form } from "react-bootstrap";

export const RolRegistrar = () => {

    const [arrRoles, setArrRoles] = useState<Role[]>([]);
    const [formData, setFormData] = useState<Role>(new Role(0, "", 1)); // Estado por defecto 1 (activo)
    const navigate = useNavigate(); // Hook para redirección

    const consultarRol = async () => {
        const urlServicio = URLS.URL_BASE + URLS.LISTAR_ROLES;
        try {
            const resultado = await ServicioGet.peticionGet(urlServicio);
            setArrRoles(resultado);
        } catch (error) {
            console.error("Error al obtener los roles:", error);
            crearMensaje("error", "Error al cargar los roles.");
        }
    };

    const registrarRol = async (e: React.FormEvent) => {
        e.preventDefault();
        const urlServicio = URLS.URL_BASE + URLS.CREAR_ROLES;
      
        if (!formData.nombreRol.trim()) {
          crearMensaje("error", "El nombre del rol no puede estar vacío.");
          return;
        }
      
        try {
          const resultado = await ServicioPost.peticionPost(urlServicio, formData);
      
          if (resultado.success) {
            crearMensaje("success", resultado.message || "El Rol fue registrado correctamente.");
            navigate("/dash/listRoles");
          } else {
            crearMensaje("error", resultado.message || "Error al registrar el Rol.");
          }
        } catch (error) {
          console.error("Error al registrar el rol:", error);
          crearMensaje("error", "Error de conexión con el servidor.");
        }
      };
      

    useEffect(() => {
        consultarRol();
    }, []);

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-8 offset-md-2">
                    <div className="text-center mb-4">
                        <h2 className="fw-bold text-primary">Registrar Rol</h2>
                        <p className="text-muted">Ingrese la información requerida para registrar un nuevo rol.</p>
                    </div>
                    <Form onSubmit={registrarRol} className="bg-light p-4 rounded shadow">
                        <Form.Group controlId="formNombreRol" className="mb-3">
                            <Form.Label className="fw-bold">Nombre del Rol</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.nombreRol}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        nombreRol: e.target.value.trim(), // Elimina espacios innecesarios
                                    })
                                }
                                placeholder="Ingrese el nombre del rol"
                            />

                        </Form.Group>

                        <Form.Group controlId="formEstadoRol" className="mb-3">
                            <Form.Label className="fw-bold">Estado del Rol</Form.Label>
                            <Form.Select
                                value={formData.estadoRol}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        estadoRol: parseInt(e.target.value),
                                    })
                                }
                            >
                                <option value={1}>Activo</option>
                                <option value={0}>Inactivo</option>
                            </Form.Select>
                        </Form.Group>

                        <div className="text-center mt-4">
                            <button className="btn btn-primary btn-lg" type="submit">
                                Registrar Rol
                            </button>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    );
};
