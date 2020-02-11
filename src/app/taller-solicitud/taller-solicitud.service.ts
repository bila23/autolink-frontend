import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpClient} from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { SolicitudtableroService } from '../container2/solicitudtablero.service'
import { throwError } from 'rxjs';
import { IResultByStates } from '../_model/resultbystates.module'
import {SelectItem, Message} from 'primeng/api';
import { IResultUpdateModule } from '../_model/result-update.module'
import { IRepuesto } from '../_model/repuesto.model'
import { IUpdateSolicitudEstadoModule } from '../_model/estado.model'
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class tallerSolicitudService {
    private usuariosUrlBAse = localStorage.getItem('API');
    actualizarEstado : IUpdateSolicitudEstadoModule;
    repuesto : IRepuesto;
    registroview: IRepuesto[]=[];
    verpiezaSoli: SelectItem[];
    _registroSelected: IResultByStates[];
    dialogVerPieza: boolean;
    cols_verpiezas: any[];
    constructor(private http: HttpClient,private datePipe: DatePipe, private solicitudService:SolicitudtableroService) { }

    SetEstado(id:number, estado:string){
        const httpOptions = {
            headers: {'Content-Type': 'application/json'},
            params: {}
        };
        this.actualizarEstado = JSON.parse(JSON.stringify({
            "id": id,
            "estado": estado,
          }));
          
        let body = this.actualizarEstado;
      
        return this.http.put<IResultUpdateModule[]>(this.usuariosUrlBAse + "/rest/solicitud/updateEstado", body, httpOptions).pipe(
            tap(data => console.log("Llamado a proceso en bd update comentAsegu" + JSON.stringify(data))),
            catchError(this.handleError)
        );
    }

    mostrarRepuestos(id:number){
      const httpOptions = {
        headers: {'Content-Type': 'application/json'},
        params: {}
      };
      return this.http.get<IRepuesto[]>(this.usuariosUrlBAse + "/rest/solicitud/repuesto?id=" + id).pipe(
        tap(data => {})
      );
    }

    private handleError(err: HttpErrorResponse){
        let errorMessage='';
        if(err.error instanceof ErrorEvent){
          errorMessage = `An error ocurred: ${err.error.message}`;
        }else{
          errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
        }
        console.error(errorMessage);
        return throwError(errorMessage);
      }


}