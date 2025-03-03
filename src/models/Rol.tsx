export class User {
    public id: number;
    public nombre: string;

    constructor(id: number, nombre: string) {
        this.id = id;
        this.nombre = nombre;
    }
}

export class Role {
    public codRol: number;
    public nombreRol: string;
    public estadoRol: number;
    public usuarios: User[]; // Propiedad para almacenar los usuarios asignados al rol

    constructor(codR: number, nom: string, est: number, usuarios: User[] = []) {
        this.codRol = codR;
        this.nombreRol = nom;
        this.estadoRol = est;
        this.usuarios = usuarios; // Asignamos los usuarios al rol
    }
}
