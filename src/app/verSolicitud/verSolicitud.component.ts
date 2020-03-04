import {Component,OnInit} from '@angular/core';
import {SelectItem, Message} from 'primeng/api';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AlertService } from '../alert/alert.service';
import { IMarca } from '../_model/marca.model';
import { MarcaService } from '../marca/marca.service';
import { AseguradoraService } from '../aseguradora/aseguradora.service';
import { IAseguradora } from '../_model/aseguradora.model';
import { RepuestoService } from '../repuestos/repuestos.service';
import { IRepuesto } from '../_model/repuesto.model';
import { ISolicitud } from '../_model/solicitud.model';
import { ILoginResponse } from '../_model/loginResponse.model';
import { IUser } from '../_model/user.model';
import { ITaller } from '../_model/taller.model';
import { SolicitudService } from '../crearSolicitud/solicitud.service';
import { Router } from '@angular/router';

@Component({
  templateUrl:'./verSolicitud.component.html'
})
export class VerSolicitudComponent implements OnInit{
    msgs: Message[] = [];
    errorMessage:string;
    solicitudesSource: ISolicitud[]=[];
    solicitudesANUSource: ISolicitud[]=[];
    solicitudesDEPSource: ISolicitud[]=[];
    solicitudesESCSource: ISolicitud[]=[];
    solicitudesCPDSource: ISolicitud[]=[];
    solicitudesCEASource: ISolicitud[]=[];
    cols: any[];
    _solicitudSelected:string;
    solicitudSelected: ISolicitud;


    userL: ILoginResponse;
    usuario: IUser;
    usrTaller: ITaller;

    //_marcaSeleccionada: string;
    //_repuestoSeleccionado: string;
    //_repuestoSelected: IRepuesto[];
    //_aseguradoraSeleccionada: string;
    crearSolicitudTaller:FormGroup;

    codigo: string;
    marcasSource: IMarca[];
    aseguradoraSource: IAseguradora[];
    repuestos: IRepuesto[];
    solicitud: ISolicitud;
    
    piezas: SelectItem[]=[];
    marcasModelo: SelectItem[]=[];
    aseguradoras: SelectItem[]=[];
    
    constructor(private marcaService:MarcaService, private repuestoService:RepuestoService, private asegService: AseguradoraService, private solicitudService: SolicitudService,private alertService:AlertService,private router:Router){
        this.cols=[
            //{ field: 'id', header: 'numero' },
            { field: 'codigoSolicitud', header: 'codigoSolicitud' }
          ];
    }

    ngOnInit():void{
        console.log("Cargando ventana principal de crear solicitud...");
        
        this.solicitudesSource = [];
        this._solicitudSelected="";

        this.aseguradoraSource = [];
    
        //CARGANDO TODAS LAS SOLICITUDES
        this.solicitudService.consultarSolicitudesAll().subscribe({
            next: solicitudes => {
                this.solicitudesSource=solicitudes
                console.log("Lista de solicitudes registradas...");
                console.log(JSON.stringify(this.solicitudesSource));
              },
              error: err=>this.errorMessage=err
            });

        //CARGANDO LAS SOLICITUDES ANULADAS
        this.solicitudService.consultarSolByEstado("ANU").subscribe({
          next: solicitudes => {
              this.solicitudesANUSource=solicitudes
              console.log("Lista de solicitudes anuladas...");
              console.log(JSON.stringify(this.solicitudesANUSource));
            },
            error: err=>this.errorMessage=err
          });

           //CARGANDO LAS SOLICITUDES ESPACHADO POR PROVEEDOR (DEP)
        this.solicitudService.consultarSolByEstado("DEP").subscribe({
          next: solicitudes => {
              this.solicitudesDEPSource=solicitudes
              console.log("Lista de solicitudes DEP...");
              console.log(JSON.stringify(this.solicitudesDEPSource));
            },
            error: err=>this.errorMessage=err
          });

          //ENTREGADO A SATISFACCIÓN DEL CLIENTE (ESC)
          this.solicitudService.consultarSolByEstado("ESC").subscribe({
            next: solicitudes => {
                this.solicitudesESCSource=solicitudes
                console.log("Lista de solicitudes ESC...");
                console.log(JSON.stringify(this.solicitudesESCSource));
              },
              error: err=>this.errorMessage=err
            });

          //CERRADA POR DESIERTA (CPD)
          this.solicitudService.consultarSolByEstado("CPD").subscribe({
            next: solicitudes => {
                this.solicitudesCPDSource=solicitudes
                console.log("Lista de solicitudes CPD...");
                console.log(JSON.stringify(this.solicitudesCPDSource));
              },
              error: err=>this.errorMessage=err
            });

          //CERRADA POR ASEGURADORA (CEA)
          this.solicitudService.consultarSolByEstado("CEA").subscribe({
            next: solicitudes => {
                this.solicitudesCEASource=solicitudes
                console.log("Lista de solicitudes CEA...");
                console.log(JSON.stringify(this.solicitudesCEASource));
              },
              error: err=>this.errorMessage=err
            });

      }//CIERRE DE ONINIT
}