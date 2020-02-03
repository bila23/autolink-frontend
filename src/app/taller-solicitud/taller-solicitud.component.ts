import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { SolicitudtableroService } from '../container2/solicitudtablero.service'
import { IResultByStates } from '../_model/resultbystates.module'
import {SelectItem, Message} from 'primeng/api';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-taller-solicitud',
  templateUrl: './taller-solicitud.component.html',
  styleUrls: ['./taller-solicitud.component.css']
})
export class TallerSolicitudComponent implements OnInit {
  registro: IResultByStates[]=[];
  _registroSelected: IResultByStates[];
  cols: any[];
  dialogVerSoli: boolean;
  dialogEditSoli: boolean;
  estadosSoli: SelectItem[];
  _estadoSoli: string;
  updateSoliForm: FormGroup;

  constructor(private solicitudService:SolicitudtableroService, private el: ElementRef) {
    this.updateSoliForm = new FormGroup({
      id: new FormControl('',Validators.required),
      NoReclamo: new FormControl('',Validators.required),
      placa: new FormControl(''),
      chasis: new FormControl(''),
      motor: new FormControl(''),
      comentariosAseguradora: new FormControl('')
    });
  }

  ngOnInit() {
    console.log("entramos en container para perfil de no adm");
    this.BuildStatus("ING");
  }

  BuildStatus(estado:string){
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
      { field: 'motor', header: 'motor' }
    ];

    this.ChangeUlSelected(estado);
  }

  ChangeUlSelected(estado:string){
    let a_ing = document.getElementById("a_ing");
    let a_anu =document.getElementById("a_anu");
    let a_dep =document.getElementById("a_dep");
    let a_esc =document.getElementById("a_esc");
    let a_cpd =document.getElementById("a_cpd");

    /*removemos la clase active */
    a_ing.classList.remove("active");
    a_anu.classList.remove("active");
    a_dep.classList.remove("active");
    a_esc.classList.remove("active");
    a_cpd.classList.remove("active");
    /*fin removemos la clase active */

    if (estado.toLowerCase() === "ING"){
      a_ing.classList.add("active");
    }else if (estado.toLowerCase() === "ANU"){
      a_anu.classList.add("active");
    }else if (estado.toLowerCase() === "DEP"){
      a_dep.classList.add("active");
    }else if (estado.toLowerCase() === "ESC"){
      a_esc.classList.add("active");
    }else if (estado.toLowerCase() === "CPD"){
      a_cpd.classList.add("active");
    }
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
    }
  }

}