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
  templateUrl:'./solicitudProveedor.component.html'
})
export class SolicitudProveedorComponent implements OnInit{
    msgs: Message[] = [];
    errorMessage:string;
    solicitudesSource: ISolicitud[]=[];
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
      }//CIERRE DE ONINIT
}