import { RuteoInterno } from "../../../routes/RuteoInteno"
import { Cabecera } from "./Cabecera"
import { MenuLateral } from "./MenuLateral"

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