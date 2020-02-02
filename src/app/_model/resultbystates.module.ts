import { ITaller } from './taller.model'
import { IAseguradora} from './aseguradora.model'
import { IMarca } from './marca.model'
import { IUser } from './user.model';

export interface IResultByStates{
  id: number;
  idTaller: ITaller;
  idAseguradora: IAseguradora;
  idMarca: IMarca;
  idUsuario: IUser;
  anioCarro: number;
  tipoVehiculo: string;
  placa: string;
  chasis: string;
  motor: string;
  poliza: string;
  siniestro: string;
  nombreAsegurado: string;
  codigoSolicitud: string;
  estado: string;
  comentariosTaller: string;
  comentariosAseguradora: string;
  fechaInicio: Date;
  fechaFin: Date;
  comentariosProveedores: string;
}
