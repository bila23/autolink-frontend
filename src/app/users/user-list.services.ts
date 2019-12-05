import {Injectable} from '@angular/core';
import {HttpClientModule, HttpErrorResponse, HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, throwError } from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import { IUser } from '../_model/user.model';
import { ITipoUsuario } from '../_model/tipoUsuario.model';
import { FormGroup } from '@angular/forms';
import { IUserVista } from '../_model/userVista.model';
import { DatePipe } from '@angular/common';
import { ILoginResponse } from '../_model/loginResponse.model';

@Injectable({
  providedIn: 'root'
})

export class UserService{
  private usuariosUrlBAse = 'http://localhost:8014/autolink';
  userL: ILoginResponse;
  nuevoUsr:IUser;
  actualizarUsr:IUser;
  actualizarUsr2:IUser;
  

  constructor(private http: HttpClient,private datePipe: DatePipe){}

  /*getProducts():Observable<IProduct[]>{
    return this.http.get<IProduct[]>(this.productUrl).pipe(
      tap(data => console.log('ALL: '+JSON.stringify(data))),
      catchError(this.handleError)
    );
    } */

    getUsuariosByTipo(p_tipo_usuario:string):Observable<IUser[]>{
      const httpOptions = {
         tipoUsuario:p_tipo_usuario
       };
       return this.http.post<IUser[]>(this.usuariosUrlBAse+'/rest/usuario/getByTipo',httpOptions);
    }

    getUsuarios():Observable<IUser[]>{
      console.log("Consultando la lista de usuarios ... ");
      const httpOptions = {
         headers: {'Content-Type': 'application/json'},
         params: {}
       };

       return this.http.get<IUser[]>(this.usuariosUrlBAse+'/rest/usuario/all',httpOptions).pipe(
        tap(data => {
          console.log('Lista de usuarios registrados: ' +JSON.stringify(data));
        }),
        catchError(this.handleError)
      );
    }

    getTiposUsuarios():Observable<ITipoUsuario[]>{
      console.log("Consultando la lista de tipos de usuarios ... ");
      const httpOptions = {
         headers: {'Content-Type': 'application/json'},
         params: {}
       };

       return this.http.get<ITipoUsuario[]>(this.usuariosUrlBAse+'/rest/usuarioType/all',httpOptions).pipe(
        tap(data => {
          console.log('Tipos de usuarios: ' +JSON.stringify(data));
        }),
        catchError(this.handleError)
      );
    }

    guardarUsuario(nuevoUsrFrom:FormGroup,_tipoSeleccionado:string,_estadoUsuario:boolean):Observable<IUser>{
      console.log("Llamaremos al servicio para guardar un nuevo usuario .. ");
      //actualizarUsrForm.controls['id'].setValue(+actualizarUsrForm.controls['id'].value);
      //this.usuarioReset=JSON.parse(JSON.stringify({"usuario": userR,"nombre": "nombre3","pass":passR,"email":"email4","tipo":1}));
      let mydate = new Date();
      this.userL = JSON.parse(JSON.parse(JSON.stringify(localStorage.getItem('currentUser'))));
      this.nuevoUsr=JSON.parse(JSON.stringify({

        "usuario": nuevoUsrFrom.controls['usuario'].value,
        "nombre":nuevoUsrFrom.controls['nombre'].value,
        "tipo": _tipoSeleccionado,
        "estado": (_estadoUsuario ? true: false),
        "fechacreacion": mydate,
        "usuariocrea": this.userL.nombre
      }));
      let body = this.nuevoUsr;
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json' 
        })
      };
      console.log("Datos enviados al servicio para alamacenar el usuario: " + JSON.stringify(body));
      return this.http.post<IUser>(this.usuariosUrlBAse+'/rest/usuario/save', body, httpOptions).pipe(
        tap(data => console.log('Usuario almacenado: ' +JSON.stringify(data))),
        catchError(this.handleError)
      );
    }

    actualizarUsuario(updateUserForm: FormGroup,_tipoSeleccionado:string):Observable<IUser>{
      console.log("Llamaremos al servicio para actualizar un usuario ...");
      this.actualizarUsr=JSON.parse(JSON.stringify({
        "id": updateUserForm.controls['idUsr'].value,
        "usuario": updateUserForm.controls['usuario'].value,
        "nombre": updateUserForm.controls['nombre'].value,
        "tipo": _tipoSeleccionado,
      }));
      let body = this.actualizarUsr;
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json' 
        })
      };
      console.log("Datos enviados al servicio para actualizar el usuario: " + JSON.stringify(body));
      return this.http.put<IUser>(this.usuariosUrlBAse+'/rest/usuario/update', body, httpOptions).pipe(
        tap(data => {
                    console.log('Usuario actualizado: ' +JSON.stringify(data));
                    }),
                    catchError(this.handleError)
            );
      }

      actualizarEstado(usuario:string,_estadoUsuario:boolean):Observable<IUser>{
        console.log("Estado del usuario: "+_estadoUsuario);
        this.actualizarUsr=JSON.parse(JSON.stringify({
          //"id": idUser,
          "nombre":usuario,
          //"estado": (_estadoUsuario ? true: false),
          "estado": (_estadoUsuario ? true: false)
        }));
        let body = this.actualizarUsr;
        const httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json' 
          })
        };
        console.log("Datos enviados para actualizar el estado: " + JSON.stringify(body));
        return this.http.post<IUser>(this.usuariosUrlBAse+'/rest/usuario/status', body, httpOptions).pipe(
          tap(data => {
                    console.log('Estado de Usuario actualizado: ' +JSON.stringify(data));

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
