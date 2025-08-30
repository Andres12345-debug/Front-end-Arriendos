import { URLS } from "../utilities/dominios/urls";

// En ServicioPut.tsx
export class ServicioPutRoles {
    // ... tu método existente para FormData ...

    // 👉 Nuevo método específico para JSON (roles, usuarios sin imágenes)
    public static async peticionPutJson(urlServicio: string, objActualizar: any): Promise<any> {
        const token = localStorage.getItem("TOKEN_AUTORIZACION") as string;

        const datosEnviar = {
            method: "PUT",
            headers: {
                "authorization": token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(objActualizar)
        }

        return fetch(urlServicio, datosEnviar)
            .then((res) => res.json())
            .then((losDatos) => losDatos)
            .catch((elError) => elError);
    }

    // 👉 Método específico para actualizar roles
    public static async putRol(codRol: number, objActualizar: any): Promise<any> {
        const urlServicio = `${URLS.URL_BASE}${URLS.ACTUALIZAR_ROLES}/${codRol}`;
        return this.peticionPutJson(urlServicio, objActualizar);
    }
}