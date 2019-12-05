import { IUser } from './user.model';

export interface ITaller{
    id:number;
    nombre:string;
    usuariocrea: string;
    estado: number;
    fechacreacion: Date;
    razonsocial: string;
	cargo: string;
	telefono: string;
    usuario: IUser
}