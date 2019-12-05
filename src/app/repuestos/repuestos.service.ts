import {Injectable} from '@angular/core';
import {HttpClientModule, HttpErrorResponse, HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, throwError } from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import { FormGroup } from '@angular/forms';
import { IRepuesto } from '../_model/repuesto.model';
import { ILoginResponse } from '../_model/loginResponse.model';

@Injectable({
  providedIn: 'root'
})

export class RepuestoService{
  private repUrlBase = 'http://localhost:8014/autolink';
  userL: ILoginResponse;
  nuevoRep: IRepuesto[];
  actualizaRep:IRepuesto;

  constructor(private http: HttpClient){}

  getRepuestos():Observable<IRepuesto[]>{
      console.log("Consultando la lista de repuestos ... ");
      const httpOptions = {
         headers: {'Content-Type': 'application/json'},
         params: {}
       };
       return this.http.get<IRepuesto[]>(this.repUrlBase+'/rest/repuesto/all',httpOptions).pipe(
        tap(data => {
          console.log('Lista de repuestos: ' +JSON.stringify(data));
        }),
        catchError(this.handleError)
      );
    }

    guardarRepuesto(nuevoRepFrom:FormGroup,_estadoRepuesto:boolean):Observable<IRepuesto>{
      console.log("Llamaremos al servicio para guardar un nuevo repuesto .. ");
      let mydate = new Date();
      this.userL = JSON.parse(JSON.parse(JSON.stringify(localStorage.getItem('currentUser'))));
      this.nuevoRep=JSON.parse(JSON.stringify({
        "nombre":nuevoRepFrom.controls['nombre'].value,
        "valor":nuevoRepFrom.controls['valor'].value,
        "estado": ( _estadoRepuesto ? true: false),
        "fechacreacion": mydate,
        "usuariocrea": this.userL.nombre
      }));
      let body = this.nuevoRep;
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json' 
        })
      };
      console.log("Datos enviados al servicio para almacenar el nuevo repuesto: " + JSON.stringify(body));
      return this.http.post<IRepuesto>(this.repUrlBase+'/rest/repuesto/save', body, httpOptions).pipe(
        tap(data => console.log('Repuesto almacenado: ' +JSON.stringify(data))),
        catchError(this.handleError)
      );
    }

    actualizarRepuesto(updateRepForm: FormGroup):Observable<IRepuesto>{
      console.log("Llamaeremos al servicio de actualizar repuesto ... ");
      this.actualizaRep = JSON.parse(JSON.stringify({
        "nombre": updateRepForm.controls['nombre'].value,
        "valor": updateRepForm.controls['valor'].value
      }));
      let body = this.actualizaRep;
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json' 
        })
      };
      console.log("Datos enviados al servicio para actualizar el proveedor: " + JSON.stringify(body));
      return this.http.put<IRepuesto>(this.repUrlBase+'/rest/repuesto/update', body, httpOptions).pipe(
        tap(data => console.log('Proveedor actualizado: ' +JSON.stringify(data))),
        catchError(this.handleError)
      );

    }

    actualizarEstado(updateRepForm: FormGroup,estado:boolean):Observable<IRepuesto>{
      console.log("Llamaremos al servicio para actualizar el estado del repuesto ... ");
      this.actualizaRep = JSON.parse(JSON.stringify({
        //"id": updateTallerForm.controls['idTlr'].value,
        "nombre": updateRepForm.controls['nombre'].value,
        //"direccion": updateProvForm.controls['direccion'].value,
        "estado": (estado ? true: false)
      }));
      let body = this.actualizaRep;
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json' 
        })
      };
      console.log("Datos enviados al servicio para actualizar el estado del proveedor: " + JSON.stringify(body));
      return this.http.post<IRepuesto>(this.repUrlBase+'/rest/repuesto/status', body, httpOptions).pipe(
        tap(data => console.log('Proveedor actualizado: ' +JSON.stringify(data))),
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
