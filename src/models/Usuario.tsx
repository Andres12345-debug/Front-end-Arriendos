// Modelo Usuario con codRol como número
export class Usuario {
    public codUsuario: number;
    public nombreUsuario: string;
    public fechaNacimientoUsuario: Date;
    public telefonoUsuario: string;
    public generoUsuario: number;
    public codRol: number; // Utiliza codRol como número, no un objeto Role
    public rolNombre?: string; // Agregar rolNombre como propiedad opcional

    constructor(cod: number, nom: string, fec: Date, tel: string, ge: number, codRol: number, rolNom?: string) {
        this.codUsuario = cod;
        this.nombreUsuario = nom;
        this.fechaNacimientoUsuario = fec;
        this.telefonoUsuario = tel;
        this.generoUsuario = ge;
        this.codRol = codRol; // Asignar el código del rol
        this.rolNombre = rolNom; // Asignar el nombre del rol si se proporciona
    }
}
