import { IUser } from './user.model';

export interface IProveedor{
    id:number;
    nombre:string;
    direccion:string;
    estado: number;
    usuariocrea: string;
    fechacreacion: Date;
    razonsocial:string;
	cargo:string;
	nit:string;
	telefono:string;
	cuentabancaria:string;
	usuario: IUser
}