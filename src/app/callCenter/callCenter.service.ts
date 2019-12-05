import {Injectable} from '@angular/core';
import {HttpClientModule, HttpErrorResponse, HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, throwError } from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import { FormGroup } from '@angular/forms';
import { ILoginResponse } from '../_model/loginResponse.model';
import { ICallCenter } from '../_model/callCenter.model';

@Injectable({
  providedIn: 'root'
})

export class CallCenterService{
  private provUrlBase = 'http://localhost:8014/autolink';
  userL: ILoginResponse;
  nuevoCce: ICallCenter[];
  actualizaCce:ICallCenter;

  constructor(private http: HttpClient){}

  getCallCenters():Observable<ICallCenter[]>{
      console.log("Consultando la lista de call centers ... ");
      const httpOptions = {
         headers: {'Content-Type': 'application/json'},
         params: {}
       };
       return this.http.get<ICallCenter[]>(this.provUrlBase+'/rest/callcentee/all',httpOptions).pipe(
        tap(data => {
          console.log('Lista de call centers: ' +JSON.stringify(data));
        }),
        catchError(this.handleError)
      );
    }

    //guardarCallCenter(nuevoProvFrom:FormGroup,_estadoProveedor:boolean,_userSeleccionado:string):Observable<IProveedor>{
    guardarCallCenter(nuevoCceFrom:FormGroup,_userSeleccionado:string):Observable<ICallCenter>{
      console.log("Llamaremos al servicio para guardar un nuevo callCenter .. ");
      let mydate = new Date();
      this.userL = JSON.parse(JSON.parse(JSON.stringify(localStorage.getItem('currentUser'))));
      this.nuevoCce=JSON.parse(JSON.stringify({
        "nombreempresa":nuevoCceFrom.controls['nombre'].value,
        //"estado": ( _estadoProveedor ? true: false),
        //"fechacreacion": mydate,
        //"usuariocrea": this.userL.nombre,
        "cargo":nuevoCceFrom.controls['cargo'].value,
        "razonsocial":nuevoCceFrom.controls['razonSocial'].value,
        "telefono":nuevoCceFrom.controls['telefono'].value,
        "usuario":_userSeleccionado
      }));
      let body = this.nuevoCce;
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json' 
        })
      };
      console.log("Datos enviados al servicio para almacenar el nuevo callCenter: " + JSON.stringify(body));
      return this.http.post<ICallCenter>(this.provUrlBase+'/rest/callcenter/save', body, httpOptions).pipe(
        tap(data => console.log('CallCenter almacenado: ' +JSON.stringify(data))),
        catchError(this.handleError)
      );
    }

    actualizarCallCenter(updateCceForm: FormGroup,_userSeleccionado:string):Observable<ICallCenter>{
      console.log("Llamaeremos al servicio de actualizar proveedor ... ");
      this.actualizaCce = JSON.parse(JSON.stringify({
        "nombreempresa": updateCceForm.controls['nombre'].value,
        "cargo": updateCceForm.controls['cargo'].value,
        "razonsocial": updateCceForm.controls['razonSocial'].value,
        "telefono": updateCceForm.controls['telefono'].value,
        "usuario": _userSeleccionado
      }));
      let body = this.actualizaCce;
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json' 
        })
      };
      console.log("Datos enviados al servicio para actualizar el callcenter: " + JSON.stringify(body));
      return this.http.put<ICallCenter>(this.provUrlBase+'/rest/callcenter/update', body, httpOptions).pipe(
        tap(data => console.log('CallCenter actualizado: ' +JSON.stringify(data))),
        catchError(this.handleError)
      );

    }

    actualizarEstado(updateCceForm: FormGroup,estado:boolean):Observable<ICallCenter>{
      console.log("Llamaremos al servicio para actualizar el estado del callcenter ... ");
      this.actualizaCce = JSON.parse(JSON.stringify({
        //"id": updateTallerForm.controls['idTlr'].value,
        "nombreempresa": updateCceForm.controls['nombre'].value,
        //"direccion": updateProvForm.controls['direccion'].value,
        "estado": (estado ? true: false)
      }));
      let body = this.actualizaCce;
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json' 
        })
      };
      console.log("Datos enviados al servicio para actualizar el estado del callcenter: " + JSON.stringify(body));
      return this.http.post<ICallCenter>(this.provUrlBase+'/rest/callcenter/status', body, httpOptions).pipe(
        tap(data => console.log('CallCenter actualizado: ' +JSON.stringify(data))),
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
