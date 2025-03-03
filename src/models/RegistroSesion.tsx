export class RegistroSesion{
    public codRol: number;
    public nombreUsuario: string;
    public fechaNacimientoUsuario: Date;
    public telefonoUsuario: string;
    public generoUsuario: number;
    public nombreAcceso: string;
    public claveAcceso: string;
    
    constructor(cod: number,
          nom: string,
           fec: Date,
           tel: string, 
           gen: number,
           cla: string,
           nomAcc: string
            ) {
        this.codRol = cod;
        this.nombreUsuario = nom;
        this.fechaNacimientoUsuario = fec;
        this.telefonoUsuario = tel;
        this.generoUsuario = gen;
        this.claveAcceso = cla;
        this.nombreAcceso = nomAcc;
      }
    }



