import { Injectable } from '@angular/core';
import { HttpClientModule, HttpErrorResponse, HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { FormGroup } from '@angular/forms';
import { ILoginResponse } from '../_model/loginResponse.model';
import { ISolicitud } from '../_model/solicitud.model';
import { IUser } from '../_model/user.model';
import { ITaller } from '../_model/taller.model';
import { IRepuestoXSolRqst } from '../_model/respuestoXSoliRqst.model';
import { IRepuestoXSol } from '../_model/repuestpoXSoli.model';
import { IRepuesto } from '../_model/repuesto.model';
import { formatNumber } from '@angular/common';
import { IFotoXSolicitud } from '../_model/FotoxSol.model';

@Injectable({
  providedIn: 'root'
})

export class SolicitudService {
  private solicitudUrlBase = localStorage.getItem('API');
  userL: ILoginResponse;
  nuevaSolic: ISolicitud[];
  solSave: ISolicitud[];
  updateEstadoSolic: ISolicitud[];
  repXSolRqst: IRepuestoXSolRqst;
  usuario: IUser;
  usrTaller: ITaller;
  rep: IRepuesto;
  fecha: Date;
  minutos: number;
  codigo: string;
  nuevoRep: IRepuesto[];

  constructor(private http: HttpClient) { }

  generarCodigo(): Observable<string> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', }),
      responseType: 'text' as 'json'
    };
    return this.http.get<string>(this.solicitudUrlBase + '/rest/solicitud/code', httpOptions).pipe(
      tap(data => {
        data = JSON.stringify(JSON.parse(JSON.stringify(data)));
      }),
      catchError(this.handleError)
    );

  }

  guardarSolicitud(estado: string, usuario: IUser, usrTaller: ITaller, crearSolicitudTaller: FormGroup, _marcaSeleccionada: string, _aseguradoraSeleccionada: string): Observable<ISolicitud> {
    this.fecha = new Date();
    this.minutos = parseInt(this.fecha.getMinutes().toString()) + parseInt(crearSolicitudTaller.controls['tiempo'].value);
    this.nuevaSolic = JSON.parse(JSON.stringify({
      /*****************************  ESTRUCTURA SOLICITUD ************************************* */
      idTaller: usrTaller,
      idAseguradora: _aseguradoraSeleccionada,
      idMarca: _marcaSeleccionada,
      idUsuario: usuario,
      anioCarro: crearSolicitudTaller.controls['anho'].value,
      tipoVehiculo: crearSolicitudTaller.controls['tipoV'].value,
      placa: crearSolicitudTaller.controls['placa'].value,
      chasis: crearSolicitudTaller.controls['chasis'].value,
      motor: crearSolicitudTaller.controls['motor'].value,
      poliza: crearSolicitudTaller.controls['poliza'].value,
      siniestro: crearSolicitudTaller.controls['siniestro'].value,
      nombreAsegurado: crearSolicitudTaller.controls['nombre'].value,
      codigoSolicitud: crearSolicitudTaller.controls['codigoSol'].value,
      estado: estado,
      comentariosTaller: crearSolicitudTaller.controls['comentarios'].value,
      fechaInicio: this.fecha,
      fechaFin: new Date().setMinutes(this.minutos)
    }));

    let body = this.nuevaSolic;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.post<ISolicitud>(this.solicitudUrlBase + '/rest/solicitud/save', body, httpOptions).pipe(
      //tap(data => console.log('EL ID DE LA SOLICTUD GUARDADA ES: ' + data[0].id)),
      catchError(this.handleError)
    );
  }

  consultarUsuario(): Observable<IUser> {
    this.userL = JSON.parse(JSON.parse(JSON.stringify(localStorage.getItem('currentUser'))));
    const httpOptions = {
      headers: { 'Content-Type': 'application/json' },
      params: { user: this.userL.user }
    };
    return this.http.get<IUser>(this.solicitudUrlBase + '/rest/usuario/one', httpOptions).pipe(
      tap(data => {
        //console.log('Usuario generador de la solicitud: ' + JSON.stringify(data));
      }),
      catchError(this.handleError)
    );
  }

  consultarTaller(): Observable<ITaller> {
    this.userL = JSON.parse(JSON.parse(JSON.stringify(localStorage.getItem('currentUser'))));
    const httpOptions = {
      headers: { 'Content-Type': 'application/json' },
      params: { usuario: this.userL.user.trim().toString() }
    };
    return this.http.get<ITaller>(this.solicitudUrlBase + '/rest/taller/byUser', httpOptions).pipe(
      tap(data => {
        //console.log('Taller generador de la solicitud: ' + JSON.stringify(data));
      }),
      catchError(this.handleError)
    );
  }

  guardarRepXSol(id: number, idRep: number): Observable<IRepuestoXSol> {
    this.rep = JSON.parse(JSON.stringify(idRep));
    this.repXSolRqst = JSON.parse(JSON.stringify({
      id: id,
      idRepuesto: idRep
    }));

    let body = this.repXSolRqst;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post<IRepuestoXSol>(this.solicitudUrlBase + '/rest/solicitud/repuesto/save', body, httpOptions).pipe(
      tap(data => console.log('Repuesto almacenado en la solicitud: ' + JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  deleteRepXSol(id_sol: number, id_rep: number): Observable<IRepuestoXSol>{
    this.repXSolRqst = JSON.parse(JSON.stringify({
      id: id_sol,
      idRepuesto: id_rep
    }));
    let body = this.repXSolRqst;
    const httpOptions = {
      headers: { 'Content-Type': 'application/json' },
      body: body
    };

    return this.http.delete<IRepuestoXSol>(this.solicitudUrlBase + '/rest/solicitud/repuesto/delete', httpOptions).pipe(
      tap(data => console.log('Repuesto eliminado en la solicitud: ' + JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  guardarFoto(idSolicitud: number, dr: FormData) {
    return this.http.put(this.solicitudUrlBase + '/rest/solicitud/foto/save/' + idSolicitud, dr).pipe(
      tap(data => console.log('Repuesto almacenado en la solicitud: ' + JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  consultarSolicitudesAll(): Observable<ISolicitud[]> {
    const httpOptions = {
      headers: { 'Content-Type': 'application/json' },
      params: {}
    };
    return this.http.get<ISolicitud[]>(this.solicitudUrlBase + '/rest/solicitud/all', httpOptions).pipe(
      tap(data => {
        console.log('Lista de solicitudes: ' + JSON.stringify(data));
      }),
      catchError(this.handleError)
    );
  }

  consultarSolicitudByCode(codigoSolicitud: string): Observable<ISolicitud> {
    const httpOptions = {
      headers: { 'Content-Type': 'application/json' },
      params: { code: codigoSolicitud }
    };
    return this.http.get<ISolicitud>(this.solicitudUrlBase + '/rest/solicitud/bycode', httpOptions).pipe(
      tap(data => {
        console.log('Solicitud consultada: ' + JSON.stringify(data));
      }),
      catchError(this.handleError)
    );
  }

  consultarRepXSol(idSol: number): Observable<IRepuestoXSol[]> {
    const httpOptions = {
      headers: { 'Content-Type': 'application/json' },
      params: { id: idSol.toString() }
    };
    return this.http.get<IRepuestoXSol[]>(this.solicitudUrlBase + '/rest/solicitud/repuesto', httpOptions).pipe(
      tap(data => {
        //console.log('Repuesto de las solicitud consultada:  ' + idSol + " --> " + JSON.stringify(data));
      }),
      catchError(this.handleError)
    );
  }

  consultarSolByEstado(estado: string): Observable<ISolicitud[]> {
    const httpOptions = {
      headers: { 'Content-Type': 'application/json' },
      params: { estado: estado }
    };
    return this.http.get<ISolicitud[]>(this.solicitudUrlBase + '/rest/solicitud/byEstado', httpOptions).pipe(
      tap(data => {
        console.log('Solicitud consultada: ' + JSON.stringify(data));
      }),
      catchError(this.handleError)
    );
  }

  getBase64Image(img: HTMLImageElement) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    var dataURL = canvas.toDataURL("image/png");
    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
  }

  consultarFotoSol(id: number): Observable<IFotoXSolicitud[]> {
    const httpOptions = {
      headers: { 'Content-Type': 'application/json' },
      params: { id: id.toString() }
    };
    return this.http.get<IFotoXSolicitud[]>(this.solicitudUrlBase + '/rest/solicitud/foto', httpOptions).pipe(
      tap(data => {
        console.log('Fotos obtenidas desde el servidor: ' + JSON.stringify(data));
      }),
      catchError(this.handleError)
    );
  }

  updateStSolicitud(estado: string, id: number): Observable<ISolicitud> {
    //this.rep = JSON.parse(JSON.stringify(idRep));
    this.updateEstadoSolic = JSON.parse(JSON.stringify({
      id: id,
      estado: estado
    }));

    let body = this.updateEstadoSolic;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.put<ISolicitud>(this.solicitudUrlBase + '/rest/solicitud/updateEstado', body, httpOptions).pipe(
      tap(data => console.log('Repuesto actulizaco al estado ESC: ' + JSON.stringify(data))),
      catchError(this.handleError)
    );

  }

  findRepuestos() {
    const httpOptions = {
      headers: { 'Content-Type': 'application/json' },
      params: {}
    };
    return this.http.get<IRepuesto[]>(this.solicitudUrlBase + '/rest/repuesto/all', httpOptions).pipe(
      tap(data => {
        //console.log('LISTA DE REPUESTO WJUAREZ:' + JSON.stringify(data));
      }
      ));
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