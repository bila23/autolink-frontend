import { IMarca } from './marca.model';

export interface IModelo{
    id: number;
    nombre: string;
    marca: IMarca;
    estado:number;
    usuariocrea: string;
    fechacreacion: Date;
}