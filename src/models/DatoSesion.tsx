export class DatoSesion{
    public id: number;
    public nombre: string;
    public rol: string;
    public telefono: string;
    public acceso: string;

    constructor(
        cod: number,
        nom: string,
        role: string,
        tel: string,
        acc: string
    ){
        this.id = cod;
        this.nombre = nom;
        this.rol = role;
        this.telefono = tel;
        this.acceso = acc;
        
    }
    

}