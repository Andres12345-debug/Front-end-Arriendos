import { RuteoInterno } from "../../../routes/RuteoInteno"
import { Publicaciones } from "../../public/Publicaciones"
import { PublicacionListar } from "../publicacion/PublicacionListar"
import { Cabecera } from "./Cabecera"
import { Carroucel } from "./Carruoucel"
import { FooterPublico } from "./FooterPublico"
import { MenuLateral } from "./MenuLateral"
import MenuPublico from "./MenuPublico"
import CarruselCasas from "./CarrucelCasas";



export const TableroVistaPublica = () => {

    return (

        <div>
            <MenuPublico></MenuPublico> {/* Llamado al componente */}     
            <div className="pt-16">
            <CarruselCasas />
            </div>       
            <div className="pt-16"> {/* Add padding to avoid content being hidden behind the fixed menu */}
                <Publicaciones /> {/* Llamado al componente */}
            </div>            
            <div className="pt-16">
                <FooterPublico />{/* Llamado al componente */}
            </div>


        </div>

    )
}