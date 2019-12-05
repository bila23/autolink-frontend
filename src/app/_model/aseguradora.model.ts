import { IUser } from './user.model';

export interface IAseguradora{
    id: number;
    nombre:string;
    usuariocrea: string;
    estado: boolean;
    fechacreacion:Date;
    razonsocial: string;
	cargo: string;
	nit: string;
	iva:string;
	usuario: IUser
}