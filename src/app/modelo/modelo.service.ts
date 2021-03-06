import { Injectable } from '@angular/core';
import { HttpClientModule, HttpErrorResponse, HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { IModelo } from '../_model/modelo.model';
import { IMarca } from '../_model/marca.model';
import { ILoginResponse } from '../_model/loginResponse.model';

@Injectable({
  providedIn: 'root'
})

export class ModeloService {
  private modeloUrlBAse = localStorage.getItem('API');
  userL: ILoginResponse;
  nuevoMdl: IModelo;
  actualizarMdl: IModelo;


  constructor(private http: HttpClient, private datePipe: DatePipe) { }

  getModelos(): Observable<IModelo[]> {
    const httpOptions = {
      headers: { 'Content-Type': 'application/json' },
      params: {}
    };
    return this.http.get<IModelo[]>(this.modeloUrlBAse + '/rest/modelo/all', httpOptions).pipe(
      tap(data => {
        console.log('Lista de modelos registrados: ' + JSON.stringify(data));
      }),
      catchError(this.handleError)
    );
  }

  getMarcas(): Observable<IMarca[]> {

    const httpOptions = {
      headers: { 'Content-Type': 'application/json' },
      params: {}
    };

    return this.http.get<IMarca[]>(this.modeloUrlBAse + '/rest/marca/all', httpOptions).pipe(
      tap(),
      catchError(this.handleError)
    );
  }

  guardarModelo(nuevoMdlFrom: FormGroup, _tipoSeleccionado: string, _estadoModelo: boolean): Observable<IModelo> {
    let mydate = new Date();
    this.userL = JSON.parse(JSON.parse(JSON.stringify(localStorage.getItem('currentUser'))));
    this.nuevoMdl = JSON.parse(JSON.stringify({
      "nombre": nuevoMdlFrom.controls['nombre'].value,
      "marca": _tipoSeleccionado,
      "estado": (_estadoModelo ? true : false),
      "fechacreacion": mydate,
      "usuariocrea": this.userL.nombre
    }));
    let body = this.nuevoMdl;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post<IModelo>(this.modeloUrlBAse + '/rest/modelo/save', body, httpOptions).pipe(
      tap(data => console.log('Modelo almacenado: ' + JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  actualizarModelo(updateModeloForm: FormGroup, _marcaSeleccionada: string): Observable<IModelo> {
    this.actualizarMdl = JSON.parse(JSON.stringify({
      "id": updateModeloForm.controls['idMdl'].value,
      "nombre": updateModeloForm.controls['nombre'].value,
      "marca": _marcaSeleccionada
    }));
    let body = this.actualizarMdl;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.put<IModelo>(this.modeloUrlBAse + '/rest/modelo/update', body, httpOptions).pipe(
      tap(),
      catchError(this.handleError)
    );
  }

  actualizarEstado(nombre: string, _estadoModelo: boolean): Observable<IModelo> {
    this.actualizarMdl = JSON.parse(JSON.stringify({
      "nombre": nombre,
      "estado": (_estadoModelo ? true : false)
    }));
    let body = this.actualizarMdl;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post<IModelo>(this.modeloUrlBAse + '/rest/modelo/status', body, httpOptions).pipe(
      tap(),
      catchError(this.handleError)
    );
  }

  private handleError(err: HttpErrorResponse) {
    let errorMessage = '';
    if (err.error instanceof ErrorEvent) {
      errorMessage = `An error ocurred: ${err.error.message}`;
    } else {
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}
