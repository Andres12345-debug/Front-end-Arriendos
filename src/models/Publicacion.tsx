export class Publicacion{
    public codPublicacion : number;
    public codUsuario: number;
    public tituloPublicacion: string;
    public contenidoPublicacion: string;
    public imagenUrl: string;
    public fechaCreacionPublicacion: Date;
    public parqueadero: number;
    public estrato: number;
    public servicios: number;
    public administracion: number;
    public metros: string;
    public habitaciones: number;
    public banios: number;


    constructor(
        codP: number,
        codUsu: number,
        tit: string,
        subTitu: string,
        conte: string,
        img: string,
        fec: Date,
        par: number,
        est: number,
        ser: number,
        admi: number,
        met: string,
        habi: number,
        bani: number


            ) {
        this.codPublicacion = codP;
        this.codUsuario = codUsu;  // Usar el parámetro codUsu
        this.tituloPublicacion = tit;
        this.contenidoPublicacion = conte;
        this.imagenUrl = img;
        this.fechaCreacionPublicacion = fec;
        this.parqueadero = par;
        this.estrato = est;
        this.servicios = ser;
        this.administracion = admi;
        this.metros = met;
        this.habitaciones = habi;
        this.banios = bani;

      }
    }



