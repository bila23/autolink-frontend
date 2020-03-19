import { Injectable } from '@angular/core';
import {HttpClientModule, HttpErrorResponse, HttpClient, HttpHeaders} from '@angular/common/http';
import { DatePipe, JsonPipe } from '@angular/common';
import { Observable, throwError } from 'rxjs';
import { IResultByStates } from '../_model/resultbystates.module'
import { tap, catchError } from 'rxjs/operators';
import { IListRepuestosModule } from '../_model/list-repuestos.module'
import { IListPiezasModule } from '../_model/list-piezas.module'
import { SetOfertaModule } from '../_model/set-oferta.module'

@Injectable({
  providedIn: 'root'
})
export class SolicitudtableroprovService {
  private usuariosUrlBAse = localStorage.getItem('API');
  constructor(private http: HttpClient,private datePipe: DatePipe) { }
  setOferta: SetOfertaModule;

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

  getPiezaSoliProv(idsoli: string, idprov: string):Observable<IListPiezasModule[]>{
    console.log("consulta para traer la lista de piezas por idsoli y id prov");
    const httpOptions = {
      headers: {'Content-Type': 'application/json'},
      params: {}
    };

    return this.http.get<IListPiezasModule[]>(this.usuariosUrlBAse + "/rest/oferta/bySolicitudAndByProveedor/" + idsoli.toString() + "/" + idprov.toString()).pipe(
      tap(data => {
        console.log("piezas segun idsoli y idprov " + JSON.stringify(data));
      })
    );
  }

  setOfertaSave(idsolicitud: string, idrepuesto: string, idproveedor: string, cantidad: string, estado: string, tiempo: string, ganador: string){
    console.log("metodo setOfertaSave");
    this.setOferta = JSON.parse(JSON.stringify({
      "idSolicitud": idsolicitud,
      "idRepuesto": idrepuesto,
      "idProveedor": idproveedor,
      "cantidad": cantidad,
      "estado": estado,
      "tiempo": tiempo,
      "ganador": ganador
    }));
    let body = this.setOferta;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json' 
      })
    }
      console.log("Datos envisados al servicio Oferta/Save: " + JSON.stringify(body));   
        return this.http.post<SetOfertaModule>(this.usuariosUrlBAse+'/rest/oferta/save', body, httpOptions).pipe(
          tap(data => console.log('Oferta Save..: ' +JSON.stringify(data))),
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
