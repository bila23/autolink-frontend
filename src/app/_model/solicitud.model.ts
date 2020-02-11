import { ITaller } from './taller.model';
import { IAseguradora } from './aseguradora.model';
import { IMarca } from './marca.model';
import { IUser } from './user.model';

export interface ISolicitud {
    id: number;
    idTaller: ITaller;
    idAseguradora: IAseguradora;
    idMarca: IMarca;
    idUsuario: IUser;
    anioCarro: string;
    tipoVehiculo: string;
    placa: string;
    chasis: string;
    motor: string;
    poliza: string;
    siniestro: string;
    nombreAsegurado: string;
    codigoSolicitud: string
    estado: string;
    comentariosTaller: string;
    comentariosAseguradora: string;
    comentariosAprovadores: string;
    fechaInicio: Date;
    fechaFin: Date;
}