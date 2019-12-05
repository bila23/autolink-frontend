import {Component,OnInit} from '@angular/core';
import {SelectItem, Message} from 'primeng/api';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoginService } from '../login/login.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { IModelo } from '../_model/modelo.model';
import { IModeloVista } from '../_model/modeloVista.model';
import { MarcaService } from '../marca/marca.service';
import { IMarca } from '../_model/marca.model';
import { ModeloService } from './modelo.service';
import { AlertService } from '../alert/alert.service';

@Component({
  templateUrl:'./modelo-list.component.html'
  //styleUrls:['./product-list.component.css']
})
export class ModeloListComponent implements OnInit{
  msgs: Message[] = [];
    modelos: IModelo[]=[];
    modelosView: IModeloVista[]=[];
    _modeloSelected: IModeloVista[];
    _marcaSeleccionada: string;
  
    errorMessage:string;
    displayDialog:boolean;
    dialogVerMdl: boolean;
    dialogEditMdl: boolean;
    cols: any[];
    _estadoModelo: string;


  //formulario registro de usuarios
    registrarModeloForm:FormGroup;
    verModeloForm: FormGroup;
    updateModeloForm: FormGroup;

    marcasModelo: SelectItem[]=[];
    marcasSource: IMarca[];
    estadosModelo: SelectItem[];

    estado: boolean;
    _estadoUsuarioEdit: boolean;
    _tipoSeleccionadoEdit: string;
    
  get marcaSeleccionada(): string{
      return this._marcaSeleccionada;
  }

  set marcaSeleccionada(value:string){
      this._marcaSeleccionada = value;
  }

  get estadoModelo(): string{
    return this._estadoModelo;
}

set estadoModelo(value:string){
    this._estadoModelo = value;
}

  constructor(private marcaService:MarcaService,private modeloService: ModeloService,private alertService:AlertService){

    this.cols=[
      { field: 'id', header: 'numero' },
      { field: 'nombre', header: 'modelo' }
    ];

    this.registrarModeloForm = new FormGroup({
      nombre: new FormControl('',Validators.required),
      marcaModelo: new FormControl('',Validators.required),
      estadoModelo: new FormControl('',Validators.required)
    });

    this.verModeloForm = new FormGroup({
        nombre: new FormControl('',Validators.required),
        marcaModelo: new FormControl('',Validators.required),
        estadoModelo: new FormControl('',Validators.required),
        fechaCreacion: new FormControl('',Validators.required)
    });

    this.updateModeloForm = new FormGroup({
        idMdl: new FormControl('',Validators.required),
        nombre: new FormControl('',Validators.required),
        marcaModelo: new FormControl('',Validators.required),
        estadoModelo: new FormControl('',Validators.required)
    });

  }

  ngOnInit():void{
      console.log("Cargando ventana principal de modelos...");
      this.marcasSource = [];
      this.marcasModelo = [];
      this._estadoModelo="";
      this._marcaSeleccionada="";
  
      this.modeloService.getModelos().subscribe({
        next: modelos => {
          this.modelos=modelos;
          console.log("Lista de modelos registrados...");
          console.log(JSON.stringify(this.modelos));
          for(let key in this.modelos){
            if(this.modelos.hasOwnProperty(key)){
              this.modelosView[key]={
                id:this.modelos[key].id,
                nombre:this.modelos[key].nombre,
                usuariocrea: this.modelos[key].usuariocrea,
                estado: this.modelos[key].estado,
                fechacreacion: this.modelos[key].fechacreacion,

                idMarca: this.modelos[key].marca.id,
                nombreMarca:this.modelos[key].marca.nombre,
                estadoMarca: this.modelos[key].marca.estado,
                fechacreacionMarca: this.modelos[key].marca.fechacreacion,
                usuariocreaMarca: this.modelos[key].marca.usuariocrea
              }
            }
          }
        
          console.log("Modelo view: " + JSON.stringify(this.modelosView));
        },
        error: err=>this.errorMessage=err
      });

      //CARGANDO LISTA DE MARCAS
      this.marcaService.getMarcas().subscribe(marcas => {
        this.marcasSource = marcas;
        //this.tiposUsuarios.push({label: "Tipo de usuario", value: null});
        if(this.marcasSource && this.marcasSource.length > 0){
            for(let key in this.marcasSource){
                 console.log("Llenamos el dropdownList de marcas");
                 if(this.marcasSource.hasOwnProperty(key)){
                     this.marcasModelo.push({label: this.marcasSource[key].nombre, value: {id:this.marcasSource[key].id,nombre:this.marcasSource[key].nombre}});
                 }
            }
        }
     });
    }

  agregarModelo(){
    console.log("Abriendo formulario para agregar un nuevo modelo ... ");
    this.displayDialog = true;

    this.estadosModelo=[
      {label:'', value:null},
      {label:'Activo', value:"Activo"},
      {label:'Inactivo', value:"Inactivo"}
    ];

    this.registrarModeloForm.controls['nombre'].setValue("");
    this._marcaSeleccionada = "";
    this._estadoModelo = "";
  }

  guardarModelo(){
    console.log("Guardando nuevo modelo ... ");

    if(this._estadoModelo == "Activo"){
      this.estado=true;
    }
    else{
      this.estado=false;
    }
    this.modeloService.guardarModelo(this.registrarModeloForm,this._marcaSeleccionada,this.estado).subscribe({
        next: modeloLog => {
          if(modeloLog != null){
            console.log("*** Modelo guardado: ");
            this.displayDialog = false;
            this.estadosModelo=[];
            this.msgs = [];
            this.msgs.push({severity:'success', summary:'Modelo creado', detail:''});
            this.alertService.success("Se ha creado el nuevo modelo");
            setTimeout(() => {}, 3000);
            this.ngOnInit();
          }else{
            this.displayDialog = false;
            this.estadosModelo=[];
            this.msgs = [];
            this.msgs.push({severity:'danger', summary:'Error', detail:''});
            this.alertService.error("No se ha creado el modelo. Intente mas tarde");
            setTimeout(() => {}, 3000);
            this.ngOnInit();
          }
        },
        error: err=>{
          this.displayDialog = false;
          this.errorMessage=err;
          this.msgs = [];
            this.msgs.push({severity:'danger', summary:'Error', detail:''});
            this.alertService.error("No se pudo crear el modelo. Intente mas tarde.");
            setTimeout(() => {}, 3000);
            this.ngOnInit();
        }
    });
  }

  editarModelo(){
    console.log("editaremos el modelo . .. ");
    this._estadoModelo = "";
    this.estadosModelo=[
      {label:'', value:null},
      {label:'Activo', value:"Activo"},
      {label:'Inactivo', value:"Inactivo"}
    ];
    
    this.dialogEditMdl=true;
    this.updateModeloForm.controls['idMdl'].setValue(this._modeloSelected[0].id);
    this.updateModeloForm.controls['nombre'].setValue(this._modeloSelected[0].nombre);
  }

  actualizarModelo(){
    console.log("Actualizando el modelo ... ");
    if ( this._marcaSeleccionada != "" && this._estadoModelo != ""){
      this.modeloService.actualizarModelo(this.updateModeloForm,this._marcaSeleccionada).subscribe({
          next: modeloLog => {
            if(modeloLog != null){
              console.log("*** Se actualizo la marca y estado: ESTADO" + this._estadoModelo);
              if(this._estadoModelo=="Activo"){
                this.estado=true;
              }else{
                this.estado=false;
              }
              if(this._estadoModelo != ""){
                this.modeloService.actualizarEstado(this.updateModeloForm.controls['nombre'].value,this.estado).subscribe({
                    next: userAc => {
                      if(userAc != null){
                        this.dialogEditMdl = false;
                        this.estadosModelo=[];
                        this._modeloSelected=[];
                        this._marcaSeleccionada = "";
                        this.msgs = [];
                        this.msgs.push({severity:'success', summary:'Modelo actualizado', detail:''});
                        this.alertService.success("Se ha actualizado el modelo");
                        setTimeout(() => {}, 3000);
                        this.ngOnInit();
                      }else{
                        this.dialogEditMdl = false;
                        this.estadosModelo=[];
                        this._modeloSelected=[];
                        this._marcaSeleccionada = "";
                        this.msgs = [];
                        this.msgs.push({severity:'danger', summary:'Error', detail:''});
                        this.alertService.error("No se pudo actualizar el estado del modelo. Actualice el estado nuevamente.");
                        setTimeout(() => {}, 3000);            
                        this.ngOnInit();
                      }                     
                    },
                    error: err=>{
                      this.dialogEditMdl = false;
                      this.errorMessage=err;
                      this.msgs = [];
                        this.msgs.push({severity:'danger', summary:'Error', detail:''});
                        this.alertService.error("No se pudo actualizar el modelo. Intente mas tarde.");
                        setTimeout(() => {}, 3000);
                        this.ngOnInit();
                    }
                });
              }
            }else{
              this.dialogEditMdl = false;
              this.estadosModelo=[];
              this._modeloSelected=[];
              this._marcaSeleccionada = "";
              this.msgs = [];
              this.msgs.push({severity:'danger', summary:'Error', detail:''});
              this.alertService.error("No se pudo actualizar el modelo. Intente mas tarde");
              setTimeout(() => {}, 3000);
              this.ngOnInit();
            }
          },
          error: err=>{
            this.dialogEditMdl = false;
            this.errorMessage=err;
            this.msgs = [];
              this.msgs.push({severity:'danger', summary:'Error', detail:''});
              this.alertService.error("No se pudo actualizar el modelo. Intente mas tarde..");
              setTimeout(() => {}, 3000);
              this.ngOnInit();
          }
      });
    }else if(this._marcaSeleccionada != "" && this._estadoModelo == ""){
      this.modeloService.actualizarModelo(this.updateModeloForm,this._marcaSeleccionada).subscribe({
        next: userLog => {
          if(userLog != null){
            console.log("*** Se actualizo la marca: ");
            this.dialogEditMdl = false;
            this.estadosModelo=[];
            this._modeloSelected=[];
            this._marcaSeleccionada = "";
            this.msgs = [];
            this.msgs.push({severity:'success', summary:'Modelo actualizado', detail:''});
            this.alertService.success("Se ha actualizado la marca del modelo");
            setTimeout(() => {}, 3000);
            this.ngOnInit();
          }else{
            this.dialogEditMdl = false;
            this.estadosModelo=[];
            this._modeloSelected=[];
            this._marcaSeleccionada = "";
            this.msgs = [];
            this.msgs.push({severity:'danger', summary:'Error', detail:''});
            this.alertService.error("No se pudo actualizar la marca del modelo. Intente mas tarde");
            setTimeout(() => {}, 3000);
            this.ngOnInit();
          }
        },
        error: err=>{
          this.dialogEditMdl = false;
          this.errorMessage=err;
          this.msgs = [];
            this.msgs.push({severity:'danger', summary:'Error', detail:''});
            this.alertService.error("No se pudo actualizar la marca del modelo. Intente mas tarde.");
            setTimeout(() => {}, 3000);
            this.ngOnInit();
        }
    });
  }else if(this._marcaSeleccionada == "" && this._estadoModelo != ""){
    if(this._estadoModelo=="Activo"){
      this.estado=true;
    }else{
      this.estado=false;
    }
    this.modeloService.actualizarEstado(this.updateModeloForm.controls['nombre'].value,this.estado).subscribe({
            next: userLog => {
              if(userLog != null){
                console.log("*** Se actualizo estado: ");
                this.dialogEditMdl = false;
                this.estadosModelo=[];
                this._modeloSelected=[];
                this._marcaSeleccionada = "";
                this.msgs = [];
                this.msgs.push({severity:'success', summary:'Modelo actualizado', detail:''});
                this.alertService.success("Se ha actualizado el estado del modelo");
                setTimeout(() => {}, 3000);
                this.ngOnInit();
              }else{
                this.dialogEditMdl = false;
                this.estadosModelo=[];
                this._modeloSelected=[];
                this._marcaSeleccionada = "";
                this.msgs = [];
                this.msgs.push({severity:'danger', summary:'Error', detail:''});
                this.alertService.error("No se pudo actualizar el estado del modelo. Intente mas tarde");
                setTimeout(() => {}, 3000);
                this.ngOnInit();
              }
            },
            error: err=>{
              this.dialogEditMdl = false;
              this.errorMessage=err;
              this.msgs = [];
                this.msgs.push({severity:'danger', summary:'Error', detail:''});
                this.alertService.error("No se pudo actualizar el estado del modelo. Intente mas tarde.");
                setTimeout(() => {}, 3000);
                this.ngOnInit();
            }
        });
    }
    
    this.dialogEditMdl=false;  
  }
  
  verModelo(){
    console.log("visualizaremos el modelo . .. ");
    this.dialogVerMdl=true;
    this.verModeloForm.controls['nombre'].setValue(this._modeloSelected[0].nombre);
    this.verModeloForm.controls['marcaModelo'].setValue(this._modeloSelected[0].nombreMarca);
    if(this._modeloSelected[0].estado==1){
      this.verModeloForm.controls['estadoModelo'].setValue("Activo");
    }else{
      this.verModeloForm.controls['estadoModelo'].setValue("Inactivo");
    }
    
    this.verModeloForm.controls['fechaCreacion'].setValue(this._modeloSelected[0].fechacreacion);
  }
}
