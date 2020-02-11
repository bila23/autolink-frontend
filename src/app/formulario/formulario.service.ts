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

@Injectable({
    providedIn: 'root'
})

export class SolicitudService {
    private solicitudUrlBase = localStorage.getItem('API');
    userL: ILoginResponse;
    nuevaSolic: ISolicitud[];
    updateEstadoSolic: ISolicitud[];
    repXSolRqst: IRepuestoXSolRqst;
    usuario: IUser;
    usrTaller: ITaller;
    rep: IRepuesto;
    fecha: Date;
    minutos: number;
    codigo: string;

    constructor(private http: HttpClient) { }

    generarCodigo(): Observable<string> {

        console.log("Llamaremos al servicio de login");
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json', }),
            responseType: 'text' as 'json'
        };
        return this.http.get<string>(this.solicitudUrlBase + '/rest/solicitud/code', httpOptions).pipe(
            tap(data => {
                data = JSON.stringify(JSON.parse(JSON.stringify(data))),
                    console.log('codigo de solicitud: ' + JSON.stringify(data).toString())
            }),
            catchError(this.handleError)
        );
    }

    guardarSolicitud(estado: string, usuario: IUser, usrTaller: ITaller, crearSolicitudTaller: FormGroup, _marcaSeleccionada: string, _aseguradoraSeleccionada: string, _repuestoSeleccionado: string): Observable<ISolicitud> {
        console.log("Llamaremos al servicio para guardar una nueva solicitud .. ");
        this.fecha = new Date();
        this.minutos = parseInt(this.fecha.getMinutes().toString()) + parseInt(crearSolicitudTaller.controls['tiempo'].value);
        console.log("Minutos fin: " + this.minutos);
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
        console.log("Datos enviados al servicio para almacenar el nuevo taller: " + JSON.stringify(body));
        return this.http.post<ISolicitud>(this.solicitudUrlBase + '/rest/solicitud/save', body, httpOptions).pipe(
            tap(data => console.log('Solicitud almacenada: ' + JSON.stringify(data))),
            catchError(this.handleError)
        );
    }

    consultarUsuario(): Observable<IUser> {
        console.log("Consultaremos los datos del usuario");
        this.userL = JSON.parse(JSON.parse(JSON.stringify(localStorage.getItem('currentUser'))));
        const httpOptions = {
            headers: { 'Content-Type': 'application/json' },
            params: { user: this.userL.user }
        };
        return this.http.get<IUser>(this.solicitudUrlBase + '/rest/usuario/one', httpOptions).pipe(
            tap(data => {
                console.log('Usuario generador de la solicitud: ' + JSON.stringify(data));
            }),
            catchError(this.handleError)
        );
    }

    consultarTaller(): Observable<ITaller> {
        console.log("Consultaremos los datos del taller");
        this.userL = JSON.parse(JSON.parse(JSON.stringify(localStorage.getItem('currentUser'))));
        console.log("USUARIO DEL TALLER: " + this.userL.user);
        const httpOptions = {
            headers: { 'Content-Type': 'application/json' },
            params: { usuario: this.userL.user.trim().toString() }
        };
        return this.http.get<ITaller>(this.solicitudUrlBase + '/rest/taller/byUser', httpOptions).pipe(
            tap(data => {
                console.log('Taller generador de la solicitud: ' + JSON.stringify(data));
            }),
            catchError(this.handleError)
        );
    }

    guardarRepXSol(id: number, idRep: number): Observable<IRepuestoXSol> {
        console.log("Guardando los respuestos de la solicitud");
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
        console.log("Datos enviados al servicio para almacenar el repuesto de la solicitud: " + JSON.stringify(body));
        return this.http.post<IRepuestoXSol>(this.solicitudUrlBase + '/rest/solicitud/repuesto/save', body, httpOptions).pipe(
            tap(data => console.log('Repuesto almacenado en la solicitud: ' + JSON.stringify(data))),
            catchError(this.handleError)
        );
    }

    consultarSolicitudesAll(): Observable<ISolicitud[]> {
        console.log("Consultaremos el listado de solicitudes ingresadas.... ");
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
        console.log("Consultaremos una solicitud by code.... ");
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
        console.log("Consultaremos los repuestos de la solicitud ...");
        const httpOptions = {
            headers: { 'Content-Type': 'application/json' },
            params: { id: idSol.toString() }
        };
        return this.http.get<IRepuestoXSol[]>(this.solicitudUrlBase + '/rest/solicitud/repuesto', httpOptions).pipe(
            tap(data => {
                console.log('Repuesto de las solicitud consultada:  ' + idSol + " --> " + JSON.stringify(data));
            }),
            catchError(this.handleError)
        );
    }

    consultarSolByEstado(estado: string): Observable<ISolicitud[]> {
        console.log("Consultaremos una solicitud by code.... ");
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

    updateStSolicitud(estado: string, id: number): Observable<ISolicitud> {

        console.log("Guardando los respuestos de la solicitud");
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
        console.log("Datos enviados al servicio para almacenar el repuesto de la solicitud: " + JSON.stringify(body));
        return this.http.put<ISolicitud>(this.solicitudUrlBase + '/rest/solicitud/updateEstado', body, httpOptions).pipe(
            tap(data => console.log('Repuesto actulizaco al estado ESC: ' + JSON.stringify(data))),
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