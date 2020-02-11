import { IRepuesto } from './repuesto.model';
import { ISolicitud } from './solicitud.model';
import { IRepXSoliKey } from './repXSoliKeys.model';

export interface IRepuestoXSol {
    id: IRepXSoliKey;
    repuesto: IRepuesto;
    solicitud: ISolicitud;
    estado: string;
    aplica: number;
}