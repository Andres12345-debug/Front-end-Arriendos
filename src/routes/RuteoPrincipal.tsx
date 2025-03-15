import { lazy } from "react"
import { Route, Routes } from "react-router-dom"
import { Sesion } from "../app/public/Sesion"
import { Registro } from "../app/public/Registro";

import { Error } from "../app/shared/Error";
import { TableroPrincipal } from "../app/private/contenedor/TableroPrincipal";
import { Vigilante } from "../app/seguridad/Vigilante";
import { Publicaciones } from "../app/public/Publicaciones";
import { TableroVistaPublica } from "../app/private/contenedor/TableroVistaPublica";



const LazyBienvenida = lazy(()=>import('../app/public/Publicaciones').then(() => ({default:  Publicaciones})));
const LazySesion = lazy(()=>import('../app/public/Sesion').then(() => ({default:Sesion})));
const LazyRegistro = lazy(()=>import('../app/public/Registro').then(() => ({default:Registro})));
const LazyError = lazy(()=>import('../app/shared/Error').then(() => ({default:Error})));
const LazyTablero = lazy(()=>import('../app/private/contenedor/TableroPrincipal').then(() => ({default:TableroPrincipal})));

const LazyTableroVistaPublica = lazy(()=>import('../app/private/contenedor/TableroVistaPublica').then(() => ({default:TableroVistaPublica})));





export const RuteoPrincipal = ()=>{
    return (
        <Routes>
            <Route path="/bienvenidaUsuario" element={<LazyTableroVistaPublica />} />
            <Route path="/login" element={<LazySesion/>}></Route>
            <Route path="/register" element={<LazyRegistro/>}></Route>
            
            <Route element={<Vigilante/>}>
                <Route path="/dash/*" element={<LazyTablero></LazyTablero>}/>                
            </Route>

    
            {/*********OBLIGATORIAS********* */}
            <Route path="/" element={<LazySesion/>}></Route>
            <Route path="*" element={<LazyError/>}></Route>

        </Routes>
    )


    
}