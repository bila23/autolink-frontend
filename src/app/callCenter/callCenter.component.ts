import {Component,OnInit} from '@angular/core';
import {SelectItem, Message} from 'primeng/api';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AlertService } from '../alert/alert.service';
import { IUser } from '../_model/user.model';
import { UserService } from '../users/user-list.services';
import { ICallCenter } from '../_model/callCenter.model';
import { CallCenterService } from './callCenter.service';

@Component({
  templateUrl:'./callCenter.component.html'
  //styleUrls:['./product-list.component.css']
})
export class CallCenterComponent implements OnInit{
  msgs: Message[] = [];
  callcenters: ICallCenter[]=[];
  _callCenterSelected: ICallCenter[];
  //_estadoProveedor: string;
  //estadosProveedor: SelectItem[];
  _userSeleccionado:string;
  usuariosSource: IUser[];
  usuariosList: SelectItem[]=[];
  //estado:boolean;

  errorMessage:string;
  displayDialog:boolean;
  dialogVerCce: boolean;
  dialogEditCce: boolean;
  
  cols: any[];

  registrarCceForm:FormGroup;
  verCceForm: FormGroup;
  updateCceForm: FormGroup;

constructor(private callCenterService:CallCenterService,private userService:UserService,private alertService:AlertService){
  this.cols=[
    { field: 'id', header: 'numero' },
    { field: 'nombre', header: 'nombre' }
  ];

  this.registrarCceForm = new FormGroup({
    nombre: new FormControl('',Validators.required),
    //estadoProveedor: new FormControl('',Validators.required),
    razonSocial: new FormControl('',Validators.required),
    telefono: new FormControl('',Validators.required),
    usuario: new FormControl('',Validators.required),
    cargo: new FormControl('',Validators.required)
  });

  this.verCceForm = new FormGroup({
    nombre: new FormControl('',Validators.required),
    //estadoProveedor: new FormControl('',Validators.required),
    //fechaCreacion: new FormControl('',Validators.required),
    razonSocial: new FormControl('',Validators.required),
    telefono: new FormControl('',Validators.required),
    usuario: new FormControl('',Validators.required),
    cargo: new FormControl('',Validators.required)
  });

  this.updateCceForm = new FormGroup({
    idCce: new FormControl('',Validators.required),
    nombre: new FormControl('',Validators.required),
    //estadoProveedor: new FormControl('',Validators.required),
    razonSocial: new FormControl('',Validators.required),
    telefono: new FormControl('',Validators.required),
    usuario: new FormControl('',Validators.required),
    cargo: new FormControl('',Validators.required)
  });
}

  ngOnInit():void{
      console.log("Cargando ventana principal de call center...");  
      //this._estadoProveedor="";
      this.callCenterService.getCallCenters().subscribe({
        next: callcenters => {
          this.callcenters=callcenters
          console.log("Lista de call centers registrados ...");
          console.log(JSON.stringify(this.callcenters));
        },
        error: err=>this.errorMessage=err
      });

      //Consultando la lista de usuarios registrados
      this.userService.getUsuarios().subscribe(usuariosSource => {
        this.usuariosSource = usuariosSource;
        if(this.usuariosSource && this.usuariosSource.length > 0){
            for(let key in this.usuariosSource){
                 console.log("Llenamos el dropdownList de usuarios");
                 if(this.usuariosSource.hasOwnProperty(key)){
                     this.usuariosList.push({label: this.usuariosSource[key].nombre, value: {id:this.usuariosSource[key].id,nombre:this.usuariosSource[key].nombre}});
                 }
            }
        }
     });
    }

  agregarCallCenter(){
    console.log("Abriendo formulario para agregar un nuevo proveedor ... ");
    this.displayDialog = true;
   /* this.estadosProveedor=[
      {label:'', value:null},
      {label:'Activo', value:"Activo"},
      {label:'Inactivo', value:"Inactivo"}
    ]; */

    this.registrarCceForm.controls['nombre'].setValue("");
    this.registrarCceForm.controls['razonSocial'].setValue("");
    this.registrarCceForm.controls['telefono'].setValue("");
    this.registrarCceForm.controls['usuario'].setValue("");
    this.registrarCceForm.controls['cargo'].setValue("");

    //this._estadoProveedor = "";
  }

  guardarCallCenter(){
    console.log("Cargando formulario para crear nuevo call center ... ");
    
    /*
    if(this._estadoProveedor == "Activo"){
      this.estado=true;
    }
    else{
      this.estado=false;
    } */

    //this.callCenterService.guardarCallCenter(this.registrarProvForm,this.estado,this._userSeleccionado).subscribe({
    this.callCenterService.guardarCallCenter(this.registrarCceForm,this._userSeleccionado).subscribe({
        next: cceLog => {
          if(cceLog != null){
            console.log("*** CallCenter guardado: ");
            this.displayDialog = false;
            //this.estadosProveedor=[];
            this._callCenterSelected=[];
            this.msgs = [];
            this.msgs.push({severity:'success', summary:'CallCenter creado', detail:''});
            this.alertService.success("Se ha creado el call center");
            setTimeout(() => {}, 3000);
            this.ngOnInit();
          }else{
            this.displayDialog = false;
            //this.estadosProveedor=[];
            this._callCenterSelected=[];
            this.msgs = [];
            this.msgs.push({severity:'danger', summary:'Error', detail:''});
            this.alertService.error("No se ha creado el call center. Intente mas tarde");
            setTimeout(() => {}, 3000);
            this.ngOnInit();
          }  
        },
        error: err=>{
          this.displayDialog = false;
          this.errorMessage=err;
          this.msgs = [];
            this.msgs.push({severity:'danger', summary:'Error', detail:''});
            this.alertService.error("No se pudo crear el call center. Intente mas tarde.");
            setTimeout(() => {}, 3000);
            this.ngOnInit();
        }
    });
  }

  editarCallCenter(){
    console.log("editaremos el call center . .. ");
    //this._estadoProveedor = "";
    this.dialogEditCce=true;
   /* this.estadosProveedor=[
      {label:'', value:null},
      {label:'Activo', value:"Activo"},
      {label:'Inactivo', value:"Inactivo"}
    ]; */

    this.updateCceForm.controls['idCce'].setValue(this._callCenterSelected[0].id);
    this.updateCceForm.controls['nombre'].setValue(this._callCenterSelected[0].nombreempresa);
    this.updateCceForm.controls['razonSocial'].setValue(this._callCenterSelected[0].razonsocial);
    this.updateCceForm.controls['telefono'].setValue(this._callCenterSelected[0].telefono);
    this.updateCceForm.controls['usuario'].setValue(this._callCenterSelected[0].usuario.nombre);
    this.updateCceForm.controls['cargo'].setValue(this._callCenterSelected[0].cargo);   
  }

  actualizarCallCenter(){
    console.log("Actualizando un callcenter ... ");
    this.callCenterService.actualizarCallCenter(this.updateCceForm,this._userSeleccionado).subscribe({
      next: cceLog => {
        if(cceLog != null){
          console.log("Hemos actualizado al call center " + JSON.stringify(cceLog));
         /* if (this._estadoProveedor != ""){
            if(this._estadoProveedor=="Activo"){
              this.estado=true;
            }else{
              this.estado=false;
            }
            this.proveedorService.actualizarEstado(this.updateProvForm,this.estado).subscribe({
              next: proveedor => {
                if(proveedor != null){
                  console.log("*** Proveedor actualizado: ");
                  this.dialogEditCce=false;
                  this._proveedorSelected = [];
                  this.msgs = [];
                  this.msgs.push({severity:'success', summary:'Proveedor actualizado', detail:''});
                  this.alertService.success("Se ha actualizado el proveedor");
                  setTimeout(() => {}, 3000);
                  this.ngOnInit();
                }else{
                  this.dialogEditCce=false;
                  this._proveedorSelected = [];
                  this.msgs = [];
                  this.msgs.push({severity:'danger', summary:'Error', detail:''});
                  this.alertService.error("No se pudo actualizar el estado del proveedor. Actualice el estado nuevamente.");
                  setTimeout(() => {}, 3000);
                  this.ngOnInit();
                }
              },
              error: err=>{
                this.dialogEditCce = false;
                this.errorMessage=err;
                this.msgs = [];
                  this.msgs.push({severity:'danger', summary:'Error', detail:''});
                  this.alertService.error("No se pudo actualizar el proveedor. Intente mas tarde.");
                  setTimeout(() => {}, 3000);
                  this.ngOnInit();
              }
          });
          }else{*/
            console.log("*** CallCenter actualizado: ");
            this.dialogEditCce=false;
            this._callCenterSelected = [];
            this.msgs = [];
            this.msgs.push({severity:'success', summary:'CallCenter actualizado', detail:''});
            this.alertService.success("Se ha actualizado el call center");
            setTimeout(() => {}, 3000);
            this.ngOnInit();
          //}
        }else{
            this.dialogEditCce=false;
            this._callCenterSelected = [];
            this.msgs = [];
            this.msgs.push({severity:'danger', summary:'Error', detail:''});
            this.alertService.error("No se pudo actualizar el call center. Intente nuevamente.");
            setTimeout(() => {}, 3000);
            this.ngOnInit();
        }
      },
      error: err=>{
        this.dialogEditCce=false;
        this.errorMessage=err;
        this.msgs = [];
          this.msgs.push({severity:'danger', summary:'Error', detail:''});
          this.alertService.error("No se pudo actualizar el call center. Intente mas tarde.");
          setTimeout(() => {}, 3000);
          this.ngOnInit();
      }
    });    
}
 
  verCallCenter(){
    console.log("visualizaremos el call center . .. ");
    this.dialogVerCce=true;
    this.verCceForm.controls['nombre'].setValue(this._callCenterSelected[0].nombreempresa);
  /*  if(this._proveedorSelected[0].estado == 1){
      this.verProvForm.controls['estadoProveedor'].setValue("Activo");
    }else{
      this.verProvForm.controls['estadoProveedor'].setValue("Inactivo");
    } */
    //this.verCceForm.controls['fechaCreacion'].setValue(this._proveedorSelected[0].fechacreacion);
    this.verCceForm.controls['razonSocial'].setValue(this._callCenterSelected[0].razonsocial);
    this.verCceForm.controls['telefono'].setValue(this._callCenterSelected[0].telefono);
    this.verCceForm.controls['usuario'].setValue(this._callCenterSelected[0].usuario.nombre);
    this.verCceForm.controls['cargo'].setValue(this._callCenterSelected[0].cargo);
  }
}
