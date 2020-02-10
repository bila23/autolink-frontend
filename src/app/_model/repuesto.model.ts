export interface IRepuesto{
    id:number;
    nombre:string;
    valor:number;
    estado: number;
    usuariocrea: string;
    fechacreacion: Date;
    idRepuesto: number;
    idSolicitud: number;
}