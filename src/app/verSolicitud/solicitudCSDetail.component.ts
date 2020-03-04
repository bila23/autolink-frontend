import { Component, ViewChild, ElementRef, Renderer2, ViewContainerRef, AfterViewInit, OnInit } from '@angular/core';
import {ActivatedRoute,Router} from '@angular/router'; //activar navegacion de paginas por medio de parametros y por boton 
import { SolicitudService } from '../crearSolicitud/solicitud.service';
import { ISolicitud } from '../_model/solicitud.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IRepuestoXSol } from '../_model/repuestpoXSoli.model';
import { Message } from 'primeng/api';
import { AlertService } from '../alert/alert.service';
import { ILoginResponse } from '../_model/loginResponse.model';
import { staticViewQueryIds } from '@angular/compiler';
import { isGeneratedFile } from '@angular/compiler/src/aot/util';

@Component({ /* no podemos selector porque no lo sera un componente nested, sino que será una nueva pagina a mostrar por medio de enrutamiento*/
    templateUrl:'./solicitudCSDetail.component.html'
})
export class SolicitudCSDetailComponent implements OnInit{
    errorMessage:string;
    pageTitle: string = 'Detalle de solicitud';
    solicitudSeleccionada: ISolicitud;
    solicitudAct: ISolicitud;
    repXSolicitud: IRepuestoXSol[] = [];
    solicitudTaller:FormGroup;
    msgs: Message[] = [];
    userLog: ILoginResponse;
    id: number;

    //@ViewChild("codigoSol",{static:true}) tref: ElementRef;
    @ViewChild("codigoSol",{static:true}) element: ElementRef;

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
            cantidadRep: new FormControl('',Validators.required),
            comentarios: new FormControl('',Validators.required)
        });

    }

    ngOnInit(){
        let codigoSolicitud =this.route.snapshot.paramMap.get('codigoSolicitud');
        this.id = +this.route.snapshot.paramMap.get('id');
        console.log("Cargando el detalle de la solicitud: " + codigoSolicitud+ " id:" + this.id);
        this.pageTitle += `: ${codigoSolicitud}`;
        this.consultarSolicitud(codigoSolicitud, this.id);
    }

   /* ngAfterViewInit(): void {
        // outputs `I am span`
        console.log(this.tref.nativeElement.textContent);
    }*/
 

    consultarSolicitud(codigoSolicitud: string, id: number){
         //CARGANDO LA INFORMACION DE LA SOLICITUD SELECCIONADA

         this.userLog = JSON.parse(JSON.parse(JSON.stringify(localStorage.getItem('currentUser'))));
         console.log("detalle de la solicitud:  " + JSON.stringify(this.userLog));

         this.solicitudService.consultarSolicitudByCode(codigoSolicitud).subscribe({
            next: solicitud => {
                if(solicitud != null){
                  /*  this.solicitudService.consultarRepXSol(id).subscribe({
                        next: repXSol => {
                            if(repXSol != null){
                                this.repXSolicitud=repXSol;
                                console.log("Solicitud a revisar.... ");
                                console.log(JSON.stringify(this.solicitudSeleccionada));
                                console.log("Repuestos.... ");
                                console.log(JSON.stringify(this.repXSolicitud));*/
                                //llenamos el formulario con la informacion de la solicitud consultada
                                if(this.userLog.tipo=="taller"){
                                    this.solicitudTaller.controls['codigoSol'].setValue(solicitud.codigoSolicitud);
                                    this.solicitudTaller.controls['nombre'].setValue(solicitud.nombreAsegurado);  
                                    this.renderer.setAttribute(this.element.nativeElement,"enabled","true");                         
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
                                    
                                /* for(let key in this.repXSolicitud){
                                        console.log("Leemos los repuestos");
                                        if(this.repXSolicitud.hasOwnProperty(key)){
                                            this.solicitudTaller.controls['repuestos'].setValue(this.repXSolicitud[key].repuesto);
                                            this.solicitudTaller.controls['cantidadRep'].setValue(this.repXSolicitud[key].solicitud);
                                        }
                                }*/
                                    this.solicitudTaller.controls['comentarios'].setValue(solicitud.comentariosTaller);
                                }// fin de if validando si el usuario es un taller
                           /* }else{
                                this.msgs = [];
                                this.msgs.push({severity:'danger', summary:'Error', detail:'No se hay repuestos para la solicitud seleccionada'});
                                this.alertService.error("No se han encontrado repuestos para esta solicitud. Intente mas tarde");
                                setTimeout(() => {}, 3000);
                                //this.ngOnInit();
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
                    });*/
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

      updateStatusSolicitud(estado:string){

       
      this.solicitudService.updateStSolicitud(estado,this.id).subscribe({
        next: solicitudAct => {
            this.solicitudAct=solicitudAct;
            console.log("Obteniendo la informacion de la solicitud actualizada...");
            if(this.solicitudAct && this.solicitudAct != null){
                console.log("Codigo de la solicitud: " + JSON.stringify(this.solicitudAct.codigoSolicitud));
                //GUARDAMOS LOS RESPUESTOS DE LA SOLICITUD INGRESADA, UN LLAMADO POR TIPO DE REPUESTO
            }else{
              this.msgs = [];
              this.msgs.push({severity:'danger', summary:'Error', detail:''});
              this.alertService.error("No se ha podido almacenar el repuesto.");
              setTimeout(() => {}, 3000);
              this.ngOnInit();
            }
          },error: err=>{
            //this.errorMessage=err,
            this.msgs = [];
            this.msgs.push({severity:'danger', summary:'Error', detail:'No se ha podido completar su consulta. Intente mas tarde'});
            this.alertService.error("No se ha podido completar su consulta. Intente mas tarde.");
            setTimeout(() => {}, 3000);
            //this.ngOnInit();
        }
        });
      }
      
      
    onBack(): void{
        this.router.navigate(['/verSolicitud']);
    }
}