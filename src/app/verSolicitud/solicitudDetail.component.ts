import { Component, ViewChild, ElementRef, Renderer2, ViewContainerRef, AfterViewInit, OnInit } from '@angular/core';
import {ActivatedRoute,Router} from '@angular/router'; //activar navegacion de paginas por medio de parametros y por boton 
import { SolicitudService } from '../crearSolicitud/solicitud.service';
import { ISolicitud } from '../_model/solicitud.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IRepuestoXSol } from '../_model/repuestpoXSoli.model';
import { Message, SelectItem } from 'primeng/api';
import { AlertService } from '../alert/alert.service';
import { ILoginResponse } from '../_model/loginResponse.model';
import { staticViewQueryIds } from '@angular/compiler';
import { isGeneratedFile } from '@angular/compiler/src/aot/util';

@Component({ /* no podemos selector porque no lo sera un componente nested, sino que será una nueva pagina a mostrar por medio de enrutamiento*/
    templateUrl:'./solicitudDetail.component.html'
})
export class SolicitudDetailComponent implements OnInit{
    errorMessage:string;
    pageTitle: string = 'Detalle de solicitud';
    solicitudSeleccionada: ISolicitud;
    repXSolicitud: IRepuestoXSol[] = [];
    solicitudTaller:FormGroup;
    msgs: Message[] = [];
    userLog: ILoginResponse;
    repuestos: SelectItem[]=[];
    images: any[];

    constructor(private route:ActivatedRoute, private router:Router, private solicitudService:SolicitudService,private alertService:AlertService,private renderer: Renderer2){
        this.solicitudTaller = new FormGroup({
            codigoSol: new FormControl('',Validators.required),
            nombre: new FormControl('',Validators.required),
            marca: new FormControl('',Validators.required),
            modelo: new FormControl('',Validators.required),
            anho: new FormControl('',Validators.required),
            tipoV: new FormControl('',Validators.required),
            placa: new FormControl('',Validators.required),
            chasis: new FormControl('',Validators.required),
            motor: new FormControl('',Validators.required),
            siniestro: new FormControl('',Validators.required),
            poliza: new FormControl('',Validators.required),
            aseguradora: new FormControl('',Validators.required),
            tiempo: new FormControl('',Validators.required),
            repuestos: new FormControl('',Validators.required),
            images: new FormControl('',Validators.required),
            comentarios: new FormControl('',Validators.required)
        });

    }

    ngOnInit(){
        this.images = [];
        let codigoSolicitud =this.route.snapshot.paramMap.get('codigoSolicitud');
        let id = +this.route.snapshot.paramMap.get('id');
        console.log("Cargando el detalle de la solicitud: " + codigoSolicitud+ " id:" + id);
        this.pageTitle += `: ${codigoSolicitud}`;
        this.consultarSolicitud(codigoSolicitud, id);
        this.consultaRepsBySol(codigoSolicitud, id);
    }

    consultarSolicitud(codigoSolicitud: string, id: number){
         //CARGANDO LA INFORMACION DE LA SOLICITUD SELECCIONADA

         this.userLog = JSON.parse(JSON.parse(JSON.stringify(localStorage.getItem('currentUser'))));
         console.log("detalle de la solicitud:  " + JSON.stringify(this.userLog));

         this.solicitudService.consultarSolicitudByCode(codigoSolicitud).subscribe({
            next: solicitud => {
                if(solicitud != null){
                    //llenamos el formulario con la informacion de la solicitud consultada
                    if(this.userLog.tipo=="taller"){
                        this.solicitudTaller.controls['codigoSol'].setValue(solicitud.codigoSolicitud);
                        this.solicitudTaller.controls['nombre'].setValue(solicitud.nombreAsegurado);                        
                        this.solicitudTaller.controls['marca'].setValue(solicitud.idMarca.nombre);
                        this.solicitudTaller.controls['modelo'].setValue("");
                        this.solicitudTaller.controls['anho'].setValue(solicitud.anioCarro);
                        this.solicitudTaller.controls['tipoV'].setValue(solicitud.tipoVehiculo);
                        this.solicitudTaller.controls['placa'].setValue(solicitud.placa);
                        this.solicitudTaller.controls['chasis'].setValue(solicitud.chasis);
                        this.solicitudTaller.controls['motor'].setValue(solicitud.motor);
                        this.solicitudTaller.controls['siniestro'].setValue(solicitud.siniestro);
                        this.solicitudTaller.controls['poliza'].setValue(solicitud.poliza);
                        this.solicitudTaller.controls['aseguradora'].setValue(solicitud.idAseguradora.nombre);
                        this.solicitudTaller.controls['tiempo'].setValue(solicitud.fechaFin);
                        this.solicitudTaller.controls['comentarios'].setValue(solicitud.comentariosTaller);
                    }// fin de if validando si el usuario es un taller
                }
              },
              error: err=>{
                //this.errorMessage=err,
                this.msgs = [];
                this.msgs.push({severity:'danger', summary:'Error', detail:'No se ha podido completar su consulta. Intente mas tarde'});
                this.alertService.error("No se ha podido completar su consulta. Intente mas tarde.");
                setTimeout(() => {}, 3000);
                //this.ngOnInit();
            }
            });
      }//CIERRE DE consultarSolicitud

      consultaRepsBySol(codigoSolicitud: string, id: number){
        this.solicitudService.consultarRepXSol(id).subscribe({
            next: repXSol => {
                if(repXSol != null){
                    this.repXSolicitud=repXSol;
                    for(let key in this.repXSolicitud){
                        console.log("Leemos los repuestos");
                        if(this.repXSolicitud.hasOwnProperty(key)){
                            this.repuestos.push({label: this.repXSolicitud[key].repuesto.nombre, value: {id:this.repXSolicitud[key].repuesto.id,nombre:this.repXSolicitud[key].repuesto.nombre}});
                        }
                    }
                    console.log("repuestos: " + JSON.stringify(this.repuestos));
                }
            }
        });
      }    
}