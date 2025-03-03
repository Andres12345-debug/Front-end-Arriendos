export class ServicioPost {
    public static async peticionPost(urlServicio: string, objRegistro: any, isMultipart: boolean = false): Promise<any> {
      const token = localStorage.getItem("TOKEN_AUTORIZACION") as string;
  
      // Construir los encabezados y el cuerpo dependiendo de si es multipart o no
      const headers: any = isMultipart
        ? { authorization: token } // No se incluye Content-Type; el navegador lo gestiona.
        : { "Content-Type": "application/json; charset=UTF-8", authorization: token };
  
      const datosEnviar: RequestInit = {
        method: "POST",
        headers,
        body: isMultipart ? objRegistro : JSON.stringify(objRegistro),
      };
  
      try {
        const res = await fetch(urlServicio, datosEnviar);
        console.log("Estado de la respuesta:", res.status); // Log el estado
  
        if (!res.ok) {
          const errorData = await res.json();
          console.error("Error del servidor:", errorData);
          return { success: false, error: errorData };
        }
        return await res.json();
      } catch (elError) {
        console.error("Error en la solicitud:", elError);
        return { success: false, error: elError };
      }
    }
  }
  