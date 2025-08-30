import { useState } from "react";
import { InputGroup, Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useFormulario } from "../../utilities/misHoks/useFormulario";
import { RegistroSesion } from "../../models/RegistroSesion";
import { newDate } from "react-datepicker/dist/date_utils";
import jsSHA from "jssha";
import { RegistroService } from "../../services/RegistroService";
import { jwtDecode } from "jwt-decode";
import { DatoSesion } from "../../models/DatoSesion";
import { crearMensaje } from "../../utilities/funciones/mensaje";
import DatePicker from "react-datepicker";
import { Box, Typography, useTheme } from "@mui/material";



export const Registro = () => {
    /*******LOGICA NEGOCIO****************** */
    /* Inicio: logica de negocio */
    const [fecha, setFecha] = useState<Date>(new Date());
    type formulario = React.FormEvent<HTMLFormElement>;

    //Tema
    const theme = useTheme();


    /* Acciones e interacciones en el formulario */
    const [enProceso, setEnProceso] = useState<boolean>(false); // Encargada de la validación del formulario
    const [confirmarClaveAcceso, setConfirmarClaveAcceso] = useState("");

    let { codRol,
        nombreUsuario,
        fechaNacimientoUsuario,
        telefonoUsuario,
        generoUsuario,
        nombreAcceso,
        claveAcceso,
        dobleEnlace,
        objeto } = useFormulario<RegistroSesion>(new RegistroSesion(1, "", new Date, "", 0, "", ""));
    let navegacion = useNavigate();

    const enviarFormulario = async (frm: formulario) => {
        frm.preventDefault();
        setEnProceso(true);
        const objFrm = frm.currentTarget; // Carga la interacción del formulario

        objFrm.classList.add("was-validated"); // Estilos de validación

        // Verificar si el formulario es válido
        if (objFrm.checkValidity() === false) {
            frm.preventDefault();
            frm.stopPropagation();
        } else {
            // Verificar si las contraseñas coinciden
            if (claveAcceso !== confirmarClaveAcceso) {
                crearMensaje("error", "Las contraseñas no coinciden");
                setEnProceso(false);
                return; // Detener la ejecución si las contraseñas no coinciden
            }

            // Cifrar la contraseña
            const cifrado = new jsSHA("SHA-512", "TEXT", { encoding: "UTF8" });
            const claveCifrar = cifrado.update(claveAcceso).getHash("HEX");
            objeto.claveAcceso = claveCifrar;

            try {
                const respuesta = await RegistroService.iniciarSesion(objeto);

                console.log("Respuesta recibida:", respuesta);

                const token = respuesta.response.tokenApp; // Obtener el token de respuesta

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
                crearMensaje("error", "Error al crear la cuenta");
            }


            // Restablecer el estado del formulario y finalizar proceso
            setEnProceso(false);
            limpiarCajas(objFrm);
        }

    };

    const limpiarCajas = (formulario: HTMLFormElement) => {
        formulario.reset();
        objeto.nombreUsuario = "";
        objeto.codRol = 0;
        generoUsuario = 0;
        objeto.nombreAcceso = "";
        objeto.claveAcceso = "";
        formulario.nombreAcceso.value = "";
        formulario.claveAcceso.value = "";
        formulario.classList.remove("was-validated");
    };


    /* Fin: logica de negocio */



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
                    variant="h5"
                    align="center"
                    gutterBottom
                    sx={{ fontWeight: 600 }}
                >
                    CREAR CUENTA
                </Typography>
                <Form className="mt-4" validated={enProceso} onSubmit={enviarFormulario}>
                    <div className="mb-4">
                        <div className="row">
                            <Form.Group
                                controlId="nombreUsuario"
                                className=" col-6 ">
                                <Form.Label>Nombre Usuario</Form.Label>
                                <InputGroup>
                                    <InputGroup.Text>
                                        {/* <FontAwesomeIcon icon={faEnvelope} /> */}
                                    </InputGroup.Text>
                                    <Form.Control
                                        name="nombreUsuario"
                                        value={nombreUsuario}
                                        onChange={dobleEnlace}
                                        required
                                        autoFocus />
                                </InputGroup>
                            </Form.Group>
                            <Form.Group
                                controlId="generoUsuario" className=" col-6 ">
                                <Form.Label>Genero</Form.Label>
                                <InputGroup>
                                    <InputGroup.Text>
                                        <i className="fa fa-female"></i>
                                    </InputGroup.Text>
                                    <Form.Select
                                        name="generoUsuario"
                                        value={generoUsuario}
                                        onChange={dobleEnlace}
                                    >
                                        <option value="1">Selected</option>
                                        <option value="2">Masculino</option>
                                        <option value="3">Femenino</option>
                                    </Form.Select>
                                </InputGroup >
                            </Form.Group>
                        </div>
                    </div>
                    <div className="mb-4">
                        <div className="row">
                            <Form.Group
                                controlId="telefonoUsuario"
                                className=" col-6 ">
                                <Form.Label>Contacto</Form.Label>
                                <InputGroup>
                                    <InputGroup.Text>
                                        {/* <FontAwesomeIcon icon={faEnvelope} /> */}
                                    </InputGroup.Text>
                                    <Form.Control
                                        name="telefonoUsuario"
                                        value={telefonoUsuario}
                                        onChange={dobleEnlace}
                                        required
                                        autoFocus />
                                </InputGroup>
                            </Form.Group>

                            <Form.Group controlId="fechaNacimientoUsuario" className="col-6">
                                <Form.Label>Fecha Nacimiento</Form.Label>
                                <DatePicker
                                    className="form-control"
                                    selected={fechaNacimientoUsuario}
                                    onChange={(valor: any) => { setFecha(valor) }} />
                            </Form.Group>
                        </div>
                    </div>
                    <Form.Group controlId="nombreAcceso" className="mb-4">
                        <Form.Label>Your Email</Form.Label>
                        <InputGroup>
                            <InputGroup.Text>
                                {/* <FontAwesomeIcon icon={faEnvelope} /> */}
                            </InputGroup.Text>
                            <Form.Control
                                type="email"
                                name="nombreAcceso"
                                value={nombreAcceso}
                                onChange={dobleEnlace}
                                required
                                autoFocus />
                        </InputGroup>
                    </Form.Group>
                    <Form.Group controlId="claveAcceso" className="mb-4">
                        <Form.Label>Contraseña</Form.Label>
                        <InputGroup>
                            <InputGroup.Text>
                                {/*    <FontAwesomeIcon icon={faUnlockAlt} /> */}
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
                    <Form.Group controlId="confirmarClaveAcceso" className="mb-4">
                        <Form.Label>Confirmar Contraseña</Form.Label>
                        <InputGroup>
                            <InputGroup.Text>
                                {/* <FontAwesomeIcon icon={faUnlockAlt} /> */}
                            </InputGroup.Text>
                            <Form.Control
                                type="password"
                                name="confirmarClaveAcceso"
                                value={confirmarClaveAcceso}
                                onChange={(e) => setConfirmarClaveAcceso(e.target.value)}
                                required
                            />
                        </InputGroup>
                    </Form.Group>

                    <Button variant="primary" type="submit" className="w-100">
                        REGISTRAR
                    </Button>
                </Form>

                <div className="d-flex justify-content-center align-items-center mt-4">
                    <span className="fw-normal">
                        Ya tiene una cuenta? &nbsp;
                        <Link to="/login" className="fw-bold">Click Aquí</Link>
                    </span>
                </div>

            </Box>
        </Box>
    );


}