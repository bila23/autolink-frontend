import { ITipoUsuario } from './tipoUsuario.model';

export interface IUser{
    id: number;
    usuario: string;
    nombre: string;
    contra:string;
    tipo: ITipoUsuario;
    usuariocrea: string;
    estado: number;
    fechacreacion: Date;
}