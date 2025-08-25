export enum TipoVivienda {
  CASA = 'Casa',
  APARTAMENTO = 'Apartamento',
  FINCA = 'Finca',
  HABITACION = 'Habitacion',

}

export enum TipoPublicacion {
  ARRIENDO = 'Arriendo',
  VENTA = 'Venta',
}


export class Publicacion {
  public codPublicacion: number;
  public codUsuario: number;
  public tituloPublicacion: string;
  public contenidoPublicacion: string;
  public imagenUrl: string;
  public imagenesUrls: string[]; // Array para múltiples imágenes
  public fechaCreacionPublicacion: Date;
  public parqueadero: number;
  public estrato: number;
  public servicios: number;
  public administracion: number;
  public metros: string;
  public habitaciones: number;
  public banios: number;
  public tipo: TipoVivienda; // Agregado el enum aquí
  public tipoPublicacion: TipoPublicacion; // Agregado el enum para tipo de publicación
  public periodoAlquiler: number;
  public direccion: string;
  public precio: number;
  public contactoWhatsapp: string;




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
    tipoPublicacion: TipoPublicacion, // ✅ Se agrega el parámetro en el constructor
    periodoAlquiler: number,
    direccion: string,
    precio: number,
    contactoWhatsapp: string,
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
    this.tipoPublicacion = tipoPublicacion;
    this.periodoAlquiler = periodoAlquiler;
    this.direccion = direccion;
    this.precio = precio;
    this.contactoWhatsapp = contactoWhatsapp;
  }
}
