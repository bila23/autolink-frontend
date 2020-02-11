export interface IVerPiezaSoliModule { 
  idRepuesto: number;
  idSolicitud:number;
  repuesto_id: number;
  repuesto_nombre: string;
  repuesto_valor: number;
  repuesto_usuariocrea: string;
  repuesto_estado: boolean;
  repuesto_fechacreacion:Date;
  estado: string;
  aplica: boolean;
}
