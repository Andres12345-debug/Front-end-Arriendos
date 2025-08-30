import { URLS } from "../utilities/dominios/urls";

export class ServicioPutUsuario {
    public static async actualizarUsuario(codUsuario: number, objActualizar: any): Promise<any> {
        const url = `${URLS.URL_BASE}${URLS.ACTUALIZAR_USUARIO}/${codUsuario}`;
        return this.peticionPutJson(url, objActualizar);
    }
    
    public static async actualizarPerfil(objActualizar: any): Promise<any> {
        const url = `${URLS.URL_BASE}${URLS.ACTUALIZAR_PERFIL}`;
        return this.peticionPutJson(url, objActualizar);
    }
    
    private static async peticionPutJson(url: string, data: any): Promise<any> {
        const token = localStorage.getItem("TOKEN_AUTORIZACION") as string;
        
        const datosEnviar = {
            method: "PUT",
            headers: {
                "Authorization": token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        };

        try {
            const response = await fetch(url, datosEnviar);
            
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error("Error en petición PUT:", error);
            throw error; // Re-lanzar el error para manejarlo en el componente
        }
    }
}