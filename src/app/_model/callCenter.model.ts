import { IUser } from './user.model';

export interface ICallCenter{
    id:number;
    nombreempresa:string;
    razonsocial:string;
	cargo:string;
	telefono:string;
	usuario: IUser
}