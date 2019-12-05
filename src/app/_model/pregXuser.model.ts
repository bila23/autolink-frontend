import { IPreguntasXUsuarioKeys } from './pregXuserK.model';
import { IPreguntas } from './preguntas.model';
import { IUser } from './user.model';

export interface IPregXuser{
    id:IPreguntasXUsuarioKeys;
	preguntas:IPreguntas;
	usuarios:IUser;
	respuesta:string;
}