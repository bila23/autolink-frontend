import {Injectable} from '@angular/core';
import {HttpClientModule, HttpErrorResponse, HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, throwError } from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import { FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { IModelo } from '../_model/modelo.model';
import { IMarca } from '../_model/marca.model';
import { ILoginResponse } from '../_model/loginResponse.model';

@Injectable({
  providedIn: 'root'
})

export class ModeloService{
  private modeloUrlBAse = 'http://localhost:8014/autolink';
  userL: ILoginResponse;
  nuevoMdl:IModelo;
  actualizarMdl:IModelo;
  //actualizarUsr2:IUser;
  
  constructor(private http: HttpClient,private datePipe: DatePipe){}

    getModelos():Observable<IModelo[]>{
      console.log("Consultando la lista de modelos ... ");
      const httpOptions = {
         headers: {'Content-Type': 'application/json'},
         params: {}
       };
       return this.http.get<IModelo[]>(this.modeloUrlBAse+'/rest/modelo/all',httpOptions).pipe(
        tap(data => {
          console.log('Lista de modelos registrados: ' +JSON.stringify(data));
        }),
        catchError(this.handleError)
      );
    }

    getMarcas():Observable<IMarca[]>{
      console.log("Consultando la lista de marcas ... ");
      const httpOptions = {
         headers: {'Content-Type': 'application/json'},
         params: {}
       };

       return this.http.get<IMarca[]>(this.modeloUrlBAse+'/rest/marca/all',httpOptions).pipe(
        tap(data => {
          console.log('Marcas disponibles: ' +JSON.stringify(data));
        }),
        catchError(this.handleError)
      );
    }

    guardarModelo(nuevoMdlFrom:FormGroup,_tipoSeleccionado:string,_estadoModelo:boolean):Observable<IModelo>{
      console.log("Llamaremos al servicio para guardar un nuevo modelo .. ");
      let mydate = new Date();
      this.userL = JSON.parse(JSON.parse(JSON.stringify(localStorage.getItem('currentUser'))));
      this.nuevoMdl=JSON.parse(JSON.stringify({
        "nombre":nuevoMdlFrom.controls['nombre'].value,
        "marca": _tipoSeleccionado,
        "estado": (_estadoModelo ? true: false),
        "fechacreacion": mydate,
        "usuariocrea":this.userL.nombre
      }));
      let body = this.nuevoMdl;
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json' 
        })
      };
      console.log("Datos enviados al servicio para alamacenar el usuario: " + JSON.stringify(body));
      return this.http.post<IModelo>(this.modeloUrlBAse+'/rest/modelo/save', body, httpOptions).pipe(
        tap(data => console.log('Modelo almacenado: ' +JSON.stringify(data))),
        catchError(this.handleError)
      );
    }

    actualizarModelo(updateModeloForm: FormGroup,_marcaSeleccionada:string):Observable<IModelo>{
      console.log("Llamaremos al servicio para actualizar un modelo ...");
      this.actualizarMdl=JSON.parse(JSON.stringify({
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
      console.log("Datos enviados al servicio para actualizar el modelo: " + JSON.stringify(body));
      return this.http.put<IModelo>(this.modeloUrlBAse+'/rest/modelo/update', body, httpOptions).pipe(
        tap(data => {
                    console.log('Modelo actualizado: ' +JSON.stringify(data));
                    }),
                    catchError(this.handleError)
            );
      }

      actualizarEstado(nombre:string,_estadoModelo:boolean):Observable<IModelo>{
        console.log("Estado del modelo: "+_estadoModelo);
        this.actualizarMdl=JSON.parse(JSON.stringify({
          "nombre":nombre,
          "estado": (_estadoModelo ? true: false)
        }));
        let body = this.actualizarMdl;
        const httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json' 
          })
        };
        console.log("Datos enviados para actualizar el estado: " + JSON.stringify(body));
        return this.http.post<IModelo>(this.modeloUrlBAse+'/rest/modelo/status', body, httpOptions).pipe(
          tap(data => {
                    console.log('Estado de Modelo actualizado: ' +JSON.stringify(data));

          }), 
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
