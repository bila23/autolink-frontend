import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IResultByStates } from '../_model/resultbystates.module'
import { SolicitudtableroprovService } from './solicitudtableroprov.service'
import { IListRepuestosModule } from '../_model/list-repuestos.module';
import { IListPiezasModule } from '../_model/list-piezas.module'
import { SelectItem, Message } from 'primeng/api';
import { $ } from 'protractor';
import { SolicitudtableroService } from '../container2/solicitudtablero.service'
import { AlertService } from '../alert/alert.service';

@Component({
  selector: 'app-container4',
  templateUrl: './container4.component.html',
  styleUrls: ['./container4.component.css']
})
export class Container4Component implements OnInit {
  registro: IResultByStates[]=[];
  _registroSelected: IResultByStates[];
  msgs: Message[] = [];
  registro_viewpieza: IListPiezasModule[]=[];
  cols: any[];
  dialogEditSoli: boolean;
  dialogVerPieza: boolean;  
  registroview: IListRepuestosModule[]=[];
  _registroviewSelected: IListRepuestosModule[];
  verpiezaSoli: SelectItem[];  
  cols_verpiezas: any[];
  cols_verpiezas_prov: any[];
  updateSoliForm: FormGroup;
  viewSoliForm: FormGroup;
  setOferta: FormGroup;

  constructor(private alertService: AlertService, private solicitudService:SolicitudtableroprovService, private solicitudService_estatus:SolicitudtableroService) { 
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

    this.setOferta = new FormGroup({
      id: new FormControl(''),
      idsolicitud: new FormControl(''),
      idrepuesto: new FormControl(''),
      idproveedor: new FormControl(''),
      cantidad: new FormControl(''),      
      estado: new FormControl(''),
      tiempo: new FormControl(''),
      ganador: new FormControl(''),
      precio: new FormControl('')
    })

    this.viewSoliForm = new FormGroup({
      id: new FormControl(''),
      nombre: new FormControl(''),
      valor: new FormControl(0),
      usuariocreacion: new FormControl(''),
      estado: new FormControl(''),
      fechacreacion: new FormControl(''),
      idRepuesto: new FormControl(''),
      idSolicitud: new FormControl(''),
      precio: new FormControl(0),
      fecha: new FormControl(0)
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
    console.log("Ver piezas solicitud container 4");
    
    let idprov = localStorage.getItem("idUser").toString();;
    this.verpiezaSoli=[
      {label:'', value:null},
      {label:'Activo', value:"Activo"},
      {label:'Inactivo', value:"Inactivo"}
    ];

    console.log(this._registroSelected);

    if (typeof this._registroSelected !== typeof undefined){
      console.log("id selected: " + this._registroSelected[0].id);
      let id_selected = this._registroSelected[0].id;
      console.log(id_selected);
      this.dialogVerPieza = true;
      
      this.solicitudService.getPiezasSoli(id_selected.toString()).subscribe({
        next: registro =>{

          for(let re in registro){
            //this.registroview.push(registro[re].repuesto);
            this.registroview.push(registro[re]);           
          }
        }
      })

      // this.solicitudService.getPiezaSoliProv(id_selected.toString(), idprov.toString()).subscribe({
      //   next: registro =>{
      //     for(let re in registro){
      //       this.registroview.push(registro[re]);
      //       console.log(registro[re]);
      //     }
      //   }
      // })

      console.log(this.registroview);
      this.cols_verpiezas = [];
      this.cols_verpiezas=[
        { field: "repuesto", subfield: "nombre"},
        { field: "solicitud", subfield: "tipoVehiculo" },
        { field: "solicitud", subfield: "anioCarro" }        
      ]
      console.log(this.cols_verpiezas);
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
    console.log("aceptar soli");
    let id ="";
    let comentario = "";

    if (typeof this._registroSelected !== typeof undefined){
      id = this.updateSoliForm.get("id").value.toString();
      comentario = this.updateSoliForm.get("comentariosAseguradora").value.toString();
      console.log("Se escribio el comentario: "+comentario);
      this.solicitudService_estatus.SetComentariosAseguradora(Number(id), comentario).subscribe({
        next: result =>{          
          this.msgs = [];
          this.msgs.push({ severity: 'success', summary: 'El comentario ha sido guardado.', detail: '' });
          this.alertService.success("El comentario ha sido guardado.");
          this.dialogEditSoli = false;
          this.updateSoliForm.controls["comentariosAseguradora"].setValue("");
          this._registroSelected = [];
          this.ngOnInit();
        }
      });
    }    
  }

  saveRow(){                   
      
      console.log(this._registroSelected[0]);
      let idsolicitud = this._registroSelected[0].id;
      let idrepuesto = this.setOferta.get("idrepuesto").value;
      let idproveedor = localStorage.getItem("idUser").toString();
      let estado = "COA";
      let ganador = false;
      let precio = this.setOferta.get("precio").value;
      let tiempo = this.setOferta.get("tiempo").value;
      let cantidad = this.setOferta.get("cantidad").value;

      this.solicitudService.setOfertaSave(Number(idsolicitud), Number(idrepuesto), Number(idproveedor), Number(cantidad), estado, Number(tiempo), ganador, Number(precio)).subscribe({
        next: registro =>{
          console.log(registro);
            this.msgs = [];
            this.msgs.push({ severity: 'success', summary: 'Los datos han sido guardados.', detail: '' });
            this.alertService.success("Los datos han sido guardados.");
        }
      });

      //this.dialogVerPieza = true;
      this.VerPiezasSolicitud();     
  }

  onSelectionChange(obj: any[]) {  
    console.log("on selection change");
    console.log(this._registroviewSelected);
    
    if (this._registroviewSelected[0] != undefined && this._registroviewSelected[0] != null){
      console.log("entre if");
      // console.log(this._registroSelected[0].id);
      // console.log(this._registroviewSelected[0].repuesto.id);
      // console.log(localStorage.getItem("idUser").toString());
      
      this.setOferta.controls["idrepuesto"].setValue(this._registroviewSelected[0].repuesto.id);
      
      const id_soli = this._registroSelected[0].id.toString();
      const id_prov = localStorage.getItem("idUser").toString();
      const id_repuesto = this._registroviewSelected[0].repuesto.id;

      this.solicitudService.getPiezaSoliProv(id_soli, id_prov).subscribe({
        next: result =>{     
          for(let re in result){
            //this.registroview.push(registro[re].repuesto);
            if (result[re].idRepuesto === id_repuesto){
              let cantidad = result[re].cantidad;
              let precio = result[re].precio;
              let tiempo = result[re].tiempo;

              if (cantidad === null || cantidad === undefined){
                cantidad = 0;
              }
              if (precio === null || precio === undefined){
                precio = 0;
              }
              if (tiempo === null || tiempo === undefined){
                tiempo = 0;
              }

              this.setOferta.controls["cantidad"].setValue(cantidad);
              this.setOferta.controls["precio"].setValue(precio);
              this.setOferta.controls["tiempo"].setValue(tiempo);

            }
          }
        }
      });

    }else{
      console.log("entre else");
      this.setOferta.controls["idrepuesto"].setValue(-1);
      
      this.setOferta.controls["cantidad"].setValue("");
      this.setOferta.controls["precio"].setValue("");
      this.setOferta.controls["tiempo"].setValue("");
    }
    
    console.log("id repuesto selected");
    console.log(this.setOferta.get("idrepuesto").value);
 }

  // isRowDisabled(data: any): boolean {
  //   return data.color === 'orange'
  // }
}
