import { IId } from './id.module'
import { IRepuesto } from './repuesto.model'
import { IResultByStates } from './resultbystates.module'

export interface IListRepuestosModule { 
  id: IId;
  repuesto: IRepuesto;
  solicitud: IResultByStates;
  estado: string;
  aplica:boolean;
}
