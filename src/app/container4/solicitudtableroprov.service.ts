import { Injectable } from '@angular/core';
import {HttpClientModule, HttpErrorResponse, HttpClient, HttpHeaders} from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { Observable, throwError } from 'rxjs';
import { IResultByStates } from '../_model/resultbystates.module'
import { tap, catchError } from 'rxjs/operators';
import { IListRepuestosModule } from '../_model/list-repuestos.module'

@Injectable({
  providedIn: 'root'
})
export class SolicitudtableroprovService {
  private usuariosUrlBAse = localStorage.getItem('API');
  constructor(private http: HttpClient,private datePipe: DatePipe) { }

  getSolicitudesByStatus(estado: string):Observable<IResultByStates[]>{
    console.log("consultamos la lista segun el estado");
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
}
