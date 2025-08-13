import { RuteoInterno } from "../../routes/RuteoInterno"
import { Cabecera } from "../private/contenedor/layout/Cabecera"
import { MenuLateral } from "../private/contenedor/layout/MenuLateral"


export const TableroPrincipal = () =>{

    return(
        
        <div>
            <MenuLateral></MenuLateral>
            <main className="content">
                <Cabecera></Cabecera>
                <div className="m-2">
                <RuteoInterno></RuteoInterno>
                </div>
            </main>

        </div>

    )
}