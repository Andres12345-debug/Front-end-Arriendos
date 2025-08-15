export const URLS = {
    URL_BASE: "https://facilitate-results-showers-renaissance.trycloudflare.com",
    INICIAR_SESION: "/public/accesos/signin",
    REGISTRO: "/public/registros/user",
    LISTAR_PUBLICACION_PUBLICA: "/public/publicaciones/publico",
    LISTAR_PUBLICACION_POR_TIPO: "/public/publicaciones/tipoCasa/:tipoVivienda",
    LISTAR_PUBLICACION_POR_ID: "/public/publicaciones/one/:codPublicacion",



    /****SERVICIOS PRIVADOS ************ */
    LISTAR_USUARIOS: "/privado/usuarios/todos",
    CREAR_USUARIO: "/privado/usuarios/agregar",
    ACTUALIZAR_USUARIO: "/privado/usuarios/update",
    ELIMINAR_USUARIO: "/privado/usuarios/delete",
    

    LISTAR_ROLES: "/privado/roles/todos",
    CREAR_ROLES: "/privado/roles/agregar",
    ACTUALIZAR_ROLES: "/privado/roles/update",
    ELIMINAR_ROLES: "/privado/roles/delete",


    LISTAR_PUBLICACION: "/privado/publicaciones/todos",
    CREAR_PUBLICACION: "/privado/publicaciones/agregar",
    CREAR_PUBLICACION_CON_IMAGENES: "/privado/publicaciones/agregar-con-imagenes",
    ACTUALIZAR_PUBLICACION: "/privado/publicaciones/update",
    ELIMINAR_PUBLICACION: "/privado/publicaciones/delete",
}