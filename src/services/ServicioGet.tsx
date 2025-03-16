export class ServicioGet {
    public static async peticionGet(urlServicio: string): Promise<any> {
        const token = localStorage.getItem("TOKEN_AUTORIZACION") as string;
        const datosEnviar = {
            method: "GET",
            headers: {
                "Content-Type": "aplication/json; charset=UTF-8",
                "authorization": token

            }
        }
        const respuesta = fetch(urlServicio, datosEnviar).then((res) => {
            return res.json();
        }).then((losDatos) => {
            return losDatos;
        }).catch((elError) => {
            return elError;
        });
        return respuesta;
    }
    public static async peticionGetPublica(urlServicio: string): Promise<any> {
        const datosEnviar = {
            method: "GET",
            headers: {
                "Content-Type": "application/json; charset=UTF-8"
            }
        };

        const respuesta = fetch(urlServicio, datosEnviar).then((res) => {
            return res.json();
        }).then((losDatos) => {
            return losDatos;
        }).catch((elError) => {
            return elError;
        });
        return respuesta;
    }

    // 🏠 Nuevo método para obtener solo casas
    public static async obtenerCasas(urlServicio: string): Promise<any> {
        return this.peticionGet(urlServicio).then((datos) => {
            return datos.filter((vivienda: any) => vivienda.tipo === "Casa");
        });
    }




}