import React, { useState } from "react";
import { InputGroup, Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { Acceso } from "../../models/Acceso";
import jsSHA from "jssha";
import { DatoSesion } from "../../models/DatoSesion";
import { crearMensaje } from "../../utilities/funciones/mensaje";
import { AccesoService } from "../../services/AccesoServicio";
import { useFormulario } from "../../utilities/misHoks/useFormulario";
import { jwtDecode } from "jwt-decode";

export const Sesion = () => {
    /* Inicio: Logica de negocio */
    type formulario = React.FormEvent<HTMLFormElement>;

    /* Acciones e interacciones en el formulario */
    const [enProceso, setEnProceso] = useState<boolean>(false); // Encargada de la validación del formulario

    let { nombreAcceso, claveAcceso, dobleEnlace, objeto } = useFormulario<Acceso>(new Acceso(0, "", ""));
    let navegacion = useNavigate();

    const enviarFormulario = async (frm: formulario) => {
        frm.preventDefault();
        setEnProceso(true);
        const objFrm = frm.currentTarget; // Carga la interacción del formulario
    
        objFrm.classList.add("was-validated"); // Estilos de validación
    
        if (objFrm.checkValidity() === false) {
            frm.preventDefault();
            frm.stopPropagation();
        } else {
            const cifrado = new jsSHA("SHA-512", "TEXT", { encoding: "UTF8" });
            const claveCifrar = cifrado.update(claveAcceso).getHash("HEX");
            objeto.claveAcceso = claveCifrar;
    
            try {
                const respuesta = await AccesoService.iniciarSesion(objeto);
    
                console.log("Respuesta recibida:", respuesta);
    
                // Acceder al token directamente desde la respuesta
                const token = respuesta.tokenApp; // Cambio aquí
    
                if (token) {
                    console.log("Token recibido:", token);
    
                    const objRecibido: any = jwtDecode(token);
                    const datosUsuario = new DatoSesion(
                        objRecibido.id,
                        objRecibido.nombre,
                        objRecibido.rol,
                        objRecibido.telefono,
                        objRecibido.acceso
                    );
    
                    crearMensaje("success", "Bienvenido " + datosUsuario.nombre);
    
                    localStorage.setItem("TOKEN_AUTORIZACION", token);
    
                    navegacion('/dash');
                } else {
                    // Si no se recibe token, gestionar según el código de estado
                    switch (respuesta.status) {
                        case 400:
                            crearMensaje("error", "Error: el usuario no existe");
                            break;
                        case 406:
                            crearMensaje("error", "Error: contraseña inválida");
                            break;
                        default:
                            crearMensaje("error", "Fallo en la autenticación");
                            break;
                    }
                }
            } catch (error) {
                console.error("Error durante la autenticación:", error);
                crearMensaje("error", "Error al iniciar sesión");
            }
    
            // Restablecer el estado del formulario y finalizar proceso
            setEnProceso(false);
            limpiarCajas(objFrm);
        }
    };
    

    const limpiarCajas = (formulario: HTMLFormElement) => {
        formulario.reset();
        objeto.nombreAcceso = "";
        objeto.claveAcceso = "";

        formulario.nombreAcceso.value = "";
        formulario.claveAcceso.value = "";
        formulario.classList.remove("was-validated");
    };

    /* Fin: Logica de negocio */

    return (
        <section className="vh-lg-100 mt-5 mt-lg-0 bg-soft d-flex align-items-center">
            <div className="container-fluid">
                <div className="row justify-content-center form-bg-image" data-background-lg="../../assets/img/illustrations/signin.svg">
                    <div className="col-12 d-flex align-items-center justify-content-center">
                        <div className="bg-white shadow border-0 rounded border-light p-4 p-lg-5 w-100 fmxw-500">
                            <div className="text-center text-md-center mb-4 mt-md-0">
                                <h1 className="mb-0 h3 fs-4 fst-italic">SISTEMA DE INFORMACION </h1>
                            </div>
                            <Form className="mt-4" validated={enProceso} onSubmit={enviarFormulario}>
                                <Form.Group controlId="nombreAcceso" className="mb-4">
                                    <Form.Label>
                                        <span className="rojito fs-4"></span> &nbsp; Correo Electronico
                                    </Form.Label>
                                    <InputGroup>
                                        <InputGroup.Text>
                                            <i className='fa fa-envelope'></i>
                                        </InputGroup.Text>
                                        <Form.Control
                                            type="email"
                                            name="nombreAcceso"
                                            value={nombreAcceso}
                                            onChange={dobleEnlace}
                                            required
                                            autoFocus
                                        />
                                    </InputGroup>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Group controlId="claveAcceso" className="mb-4">
                                        <Form.Label>
                                            <span className="rojito fs-4"></span> &nbsp; Contraseña
                                        </Form.Label>
                                        <InputGroup>
                                            <InputGroup.Text>
                                                <i className='fa fa-key'></i>
                                            </InputGroup.Text>
                                            <Form.Control
                                                type="password"
                                                name="claveAcceso"
                                                value={claveAcceso}
                                                onChange={dobleEnlace}
                                                required
                                            />
                                        </InputGroup>
                                    </Form.Group>
                                </Form.Group>
                                <Button variant="primary" type="submit" className="w-100">
                                    Acceder
                                </Button>
                            </Form>
                            <div className="d-flex justify-content-center align-items-center mt-4">
                                <span className="fw-normal">
                                    No tienes una cuenta perrit@? &nbsp;
                                    <Link to="/register" className="fw-bold text-primary">Clic Aqui</Link>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};