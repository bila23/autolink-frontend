import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { SolicitudtableroService } from './solicitudtablero.service'
import { IResultByStates } from '../_model/resultbystates.module'
import {SelectItem, Message} from 'primeng/api';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IResultUpdateModule } from '../_model/result-update.module'
import { stringify } from 'querystring';

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

  constructor(private solicitudService:SolicitudtableroService, private el: ElementRef) { 
    this.updateSoliForm = new FormGroup({
      id: new FormControl('',Validators.required),
      NoReclamo: new FormControl('',Validators.required),
      placa: new FormControl(''),
      chasis: new FormControl(''),
      motor: new FormControl(''),
      comentariosAseguradora: new FormControl(''),
      estado: new FormControl('')
    });
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
      { field: 'codigoSolicitud', header: 'codigoSolicitud' },
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
}
