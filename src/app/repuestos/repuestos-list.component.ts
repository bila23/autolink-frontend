import {Component,OnInit} from '@angular/core';
import {SelectItem, Message} from 'primeng/api';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IRepuesto } from '../_model/repuesto.model';
import { RepuestoService } from './repuestos.service';
import { AlertService } from '../alert/alert.service';

@Component({
  templateUrl:'./repuestos-list.component.html'
  //styleUrls:['./product-list.component.css']
})
export class RepuestoListComponent implements OnInit{
  msgs: Message[] = [];
  repuestos: IRepuesto[]=[];
  _repuestoSelected: IRepuesto[];
  _estadoRepuesto: string;
  estadosRepuesto: SelectItem[];
  estado:boolean;

  errorMessage:string;
  displayDialog:boolean;
  dialogVerRep: boolean;
  dialogEditRep: boolean;
  
  cols: any[];

  registrarRepForm:FormGroup;
  verRepForm: FormGroup;
  updateRepForm: FormGroup;

constructor(private repuestoService:RepuestoService,private alertService:AlertService){
  this.cols=[
    { field: 'id', header: 'numero' },
    { field: 'nombre', header: 'nombre' },
    { field: 'valor', header: 'valor' }
  ];

  this.registrarRepForm = new FormGroup({
    nombre: new FormControl('',Validators.required),
    valor: new FormControl('',Validators.required),
    estadoRepuesto: new FormControl('',Validators.required)
  });

  this.verRepForm = new FormGroup({
    nombre: new FormControl('',Validators.required),
    valor: new FormControl('',Validators.required),
    estadoRepuesto: new FormControl('',Validators.required),
    fechaCreacion: new FormControl('',Validators.required)
  });

  this.updateRepForm = new FormGroup({
    idRep: new FormControl('',Validators.required),
    nombre: new FormControl('',Validators.required),
    valor: new FormControl('',Validators.required),
    estadoRepuesto: new FormControl('',Validators.required)
  });
}

  ngOnInit():void{
      console.log("Cargando ventana principal de talleres...");  
      this._estadoRepuesto="";
      this.repuestoService.getRepuestos().subscribe({
        next: repuestos => {
          this.repuestos=repuestos
          console.log("Lista de repuestos registrados ...");
          console.log(JSON.stringify(this.repuestos));
        },
        error: err=>this.errorMessage=err
      });
    }

  agregarRepuesto(){
    console.log("Abriendo formulario para agregar un nuevo repuesto ... ");
    this.displayDialog = true;
    this.estadosRepuesto=[
      {label:'', value:null},
      {label:'Activo', value:"Activo"},
      {label:'Inactivo', value:"Inactivo"}
    ];

    this.registrarRepForm.controls['nombre'].setValue("");
    this.registrarRepForm.controls['valor'].setValue("");
    this._estadoRepuesto = "";
  }

  guardarRepuesto(){
    console.log("Cargando formulario para crear nuevo repuesto ... ");
    
    if(this._estadoRepuesto == "Activo"){
      this.estado=true;
    }
    else{
      this.estado=false;
    }

    this.repuestoService.guardarRepuesto(this.registrarRepForm,this.estado).subscribe({
        next: repLog => {
          if(repLog != null){
            console.log("*** Repuesto guardado: ");
            this.displayDialog = false;
            this.estadosRepuesto=[];
            this._repuestoSelected=[];
            this.msgs = [];
            this.msgs.push({severity:'success', summary:'Repuesto creado', detail:''});
            this.alertService.success("Se ha creado el repuesto");
            setTimeout(() => {}, 3000);
            this.ngOnInit();
          }else{
            this.displayDialog = false;
            this.estadosRepuesto=[];
            this._repuestoSelected=[];
            this.msgs = [];
            this.msgs.push({severity:'danger', summary:'Error', detail:''});
            this.alertService.error("No se ha creado el repuesto. Intente mas tarde");
            setTimeout(() => {}, 3000);
            this.ngOnInit();
          }
            
        },
        error: err=>{
          this.displayDialog = false;
          this.errorMessage=err;
          this.msgs = [];
            this.msgs.push({severity:'danger', summary:'Error', detail:''});
            this.alertService.error("No se pudo crear el repuesto. Intente mas tarde.");
            setTimeout(() => {}, 3000);
            this.ngOnInit();
        }
    });
  }

  editarRepuesto(){
    console.log("editaremos el repuesto . .. ");
    this._estadoRepuesto = "";
    this.estadosRepuesto=[
      {label:'', value:null},
      {label:'Activo', value:"Activo"},
      {label:'Inactivo', value:"Inactivo"}
    ];

    this.dialogEditRep=true;
    this.updateRepForm.controls['idRep'].setValue(this._repuestoSelected[0].id);
    this.updateRepForm.controls['nombre'].setValue(this._repuestoSelected[0].nombre);
    this.updateRepForm.controls['valor'].setValue(this._repuestoSelected[0].valor);
  }

  actualizarRepuesto(){
    console.log("Actualizando un repuesto ... ");
    this.repuestoService.actualizarRepuesto(this.updateRepForm).subscribe({
      next: proveeLog => {
        if(proveeLog != null){
            console.log("Hemos actualizado al repuesto " + JSON.stringify(proveeLog));
            if (this._estadoRepuesto != ""){
              if(this._estadoRepuesto=="Activo"){
                this.estado=true;
              }else{
                this.estado=false;
              }
            this.repuestoService.actualizarEstado(this.updateRepForm,this.estado).subscribe({
                next: repuesto => {
                  if(repuesto != null){
                    console.log("*** Repuesto actualizado: ");
                    this.dialogEditRep=false;
                    this._repuestoSelected = [];
                    this.msgs = [];
                    this.msgs.push({severity:'success', summary:'Repuesto actualizado', detail:''});
                    this.alertService.success("Se ha actualizado el repuesto");
                    setTimeout(() => {}, 3000);
                    this.ngOnInit();
                  }else{
                    this.dialogEditRep=false;
                    this._repuestoSelected = [];
                    this.msgs = [];
                    this.msgs.push({severity:'danger', summary:'Error', detail:''});
                    this.alertService.error("No se pudo actualizar el estado del repuesto. Actualice el estado nuevamente.");
                    setTimeout(() => {}, 3000);
                    this.ngOnInit();
                  }
                },
                error: err=>{
                  this.dialogEditRep=false;
                  this.errorMessage=err;
                  this.msgs = [];
                    this.msgs.push({severity:'danger', summary:'Error', detail:''});
                    this.alertService.error("No se pudo actualizar el repuesto. Intente mas tarde.");
                    setTimeout(() => {}, 3000);
                    this.ngOnInit();
                }
            });   
        }else{
          console.log("*** Proveedor actualizado: ");
          this.dialogEditRep=false;
          this._repuestoSelected = [];
          this.msgs = [];
          this.msgs.push({severity:'success', summary:'Repuesto actualizado', detail:''});
          this.alertService.success("Se ha actualizado el repuesto");
          setTimeout(() => {}, 3000);
          this.ngOnInit();
        }
      }else{
        this.dialogEditRep=false;
        this._repuestoSelected = [];
        this.msgs = [];
        this.msgs.push({severity:'danger', summary:'Error', detail:''});
        this.alertService.error("No se pudo actualizar el estado del repuesto. Actualice el estado nuevamente.");
        setTimeout(() => {}, 3000);
        this.ngOnInit();
      }
      },
      error: err=>{
        this.dialogEditRep=false;
        this.errorMessage=err;
        this.msgs = [];
          this.msgs.push({severity:'danger', summary:'Error', detail:''});
          this.alertService.error("No se pudo actualizar el repuesto. Intente mas tarde.");
          setTimeout(() => {}, 3000);
          this.ngOnInit();
      }
    });    
  }
 
  verRepuesto(){
    console.log("visualizaremos el repuesto . .. ");
    this.dialogVerRep=true;
    this.verRepForm.controls['nombre'].setValue(this._repuestoSelected[0].nombre);
    this.verRepForm.controls['valor'].setValue(this._repuestoSelected[0].valor);
    if(this._repuestoSelected[0].estado == 1){
      this.verRepForm.controls['estadoRepuesto'].setValue("Activo");
    }else{
      this.verRepForm.controls['estadoRepuesto'].setValue("Inactivo");
    }
    this.verRepForm.controls['fechaCreacion'].setValue(this._repuestoSelected[0].fechacreacion);
  }
}
