import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpClient} from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { throwError } from 'rxjs';
import { IResultUpdateModule } from '../_model/result-update.module'
import { IUpdateSolicitudEstadoModule } from '../_model/estado.model'
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class tallerSolicitudService {
    private usuariosUrlBAse = localStorage.getItem('API');
    actualizarEstado : IUpdateSolicitudEstadoModule;
    constructor(private http: HttpClient,private datePipe: DatePipe) { }

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