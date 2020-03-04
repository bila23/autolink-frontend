import { ISolicitud } from './solicitud.model';

export interface IFotoXSolicitud{
    id: number;
    foto:Uint8Array;
    idSolicitud: ISolicitud;
}