import { lazy } from "react"
import { Route, Routes } from "react-router-dom"
import { Sesion } from "../app/public/Sesion"
import { Registro } from "../app/public/Registro";

import { Error } from "../app/shared/Error";
import { Vigilante } from "../app/seguridad/Vigilante";
import { Publicaciones } from "../app/public/Publicaciones";
import { TableroVistaPublica } from "../app/pages/TableroVistaPublica";
import { TableroPrincipal } from "../app/pages/TableroPrincipal";



const LazyBienvenida = lazy(()=>import('../app/public/Publicaciones').then(() => ({default:  Publicaciones})));
const LazySesion = lazy(()=>import('../app/public/Sesion').then(() => ({default:Sesion})));
const LazyRegistro = lazy(()=>import('../app/public/Registro').then(() => ({default:Registro})));
const LazyError = lazy(()=>import('../app/shared/Error').then(() => ({default:Error})));
const LazyTablero = lazy(()=>import('../app/pages/TableroPrincipal').then(() => ({default:TableroPrincipal})));

const LazyTableroVistaPublica = lazy(()=>import('../app/pages/TableroVistaPublica').then(() => ({default:TableroVistaPublica})));





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