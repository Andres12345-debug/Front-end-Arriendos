import { URLS } from "../utilities/dominios/urls";

export class ServicioPut {
    public static async peticionPut(urlServicio: string, objActualizar: any): Promise<any> {
        const token = localStorage.getItem("TOKEN_AUTORIZACION") as string;

        const formData = new FormData();

        Object.keys(objActualizar).forEach(key => {
            if (key !== 'imagenFile' && key !== 'imagenesFiles') {
                formData.append(key, objActualizar[key]);
            }
        });

        // Archivo único
        if (objActualizar.imagenFile) {
            formData.append('imagen', objActualizar.imagenFile);
        }

        // Múltiples archivos
        if (objActualizar.imagenesFiles && Array.isArray(objActualizar.imagenesFiles)) {
            objActualizar.imagenesFiles.forEach((file: File) => {
                formData.append('imagenes', file);
            });
        }

        const datosEnviar = {
            method: "PUT",
            headers: {
                "authorization": token
            },
            body: formData
        }

        return fetch(urlServicio, datosEnviar)
            .then((res) => res.json())
            .then((losDatos) => losDatos)
            .catch((elError) => elError);
    }

    // 👉 Método propio para actualizar publicaciones
    public static async putPublicacion(codPublicacion: number, objActualizar: any): Promise<any> {
        const urlServicio = `${URLS.URL_BASE}${URLS.ACTUALIZAR_PUBLICACION}/${codPublicacion}`;
        return this.peticionPut(urlServicio, objActualizar);
    }
}
