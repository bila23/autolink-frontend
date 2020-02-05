import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { SolicitudtableroService } from '../container2/solicitudtablero.service'
import { tallerSolicitudService } from './taller-solicitud.service'
import { IResultByStates } from '../_model/resultbystates.module'
import {SelectItem, Message} from 'primeng/api';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IResultUpdateModule } from '../_model/result-update.module'

@Component({
  selector: 'app-taller-solicitud',
  templateUrl: './taller-solicitud.component.html',
  styleUrls: ['./taller-solicitud.component.css']
})
export class TallerSolicitudComponent implements OnInit {
  registro: IResultByStates[]=[];
  _registroSelected: IResultByStates[];
  cols: any[];
  dialogEditSoli: boolean;
  dialogEstado: boolean;
  estadosSoli: SelectItem[];
  _estadoSoli: string;
  updateSoliForm: FormGroup;
  estadoSolForm: FormGroup;
  resultUpdateCometAsegu: IResultUpdateModule;

  constructor(private solicitudService:SolicitudtableroService, private el: ElementRef, private tallerService : tallerSolicitudService) {
    this.estadoSolForm = new FormGroup({});
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
    this.BuildStatus("ING");
  }

  BuildStatus(estado:string){
    this.solicitudService.getSolicitudesByStatus(estado).subscribe({
      next: registro =>{
        this.registro=registro;
      }
    })

    this.cols = [];
    this.cols=[
      { field: 'nombreAsegurado', header: 'Propietario' },
      { field: 'tipoVehiculo', header: 'Tipo' },
      { field: 'siniestro', header: 'Siniestro' },
      { field: 'motor', header: 'Motor' },
      { field: 'placa', header: 'Placa' }
    ];

    this.ChangeUlSelected(estado);
  }

  ChangeUlSelected(estado:string){
    let a_ing = document.getElementById("a_ing");
    let a_anu =document.getElementById("a_anu");
    let a_dep =document.getElementById("a_dep");
    let a_esc =document.getElementById("a_esc");
    let a_cpd =document.getElementById("a_cpd");
    let a_cea =document.getElementById("a_cea");

    /*removemos la clase active */
    a_ing.classList.remove("active");
    a_anu.classList.remove("active");
    a_dep.classList.remove("active");
    a_esc.classList.remove("active");
    a_cpd.classList.remove("active");
    a_cea.classList.remove("active");
    /*fin removemos la clase active */

    if (estado.toLowerCase() === "ing"){
      a_ing.classList.add("active");
      this.hideCesta();
    }else if (estado.toLowerCase() === "anu"){
      a_anu.classList.add("active");
      this.hideCesta();
    }else if (estado.toLowerCase() === "dep"){
      a_dep.classList.add("active");
      this.hideCesta();
      this.showCesta();    
    }else if (estado.toLowerCase() === "esc"){
      a_esc.classList.add("active");
      this.hideCesta();
    }else if (estado.toLowerCase() === "cpd"){
      a_cpd.classList.add("active");
      this.hideCesta();
    }else if (estado.toLowerCase() === "cea"){
      a_cea.classList.add("active");
      this.hideCesta();
    }
  }

  hideCesta(){
    var cesta = document.getElementById('cesta');
    cesta.classList.remove("show");
    cesta.classList.add("hide");
  }
  showCesta(){
    var cesta = document.getElementById('cesta');
    cesta.classList.remove("hide");
    cesta.classList.add("show");
  }

  MostrarAlerta(){
    if (typeof this._registroSelected !== typeof undefined)
      this.dialogEstado = true;
  }

  hideDialogEstado(){
    this.dialogEstado = false;
  }

  CambiarEstado(){
    if (typeof this._registroSelected !== typeof undefined){
      let id = this._registroSelected[0].id;
      this.tallerService.SetEstado(id, 'ESC').subscribe({
        next: result =>{
          this.resultUpdateCometAsegu=result[0];
          this.hideDialogEstado();
          this.ChangeUlSelected('ESC');
        } 
      })
    }
  }

  EditarSolicitud(){
    this.estadosSoli=[
      {label:'', value:null},
      {label:'Activo', value:"Activo"},
      {label:'Inactivo', value:"Inactivo"}
    ];


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