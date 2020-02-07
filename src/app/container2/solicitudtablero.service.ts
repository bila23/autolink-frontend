import { Injectable } from '@angular/core';
import {HttpClientModule, HttpErrorResponse, HttpClient, HttpHeaders} from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { Observable, throwError } from 'rxjs';
import { IResultByStates } from '../_model/resultbystates.module'
import { IResultUpdateModule } from '../_model/result-update.module'
import { IListRepuestosModule } from '../_model/list-repuestos.module'
import { IUpdateSolicitudModule } from '../_model/update-solicitud.module'
import { IUpdateComentarioaseguradoraModule } from '../_model/update-comentarioaseguradora.module'
import { tap, catchError } from 'rxjs/operators';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class SolicitudtableroService {
  private usuariosUrlBAse = localStorage.getItem('API');
  actualizarSoli: IUpdateSolicitudModule;
  actualizarComentAsegu: IUpdateComentarioaseguradoraModule;

  constructor(private http: HttpClient,private datePipe: DatePipe) { }

  getSolicitudesByStatus(estado: string):Observable<IResultByStates[]>{
    console.log("consultamos la lista segiun el estado");
    const httpOptions = {
      headers: {'Content-Type': 'application/json'},
      params: {}
    };

    return this.http.get<IResultByStates[]>(this.usuariosUrlBAse + "/rest/solicitud/byEstado?estado=" + estado).pipe(
      tap(data => {
        console.log("tablero segun estado" + JSON.stringify(data));
      })
    );
  }

  getPiezasSoli(id: string):Observable<IListRepuestosModule[]>{
    console.log("consulta para traer la lista de piezas");
    const httpOptions = {
      headers: {'Content-Type': 'application/json'},
      params: {}
    };

    return this.http.get<IListRepuestosModule[]>(this.usuariosUrlBAse + "/rest/solicitud/repuesto?id=" + id.toString()).pipe(
      tap(data => {
        console.log("piezas segun id " + JSON.stringify(data));
      })
    );
  }

  SetComentariosAseguradora(id:number, comentario:string){
    console.log("metodo para agregar un comentario de aseguradora");
    console.log(id + ", " + comentario);
    this.actualizarComentAsegu = JSON.parse(JSON.stringify({
      "id": id,
      "comentario": comentario,
    }));
    let body = this.actualizarComentAsegu;
    const httpOptions = {
      headers: {'Content-Type': 'application/json'},
      params: {}
    };

    return this.http.put<IResultUpdateModule[]>(this.usuariosUrlBAse + "/rest/solicitud/updateComentarioAseguradora", body, httpOptions).pipe(
          tap(data => console.log("Llamado a proceso en bd update comentAsegu" + JSON.stringify(data))),
          catchError(this.handleError)
        );
  }

  SetProcesarSoli(id:number, estado:string){
    console.log("metodo para continuar el flujo de la solicitud");
    this.actualizarSoli = JSON.parse(JSON.stringify({
      "id": id,
      "estado": estado
    }));
    let body = this.actualizarSoli;
    const httpOptions = {
      headers: {'Content-Type': 'application/json'},
      params: {}
    };

    return this.http.put<IResultUpdateModule[]>(this.usuariosUrlBAse + "/rest/solicitud/updateEstado", body, httpOptions).pipe(
      tap(data => console.log("Llamado a proceso en bd update estado" + JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  Next_Step(estado_actual:string){
    let estado_next = "";

    if (estado_actual.toLowerCase() === "ing"){
      estado_next = "coa";
    }

    return estado_next;
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
