import { Acceso } from "../models/Acceso";
import { RegistroSesion } from "../models/RegistroSesion";
import { URLS } from "../utilities/dominios/urls";

export class RegistroService {
    public static async iniciarSesion(objAcceso: RegistroSesion): Promise<any> {
        const datosEnviar = {
            method: "POST",
            body: JSON.stringify(objAcceso),
            headers: { "Content-Type": "application/json; charset=UTF-8" }
        };

        const urlEnviar = URLS.URL_BASE + URLS.REGISTRO;
        const respuesta = await fetch(urlEnviar, datosEnviar);

        if (!respuesta.ok) {
            const errorData = await respuesta.json();
            throw new Error(errorData.message || "Error en la autenticación");
        }

        return respuesta.json();
    }
}