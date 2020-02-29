import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IResultByStates } from '../_model/resultbystates.module'
import { SolicitudtableroprovService } from './solicitudtableroprov.service'
import { IListRepuestosModule } from '../_model/list-repuestos.module';
import { SelectItem, Message } from 'primeng/api';

@Component({
  selector: 'app-container4',
  templateUrl: './container4.component.html',
  styleUrls: ['./container4.component.css']
})
export class Container4Component implements OnInit {
  registro: IResultByStates[]=[];
  cols: any[];
  dialogEditSoli: boolean;
  dialogVerPieza: boolean;
  registroview: IListRepuestosModule[]=[];
  verpiezaSoli: SelectItem[];
  _registroSelected: IResultByStates[];
  cols_verpiezas: any[];
  updateSoliForm: FormGroup;
  viewSoliForm: FormGroup;
  constructor(private solicitudService:SolicitudtableroprovService) { 
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
    this.BuildStatus("COA");
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
      // { field: 'id', header: 'id' },
      { field: 'placa', header: 'placa'},
      { field: 'chasis', header: 'chasis' },
      { field: 'motor', header: 'motor' },
      // { field: 'comentariosTaller', header: 'comentariosTaller' },
      { field: 'comentariosAseguradora', header: 'comentariosAseguradora' }
    ];

    this.ChangeUlSelected(estado);
  }

  ChangeUlSelected(estado:string){
    let a_coa =document.getElementById("a_coa");
    let a_goc =document.getElementById("a_goc");
    let a_dep =document.getElementById("a_dep");

    /*removemos la clase active */
    a_coa.classList.remove("active");
    a_goc.classList.remove("active");
    a_dep.classList.remove("active");
    /*fin removemos la clase active */

    if (estado.toLowerCase() === "coa"){
      a_coa.classList.add("active");
    }else if (estado.toLowerCase() === "goc"){
      a_goc.classList.add("active");
    }else if (estado.toLowerCase() === "dep"){
      a_dep.classList.add("active");
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
        { field: "repuesto", subfield: "valor" }//,
        // { field: "aplica", header: "aplica" }
      ]
    }
  }

  EditarSolicitud(){
    console.log("Editar solicitud");
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
      // this.updateSoliForm.controls["estado"].setValue(this._registroSelected[0].estado);
      // this.updateSoliForm.controls["fechaInicio"].setValue(this._registroSelected[0].fechaInicio);
      // this.updateSoliForm.controls["fechaFin"].setValue(this._registroSelected[0].fechaFin);
    }
  
  }

  AceptarSoli(){

  }
}
