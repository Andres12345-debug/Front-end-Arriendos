import { lazy } from "react";
import { Route, Routes } from "react-router-dom"
import { Bienvenida } from "../app/pages/Bienvenida";
import { Error } from "../app/shared/Error";
import { RolesListar } from "../app/private/roles/RolesListar";
import { RolAdministrar } from "../app/private/roles/RolesAdministrar";
import { RolRegistrar } from "../app/private/roles/RolRegistrar";
import { UsuarioListar } from "../app/private/usuario/UsuarioListar";
import { UsuarioRegistrar } from "../app/private/usuario/UsuarioRegistrar";
import { UsuarioAdministrar } from "../app/private/usuario/UsuarioAdministrar";
import { PublicacionRegistrar } from "../app/private/publicacion/PublicacionRegistrar";
import { PublicacionListar } from "../app/private/publicacion/PublicacionListar";
import { PublicacionAdministrar } from "../app/private/publicacion/PublicacionAdministrar";

const LazyBienvenida = lazy(()=>import('../app/pages/Bienvenida').then(() => ({default:Bienvenida})));
const LazyError = lazy(()=>import('../app/shared/Error').then(() => ({default:Error})));

const LazyRoleListar = lazy(()=>import('../app/private/roles/RolesListar').then(() => ({default:RolesListar})));
const LazyRoleAdministrar = lazy(()=>import('../app/private/roles/RolesAdministrar').then(() => ({default:RolAdministrar})));
const LazyRoleCrear = lazy(()=>import('../app/private/roles/RolRegistrar').then(() => ({default:RolRegistrar})));

const LazyUsuarioListar = lazy(()=>import('../app/private/usuario/UsuarioListar').then(() => ({default: UsuarioListar})));
const LazyUsuarioRegistrar = lazy(()=>import('../app/private/usuario/UsuarioRegistrar').then(()=>({default:UsuarioRegistrar})));
const LazyUsuarioAdmisnitrar = lazy(()=>import('../app/private/usuario/UsuarioAdministrar').then(() => ({default:UsuarioAdministrar})));

const LazyPublicacionesRegistrar = lazy(()=>import('../app/private/publicacion/PublicacionRegistrar').then(()=>({default:PublicacionRegistrar})));
const LazyPublicacionListar = lazy(()=>import('../app/private/publicacion/PublicacionListar').then(() => ({default: PublicacionListar})));
const LazyPublicacionAdmisnitrar = lazy(()=>import('../app/private/publicacion/PublicacionAdministrar').then(() => ({default:PublicacionAdministrar})));


/***RUTAS COMPONENTES PRIVADO******** */


export const RuteoInterno = () => {

    return(
        <Routes>
            
            <Route path="welcome" element={<LazyBienvenida/>}></Route>
            <Route path="/listarRole" element={<LazyRoleListar/>}></Route>
            <Route path="/adminRole" element={<LazyRoleAdministrar/>}></Route>
            <Route path="/addRole" element={<LazyRoleCrear/>}></Route>


            /* Usuario */
            <Route path="/listUser" element = {<LazyUsuarioListar/>} />
            <Route path="/addUser" element = {<LazyUsuarioRegistrar/>}/>
            <Route path="/adminUser" element = {<LazyUsuarioAdmisnitrar/>} />

            /* Publicacion */
            <Route path="/addPublicacion" element = {<LazyPublicacionesRegistrar/>}/>
            <Route path="/listPublicacion" element = {<LazyPublicacionListar/>} />
            <Route path="/adminPublicacion" element = {<LazyPublicacionAdmisnitrar/>} />







            {/****TUTAS OBLIGATORIAS*********** */}
            <Route path="/" element={<LazyBienvenida/>}></Route>
            <Route path="*" element={<LazyError/>}></Route>

            

        </Routes>
    )
}