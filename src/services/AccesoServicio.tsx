import { Acceso } from "../models/Acceso";
import { URLS } from "../utilities/dominios/urls";

export class AccesoService {
    public static async iniciarSesion(objAcceso: Acceso): Promise<any> {
        const datosEnviar = {
            method: "POST",
            body: JSON.stringify(objAcceso),
            headers: { "Content-Type": "application/json; charset=UTF-8" }
        };

        const urlEnviar = URLS.URL_BASE + URLS.INICIAR_SESION;
        const respuesta = await fetch(urlEnviar, datosEnviar);

        if (!respuesta.ok) {
            const errorData = await respuesta.json();
            throw new Error(errorData.message || "Error en la autenticación");
        }

        return respuesta.json();
    }
}