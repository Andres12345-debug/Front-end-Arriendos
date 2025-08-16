export class ServicioGet {
    public static async peticionGet(urlServicio: string): Promise<any> {
        const token = localStorage.getItem("TOKEN_AUTORIZACION") as string;
        const datosEnviar = {
            method: "GET",
            headers: {
                "Content-Type": "application/json; charset=UTF-8",
                "authorization": token
            }
        }

        try {
            const response = await fetch(urlServicio, datosEnviar);

            // Verificar si la respuesta es exitosa
            if (!response.ok) {
                console.error(`Error HTTP: ${response.status} ${response.statusText}`);
                console.error(`URL que falló: ${urlServicio}`);

                // Si la respuesta no es JSON, intentar leer como texto
                const textResponse = await response.text();
                console.error("Respuesta del servidor:", textResponse);

                throw new Error(`Error del servidor: ${response.status} ${response.statusText}`);
            }

            // Verificar el tipo de contenido
            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                const textResponse = await response.text();
                console.error("El servidor no devolvió JSON. Respuesta:", textResponse);
                throw new Error("El servidor no devolvió JSON válido");
            }

            const losDatos = await response.json();
            return losDatos;
        } catch (error) {
            console.error("Error en petición GET:", error);
            console.error("URL que causó el error:", urlServicio);
            throw error;
        }
    }

    public static async peticionGetPublica(urlServicio: string): Promise<any> {
        const datosEnviar = {
            method: "GET",
            headers: {
                "Content-Type": "application/json; charset=UTF-8"
            }
        };

        try {
            const response = await fetch(urlServicio, datosEnviar);

            // Verificar si la respuesta es exitosa
            if (!response.ok) {
                console.error(`Error HTTP: ${response.status} ${response.statusText}`);
                console.error(`URL que falló: ${urlServicio}`);

                // Si la respuesta no es JSON, intentar leer como texto
                const textResponse = await response.text();
                console.error("Respuesta del servidor:", textResponse);

                throw new Error(`Error del servidor: ${response.status} ${response.statusText}`);
            }

            // Verificar el tipo de contenido
            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                const textResponse = await response.text();
                console.error("El servidor no devolvió JSON. Respuesta:", textResponse);
                throw new Error("El servidor no devolvió JSON válido");
            }

            const losDatos = await response.json();
            return losDatos;
        } catch (error) {
            console.error("Error en petición GET pública:", error);
            console.error("URL que causó el error:", urlServicio);
            throw error;
        }
    }

    // 🏠 Nuevo método para obtener solo casas
    public static async obtenerCasas(urlServicio: string): Promise<any> {
        try {
            const datos = await this.peticionGet(urlServicio);
            return datos.filter((vivienda: any) => vivienda.tipo === "Casa");
        } catch (error) {
            console.error("Error al obtener casas:", error);
            throw error;
        }
    }

    // ServicioGet.ts
    public static async buscarPublicacionesPorTitulo(urlServicio: string, titulo: string): Promise<any[]> {
        const url = urlServicio.replace(':titulo', encodeURIComponent(titulo));
        try {
            const resultado = await this.peticionGetPublica(url);
            return Array.isArray(resultado) ? resultado : [];
        } catch (error) {
            console.error("Error al buscar publicaciones:", error);
            throw error;
        }
    }

}