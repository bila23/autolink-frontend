import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { SolicitudtableroService } from './solicitudtablero.service'
import { IResultByStates } from '../_model/resultbystates.module'
import { SelectItem, Message } from 'primeng/api';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IResultUpdateModule } from '../_model/result-update.module';
import { IVerPiezaSoliModule } from '../_model/ver-pieza-soli.module';
import { IListRepuestosModule } from '../_model/list-repuestos.module';
import { stringify } from 'querystring';
import { format } from 'url';
import { IRepuesto } from '../_model/repuesto.model';

@Component({
  selector: 'app-container2',
  templateUrl: './container2.component.html',
  styleUrls: ['./container2.component.css']
})
export class Container2Component implements OnInit {
  registro: IResultByStates[]=[];
  _registroSelected: IResultByStates[];
  cols: any[];
  dialogVerSoli: boolean;
  dialogEditSoli: boolean;
  estadosSoli: SelectItem[];
  _estadoSoli: string;
  updateSoliForm: FormGroup;
  resultUpdateCometAsegu: IResultUpdateModule;


  dialogVerPieza: boolean;
  cols_verpiezas: any[];
  verpiezaSoli: SelectItem[];
  viewSoliForm: FormGroup;
  _viewSoliSelected: IListRepuestosModule;
  // registroview: IRepuesto[]=[];
  registroview: IListRepuestosModule[]=[];
  _registroviewSelected: IRepuesto[];
  
  registroViewPiezaSoli: IVerPiezaSoliModule[]=[];

  constructor(private solicitudService:SolicitudtableroService, private el: ElementRef) { 
    this.updateSoliForm = new FormGroup({
      id: new FormControl('',Validators.required),
      NoReclamo: new FormControl('',Validators.required),
      placa: new FormControl(''),
      chasis: new FormControl(''),
      motor: new FormControl(''),
      comentariosAseguradora: new FormControl(''),
      estado: new FormControl(''),
      fechaInicio: new FormControl(''),
      fechaFin: new FormControl('')
    });

    this.viewSoliForm = new FormGroup({
      id: new FormControl(''),
      nombre: new FormControl(''),
      valor: new FormControl(0),
      usuariocreacion: new FormControl(''),
      estado: new FormControl(''),
      fechacreacion: new FormControl(''),
      idRepuesto: new FormControl(''),
      idSolicitud: new FormControl('')
    })
  }

  ngOnInit() {
    console.log("entramos en container para perfil de no adm");
    this.BuildStatus("ing");
  }

  BuildStatus(estado:string){
    console.log("BuildStatus: " + estado);
    console.log("construir tabla para solicitudes ingresadas");
    //INGRESADA (ING)
    this.solicitudService.getSolicitudesByStatus(estado).subscribe({
      next: registro =>{
        this.registro=registro;
        console.log("console.. buildstatus_ingresadas");
        console.log(registro);
      }
    })

    this.cols = [];
    this.cols=[
      { field: 'fechaInicio', header: 'Fecha' },
      { field: 'codigoSolicitud', header: 'codigoSolicitudas' },
      { field: 'id', header: 'id' },
      { field: 'placa', header: 'placa'},
      { field: 'chasis', header: 'chasis' },
      { field: 'motor', header: 'motor' },
      { field: 'comentariosTaller', header: 'comentariosTaller' },
      { field: 'comentariosAseguradora', header: 'comentariosAseguradora' }
    ];

    this.ChangeUlSelected(estado);
  }

  ChangeUlSelected(estado:string){
    let a_ing = document.getElementById("a_ing");
    let a_coa =document.getElementById("a_coa");
    let a_pea =document.getElementById("a_pea");
    let a_cea =document.getElementById("a_cea");
    let a_goc =document.getElementById("a_goc");

    /*removemos la clase active */
    a_ing.classList.remove("active");
    a_coa.classList.remove("active");
    a_pea.classList.remove("active");
    a_cea.classList.remove("active");
    a_goc.classList.remove("active");
    /*fin removemos la clase active */

    if (estado.toLowerCase() === "ing"){
      a_ing.classList.add("active");
    }else if (estado.toLowerCase() === "coa"){
      a_coa.classList.add("active");
    }else if (estado.toLowerCase() === "pea"){
      a_pea.classList.add("active");
    }else if (estado.toLowerCase() === "cea"){
      a_cea.classList.add("active");
    }else if (estado.toLowerCase() === "goc"){
      a_goc.classList.add("active");
    }
  }
  

  AceptarSoli(){
    console.log("click en boton para aceptar solicitud");

    let comentariosAseguradora = this.updateSoliForm.get("comentariosAseguradora").value;
    let id = this.updateSoliForm.get("id").value;
    let estado = this.updateSoliForm.get("estado").value;
    console.log("Estado actual: " + estado);
    console.log(comentariosAseguradora);

    this.solicitudService.SetComentariosAseguradora(id, comentariosAseguradora).subscribe({
      next: result =>{
        this.resultUpdateCometAsegu=result[0];
        console.log("resultadoAceptarSoli...");
        console.log(result);

        let estado_next = "";
        estado_next = this.solicitudService.Next_Step(estado);
        console.log("Estado next: " + estado_next);

        if (estado_next!==""){
          this.solicitudService.SetProcesarSoli(id, estado_next).subscribe({
            next: result =>{
              this.resultUpdateCometAsegu=result[0];
              console.log("update estado...");
              console.log(result);
              //refrescar toda la vista pendiente de preguntar
              console.log("volver a construir la vista....");
              this.BuildStatus(estado_next.toUpperCase());
              this.dialogEditSoli = false;
            }
          });
        }
      }
    })
  }

  EditarSolicitud(){
    console.log("Editar solicitud");
    this.estadosSoli=[
      {label:'', value:null},
      {label:'Activo', value:"Activo"},
      {label:'Inactivo', value:"Inactivo"}
    ];

    console.log(this._registroSelected);

    if (typeof this._registroSelected !== typeof undefined){
      console.log("id selected: " + this._registroSelected[0].id);

      this.dialogEditSoli = true;
      this.updateSoliForm.controls["id"].setValue(this._registroSelected[0].id);
      this.updateSoliForm.controls["NoReclamo"].setValue(this._registroSelected[0].codigoSolicitud);
      this.updateSoliForm.controls["placa"].setValue(this._registroSelected[0].placa);
      this.updateSoliForm.controls["chasis"].setValue(this._registroSelected[0].chasis);
      this.updateSoliForm.controls["motor"].setValue(this._registroSelected[0].motor);
      this.updateSoliForm.controls["comentariosAseguradora"].setValue(this._registroSelected[0].comentariosAseguradora);
      this.updateSoliForm.controls["estado"].setValue(this._registroSelected[0].estado);
      this.updateSoliForm.controls["fechaInicio"].setValue(this._registroSelected[0].fechaInicio);
      this.updateSoliForm.controls["fechaFin"].setValue(this._registroSelected[0].fechaFin);
    }
  }

  VerPiezasSolicitud(){
    this.registroview = [];
    console.log("Ver piezas solicitud");
    this.verpiezaSoli=[
      {label:'', value:null},
      {label:'Activo', value:"Activo"},
      {label:'Inactivo', value:"Inactivo"}
    ];

    console.log(this._registroSelected);

    if (typeof this._registroSelected !== typeof undefined){
      console.log("id selected: " + this._registroSelected[0].id);
      let id_selected = this._registroSelected[0].id;

      this.dialogVerPieza = true;
      this.solicitudService.getPiezasSoli(id_selected.toString()).subscribe({
        next: registro =>{

          for(let re in registro){
            //this.registroview.push(registro[re].repuesto);
            this.registroview.push(registro[re]);
            console.log("Console... ver piezas");
            
            console.log(registro[re].repuesto);
            console.log(registro[re]);
          }
        }
      })

      this.cols_verpiezas = [];
      this.cols_verpiezas=[
        { field: "repuesto", subfield: "nombre"},
        { field: "repuesto", subfield: "valor" },
        { field: "aplica", header: "aplica" }
      ]
    }
  }

  Anular(){
    let id = this.updateSoliForm.get("id").value;
    let estado = "ANU";
    this.solicitudService.SetProcesarSoli(id, estado).subscribe({
      next: result =>{
        this.resultUpdateCometAsegu=result[0];
        console.log("actualizado a ANULADO");
        this.BuildStatus(estado.toUpperCase());
        this.dialogEditSoli = false;
      }
    });
  }

  CerrarAseguradora(){
    console.log("CerrarAseguradora...");
    let id = this.updateSoliForm.get("id").value;
    let estado = "CEA";
    this.solicitudService.SetProcesarSoli(id, estado).subscribe({
      next: result =>{
        this.resultUpdateCometAsegu=result[0];
        console.log("actualizado a ANULADO");
        this.BuildStatus(estado.toUpperCase());
        this.dialogEditSoli = false;
      }
    });
  }

  SetRepuestoSoli(col:any[], isChecked: boolean){
    console.log("Funtion SetRepuestoSoli...");
    console.log(col);
    let id_solicitud = this._registroSelected[0].id;
    let idRepuesto = col["repuesto"]["id"];
    let estado = "";
    let aplica = isChecked;

    console.log("id_sol:" + id_solicitud);
    console.log("id_repuesto:" + idRepuesto);
    console.log("aplica: " + isChecked);
    
    this.solicitudService.SetAplicaRepuesto(id_solicitud, idRepuesto, estado, aplica).subscribe({
      next: result =>{
        console.log("solicitud de repuesto realizada");
        //this.dialogVerPieza = false;
      }
    });
  }
}
