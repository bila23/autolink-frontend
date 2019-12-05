import {Injectable} from '@angular/core';
import {HttpClientModule, HttpErrorResponse, HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, throwError } from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import { FormGroup } from '@angular/forms';
import { IMarca } from '../_model/marca.model';
import { ILoginResponse } from '../_model/loginResponse.model';

@Injectable({
  providedIn: 'root'
})

export class MarcaService{
  private marcaUrlBase = 'http://localhost:8014/autolink';
  userL: ILoginResponse;
  nuevoMrc: IMarca[];
  actualizarMrc:IMarca;

  constructor(private http: HttpClient){}

      getMarcas():Observable<IMarca[]>{
      console.log("Consultando la lista de marcas ... ");
      const httpOptions = {
         headers: {'Content-Type': 'application/json'},
         params: {}
       };
       return this.http.get<IMarca[]>(this.marcaUrlBase+'/rest/marca/all',httpOptions).pipe(
        tap(data => {
          console.log('Lista de marcas: ' +JSON.stringify(data));
        }),
        catchError(this.handleError)
      );
    }

    guardarMarca(nuevoMrcFrom:FormGroup,_estadoMarca:boolean):Observable<IMarca>{
      console.log("Llamaremos al servicio para guardar una nueva marca .. ");
      let mydate = new Date();
      this.userL = JSON.parse(JSON.parse(JSON.stringify(localStorage.getItem('currentUser'))));
      this.nuevoMrc=JSON.parse(JSON.stringify({
        "nombre":nuevoMrcFrom.controls['nombre'].value,
        "estado": ( _estadoMarca ? true: false),
        "fechacreacion": mydate,
        "usuariocrea": this.userL.nombre
      }));
      let body = this.nuevoMrc;
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json' 
        })
      };
      console.log("Datos enviados al servicio para almacenar la nueva marca: " + JSON.stringify(body));
      return this.http.post<IMarca>(this.marcaUrlBase+'/rest/marca/save', body, httpOptions).pipe(
        tap(data => console.log('Taller almacenado: ' +JSON.stringify(data))),
        catchError(this.handleError)
      );
    }

    actualizarEstado(updateMarcaForm: FormGroup,estado:boolean):Observable<IMarca>{
      console.log("Llamaremos al servicio para actualizar una marca ... ");
      this.actualizarMrc=JSON.parse(JSON.stringify({
        //"id": updateTallerForm.controls['idTlr'].value,
        "nombre": updateMarcaForm.controls['nombre'].value,
        "estado": (estado ? true: false)
      }));
      let body = this.actualizarMrc;
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json' 
        })
      };
      console.log("Datos enviados al servicio para actualizar la marca: " + JSON.stringify(body));
      return this.http.post<IMarca>(this.marcaUrlBase+'/rest/marca/status', body, httpOptions).pipe(
        tap(data => console.log('Marca actualizada: ' +JSON.stringify(data))),
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
