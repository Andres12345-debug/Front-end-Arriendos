export enum TipoVivienda {
  CASA = 'Casa',
  APARTAMENTO = 'Apartamento',
  FINCA = 'Finca',
  HABITACION = 'Habitacion',

}
export class Publicacion {
  public codPublicacion: number;
  public codUsuario: number;
  public tituloPublicacion: string;
  public contenidoPublicacion: string;
  public imagenUrl: string;
  public imagenesUrls: string[]; // ✅ Array para múltiples imágenes
  public fechaCreacionPublicacion: Date;
  public parqueadero: number;
  public estrato: number;
  public servicios: number;
  public administracion: number;
  public metros: string;
  public habitaciones: number;
  public banios: number;
  public tipo: TipoVivienda; // ✅ Agregado el enum aquí

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
    bani: number,
    tipo: TipoVivienda, // ✅ Se agrega el parámetro en el constructor
    imagenes: string[] = [] // ✅ Array para múltiples imágenes con valor por defecto
  ) {
    this.codPublicacion = codP;
    this.codUsuario = codUsu;
    this.tituloPublicacion = tit;
    this.contenidoPublicacion = conte;
    this.imagenUrl = img;
    this.imagenesUrls = imagenes; // ✅ Asignar array de imágenes
    this.fechaCreacionPublicacion = fec;
    this.parqueadero = par;
    this.estrato = est;
    this.servicios = ser;
    this.administracion = admi;
    this.metros = met;
    this.habitaciones = habi;
    this.banios = bani;
    this.tipo = tipo; // ✅ Se asigna el valor del tipo de vivienda
  }
}
