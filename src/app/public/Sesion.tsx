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
import { Box, Typography, useTheme } from "@mui/material";

export const Sesion = () => {
    /* Inicio: Logica de negocio */
    type formulario = React.FormEvent<HTMLFormElement>;

    /* Acciones e interacciones en el formulario */
    const [enProceso, setEnProceso] = useState<boolean>(false); // Encargada de la validación del formulario

    let { nombreAcceso, claveAcceso, dobleEnlace, objeto } = useFormulario<Acceso>(new Acceso(0, "", ""));
    let navegacion = useNavigate();

    //Tema
    const theme = useTheme();

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
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor:
                    theme.palette.mode === "light"
                        ? theme.palette.grey[100]   // fondo claro
                        : theme.palette.background.default, // fondo oscuro
                transition: "background-color 0.3s ease",
            }}
        >
            <Box
                sx={{
                    maxWidth: 500,
                    width: "100%",
                    p: 4,
                    borderRadius: 3,
                    boxShadow: 3,
                    backgroundColor:
                        theme.palette.mode === "light"
                            ? theme.palette.common.white
                            : theme.palette.background.paper,
                }}
            >
                <Typography
                    variant="h6"
                    component="h1"
                    color="text.primary"
                    align="center"
                    fontWeight="bold"
                >
                    INICIAR SESIÓN
                </Typography>
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
                        ¿No tienes una cuenta? &nbsp;
                        <Link
                            to="/register"
                            style={{ fontSize: "15px", fontWeight: "bold", color: "blue", textDecoration: "underline" }}
                        >
                            Clic Aquí
                        </Link>

                    </span>
                </div>
            </Box>
        </Box>
    );
};