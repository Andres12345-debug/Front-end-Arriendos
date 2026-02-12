export const URLS = {
    URL_BASE: "https://visionbot-backend-arriendos.t0y4lz.easypanel.host",
    INICIAR_SESION: "/public/accesos/signin",
    REGISTRO: "/public/registros/user",



    LISTAR_PUBLICACION_PUBLICA: "/public/publicaciones/publico",
    LISTAR_PUBLICACION_POR_TIPO: "/public/publicaciones/tipoCasa/:tipoVivienda",
    LISTAR_PUBLICACION_POR_ID: "/public/publicaciones/one/:codPublicacion",
    LISTAR_PUBLICACION_POR_TITULO: "/public/publicaciones/buscar/:titulo",


    /****SERVICIOS PRIVADOS ************ */
    LISTAR_USUARIOS: "/privado/usuarios/todos",
    CREAR_USUARIO: "/privado/usuarios/agregar",
    ACTUALIZAR_USUARIO: "/privado/usuarios/update",
    ELIMINAR_USUARIO: "/privado/usuarios/delete",
        
    
    /****SERVICIOS PRIVADOS PARA EL PERFIL ************ */
    LISTAR_PERFIL: "/privado/usuarios/perfil",
    ACTUALIZAR_PERFIL: "/privado/usuarios/perfil/actualizar",






    LISTAR_ROLES: "/privado/roles/todos",
    CREAR_ROLES: "/privado/roles/agregar",
    ACTUALIZAR_ROLES: "/privado/roles/update",
    ELIMINAR_ROLES: "/privado/roles/delete",


    LISTAR_PUBLICACION: "/privado/publicaciones/todos",
    LISTAR_PUBLICACION_PRIVADA: "/privado/publicaciones/mis-publicaciones",

    CREAR_PUBLICACION: "/privado/publicaciones/agregar",
    CREAR_PUBLICACION_CON_IMAGENES: "/privado/publicaciones/agregar-con-imagenes",
    ACTUALIZAR_PUBLICACION: "/privado/publicaciones/update",
    ELIMINAR_PUBLICACION: "/privado/publicaciones/delete",

    
}