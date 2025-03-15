import { RuteoInterno } from "../../../routes/RuteoInteno"
import { Publicaciones } from "../../public/Publicaciones"
import { PublicacionListar } from "../publicacion/PublicacionListar"
import { Cabecera } from "./Cabecera"
import { MenuLateral } from "./MenuLateral"
import MenuPublico from "./MenuPublico"

export const TableroVistaPublica = () => {

    return (

        <div>
            <MenuPublico></MenuPublico>
            <div className="pt-16"> {/* Add padding to avoid content being hidden behind the fixed menu */}
           <Publicaciones/>
            </div>


        </div>

    )
}