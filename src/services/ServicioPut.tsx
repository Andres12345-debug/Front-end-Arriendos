export class ServicioPut {
    public static async peticionPut(urlServicio: string, objActualizar: any): Promise<any> {
        const token = localStorage.getItem("TOKEN_AUTORIZACION") as string;

        // Check if objActualizar contains a file
        const formData = new FormData();
        
        // Add all other fields to FormData
        Object.keys(objActualizar).forEach(key => {
            if (key !== 'imagenFile') {
                formData.append(key, objActualizar[key]);
            }
        });

        // Add file if exists
        if (objActualizar.imagenFile) {
            formData.append('imagen', objActualizar.imagenFile);
        }

        const datosEnviar = {
            method: "PUT",
            headers: {
                "authorization": token
            },
            body: formData
        }

        const respuesta = fetch(urlServicio, datosEnviar)
            .then((res) => {
                return res.json();
            }).then((losDatos) => {
                return losDatos;
            }).catch((elError) => {
                return elError;
            });
        return respuesta;
    }
}