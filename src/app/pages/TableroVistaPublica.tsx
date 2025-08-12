import { RuteoInterno } from "../../routes/RuteoInteno"
import { Publicaciones } from "../public/Publicaciones"
import { PublicacionListar } from "../private/publicacion/PublicacionListar"
import { Cabecera } from "../private/contenedor/layout/Cabecera"
import { FooterPublico } from "../private/contenedor/layout/FooterPublico"
import { MenuLateral } from "../private/contenedor/layout/MenuLateral"
import MenuPublico from "../private/contenedor/layout/MenuPublico"
import CarruselCasas from "../private/contenedor/widgets/CarrucelCasas";



export const TableroVistaPublica = () => {

    return (

        <div>
            <MenuPublico></MenuPublico> {/* Llamado al componente */}     
            <div className="pt-16">
            <CarruselCasas />
            </div>       
            <div className="pt-16"> {/* Add padding to avoid content being hidden behind the fixed menu */}
               {/*   } <Publicaciones /> {/* Llamado al componente */}
            </div>            
            <div className="pt-16">
                <FooterPublico />{/* Llamado al componente */}
            </div>


        </div>

    )
}