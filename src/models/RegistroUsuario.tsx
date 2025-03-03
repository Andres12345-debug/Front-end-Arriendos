export class RegistroUsuario{
    public codRol: number;
    public nombreUsuario: string;
    public fechaNacimientoUsuario: Date;
    public telefonoUsuario: string;
    public generoUsuario: number;
    public nombreAcceso: string;
    public claveAcceso: string;

    constructor(co: number,nomU: string,fechn: Date,tel: string, gen: number, na: string,cla: string) {
        this.codRol = co;
        this.nombreUsuario = nomU;
        this.fechaNacimientoUsuario = fechn;
        this.telefonoUsuario = tel;
        this.generoUsuario = gen;
        this.nombreAcceso = na;
        this.claveAcceso = cla;
    }

}