import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import {HttpClientModule, HttpErrorResponse, HttpClient, HttpHeaders} from '@angular/common/http';
import { Respuesta } from '../_model/respuesta-api.module'
import { tap, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ListofertprovService {
  private usuariosUrlBAse = localStorage.getItem('API');
  constructor(private http: HttpClient,private datePipe: DatePipe) { }

  setGanador(idSoli:string, idProv:string):Observable<Respuesta[]>{
    console.log("set ganador") ;
    let body = "";
    const httpOptions = {
      headers: {'Content-Type': 'application/json'},
      params: {}
    };

    return this.http.put<Respuesta[]>(this.usuariosUrlBAse + "/rest/proveedor/ganador/all/"+idSoli+"/" + idProv, body, httpOptions).pipe(
          tap(data => console.log("Llamado a proceso en bd set ganador" + JSON.stringify(data))),
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
