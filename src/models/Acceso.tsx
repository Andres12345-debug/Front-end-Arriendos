export class Acceso{
    public codUsuario: number;
    public nombreAcceso: string;
    public claveAcceso: string;

    constructor(cod: number, nom: string, cla: string) {
        this.codUsuario = cod;
        this.nombreAcceso = nom;
        this.claveAcceso = cla;
    }
}