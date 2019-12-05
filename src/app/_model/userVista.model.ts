export interface IUserVista{
    id: number;
    usuario: string;
    nombre: string;
    pass:string;
    usuariocrea: string;
    estado: number;
    fechacreacion: Date;
//TIPO USUARIO
    idTipo: number;    
    nombreTipo: string;
    estadoTipo: string;
    fechacreacionTipo: Date;
    usuariocreaTipo: string;
}