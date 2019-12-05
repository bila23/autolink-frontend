import {Component,OnInit} from '@angular/core';
import {SelectItem, Message} from 'primeng/api';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IProveedor } from '../_model/proveedor.model';
import { ProveedorService } from './proveedor.service';
import { AlertService } from '../alert/alert.service';
import { IUser } from '../_model/user.model';
import { UserService } from '../users/user-list.services';

@Component({
  templateUrl:'./proveedor-list.component.html'
  //styleUrls:['./product-list.component.css']
})
export class ProveedorListComponent implements OnInit{
  msgs: Message[] = [];
  proveedores: IProveedor[]=[];
  _proveedorSelected: IProveedor[];
  _estadoProveedor: string;
  estadosProveedor: SelectItem[];
  _userSeleccionado:string;
  usuariosSource: IUser[];
  usuariosList: SelectItem[]=[];
  estado:boolean;

  errorMessage:string;
  displayDialog:boolean;
  dialogVerProv: boolean;
  dialogEditProv: boolean;
  
  cols: any[];

  registrarProvForm:FormGroup;
  verProvForm: FormGroup;
  updateProvForm: FormGroup;

constructor(private proveedorService:ProveedorService,private userService:UserService,private alertService:AlertService){
  this.cols=[
    { field: 'id', header: 'numero' },
    { field: 'nombre', header: 'nombre' },
    { field: 'direccion', header: 'direccion' }
  ];

  this.registrarProvForm = new FormGroup({
    nombre: new FormControl('',Validators.required),
    direccion: new FormControl('',Validators.required),
    estadoProveedor: new FormControl('',Validators.required),
    razonSocial: new FormControl('',Validators.required),
    telefono: new FormControl('',Validators.required),
    nit: new FormControl('',Validators.required),
    usuario: new FormControl('',Validators.required),
    cuentaBanc: new FormControl('',Validators.required),
    cargo: new FormControl('',Validators.required)
  });

  this.verProvForm = new FormGroup({
    nombre: new FormControl('',Validators.required),
    direccion: new FormControl('',Validators.required),
    estadoProveedor: new FormControl('',Validators.required),
    fechaCreacion: new FormControl('',Validators.required),
    razonSocial: new FormControl('',Validators.required),
    telefono: new FormControl('',Validators.required),
    nit: new FormControl('',Validators.required),
    usuario: new FormControl('',Validators.required),
    cuentaBanc: new FormControl('',Validators.required),
    cargo: new FormControl('',Validators.required)
  });

  this.updateProvForm = new FormGroup({
    idProv: new FormControl('',Validators.required),
    nombre: new FormControl('',Validators.required),
    direccion: new FormControl('',Validators.required),
    estadoProveedor: new FormControl('',Validators.required),
    razonSocial: new FormControl('',Validators.required),
    telefono: new FormControl('',Validators.required),
    nit: new FormControl('',Validators.required),
    usuario: new FormControl('',Validators.required),
    cuentaBanc: new FormControl('',Validators.required),
    cargo: new FormControl('',Validators.required)
  });
}

  ngOnInit():void{
      console.log("Cargando ventana principal de talleres...");  
      this._estadoProveedor="";
      this.proveedorService.getProveedores().subscribe({
        next: proveedores => {
          this.proveedores=proveedores
          console.log("Lista de proveedores registrados ...");
          console.log(JSON.stringify(this.proveedores));
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

  agregarProveedor(){
    console.log("Abriendo formulario para agregar un nuevo proveedor ... ");
    this.displayDialog = true;
    this.estadosProveedor=[
      {label:'', value:null},
      {label:'Activo', value:"Activo"},
      {label:'Inactivo', value:"Inactivo"}
    ];

    this.registrarProvForm.controls['nombre'].setValue("");
    this.registrarProvForm.controls['direccion'].setValue("");
    this.registrarProvForm.controls['razonSocial'].setValue("");
    this.registrarProvForm.controls['telefono'].setValue("");
    this.registrarProvForm.controls['nit'].setValue("");
    this.registrarProvForm.controls['usuario'].setValue("");
    this.registrarProvForm.controls['cuentaBanc'].setValue("");
    this.registrarProvForm.controls['cargo'].setValue("");

    this._estadoProveedor = "";
  }

  guardarProveedor(){
    console.log("Cargando formulario para crear nuevo proveedor ... ");
    
    if(this._estadoProveedor == "Activo"){
      this.estado=true;
    }
    else{
      this.estado=false;
    }

    this.proveedorService.guardarProveedor(this.registrarProvForm,this.estado,this._userSeleccionado).subscribe({
        next: userLog => {
          if(userLog != null){
            console.log("*** Proveedor guardado: ");
            this.displayDialog = false;
            this.estadosProveedor=[];
            this._proveedorSelected=[];
            this.msgs = [];
            this.msgs.push({severity:'success', summary:'Proveedor creado', detail:''});
            this.alertService.success("Se ha creado el proveedor");
            setTimeout(() => {}, 3000);
            this.ngOnInit();
          }else{
            this.displayDialog = false;
            this.estadosProveedor=[];
            this._proveedorSelected=[];
            this.msgs = [];
            this.msgs.push({severity:'danger', summary:'Error', detail:''});
            this.alertService.error("No se ha creado el proveedor. Intente mas tarde");
            setTimeout(() => {}, 3000);
            this.ngOnInit();
          }  
        },
        error: err=>{
          this.displayDialog = false;
          this.errorMessage=err;
          this.msgs = [];
            this.msgs.push({severity:'danger', summary:'Error', detail:''});
            this.alertService.error("No se pudo crear el proveedor. Intente mas tarde.");
            setTimeout(() => {}, 3000);
            this.ngOnInit();
        }
    });
  }

  editarProveedor(){
    console.log("editaremos el proveedor . .. ");
    this._estadoProveedor = "";
    this.dialogEditProv=true;
    this.estadosProveedor=[
      {label:'', value:null},
      {label:'Activo', value:"Activo"},
      {label:'Inactivo', value:"Inactivo"}
    ];

    this.dialogEditProv=true;
    this.updateProvForm.controls['idProv'].setValue(this._proveedorSelected[0].id);
    this.updateProvForm.controls['nombre'].setValue(this._proveedorSelected[0].nombre);
    this.updateProvForm.controls['direccion'].setValue(this._proveedorSelected[0].direccion);
    this.updateProvForm.controls['razonSocial'].setValue(this._proveedorSelected[0].razonsocial);
    this.updateProvForm.controls['telefono'].setValue(this._proveedorSelected[0].telefono);
    this.updateProvForm.controls['nit'].setValue(this._proveedorSelected[0].nit);
    this.updateProvForm.controls['usuario'].setValue(this._proveedorSelected[0].usuario.nombre);
    this.updateProvForm.controls['cuentaBanc'].setValue(this._proveedorSelected[0].cuentabancaria);
    this.updateProvForm.controls['cargo'].setValue(this._proveedorSelected[0].cargo);   
  }

  actualizarProveedor(){
    console.log("Actualizando un proveedor ... ");
    this.proveedorService.actualizarProv(this.updateProvForm,this._userSeleccionado).subscribe({
      next: proveeLog => {
        if(proveeLog != null){
          console.log("Hemos actualizado al proveedor " + JSON.stringify(proveeLog));
          if (this._estadoProveedor != ""){
            if(this._estadoProveedor=="Activo"){
              this.estado=true;
            }else{
              this.estado=false;
            }
            this.proveedorService.actualizarEstado(this.updateProvForm,this.estado).subscribe({
              next: proveedor => {
                if(proveedor != null){
                  console.log("*** Proveedor actualizado: ");
                  this.dialogEditProv=false;
                  this._proveedorSelected = [];
                  this.msgs = [];
                  this.msgs.push({severity:'success', summary:'Proveedor actualizado', detail:''});
                  this.alertService.success("Se ha actualizado el proveedor");
                  setTimeout(() => {}, 3000);
                  this.ngOnInit();
                }else{
                  this.dialogEditProv=false;
                  this._proveedorSelected = [];
                  this.msgs = [];
                  this.msgs.push({severity:'danger', summary:'Error', detail:''});
                  this.alertService.error("No se pudo actualizar el estado del proveedor. Actualice el estado nuevamente.");
                  setTimeout(() => {}, 3000);
                  this.ngOnInit();
                }
              },
              error: err=>{
                this.dialogEditProv=false;
                this.errorMessage=err;
                this.msgs = [];
                  this.msgs.push({severity:'danger', summary:'Error', detail:''});
                  this.alertService.error("No se pudo actualizar el proveedor. Intente mas tarde.");
                  setTimeout(() => {}, 3000);
                  this.ngOnInit();
              }
          });
          }else{
            console.log("*** Proveedor actualizado: ");
                  this.dialogEditProv=false;
                  this._proveedorSelected = [];
                  this.msgs = [];
                  this.msgs.push({severity:'success', summary:'Proveedor actualizado', detail:''});
                  this.alertService.success("Se ha actualizado el proveedor");
                  setTimeout(() => {}, 3000);
                  this.ngOnInit();
          }
        }else{
          this.dialogEditProv=false;
                  this._proveedorSelected = [];
                  this.msgs = [];
                  this.msgs.push({severity:'danger', summary:'Error', detail:''});
                  this.alertService.error("No se pudo actualizar el estado del proveedor. Actualice el estado nuevamente.");
                  setTimeout(() => {}, 3000);
                  this.ngOnInit();
        }
      },
      error: err=>{
        this.dialogEditProv=false;
        this.errorMessage=err;
        this.msgs = [];
          this.msgs.push({severity:'danger', summary:'Error', detail:''});
          this.alertService.error("No se pudo actualizar el proveedor. Intente mas tarde.");
          setTimeout(() => {}, 3000);
          this.ngOnInit();
      }
    });    
}
 
  verProveedor(){
    console.log("visualizaremos el proveedor . .. ");
    this.dialogVerProv=true;
    this.verProvForm.controls['nombre'].setValue(this._proveedorSelected[0].nombre);
    this.verProvForm.controls['direccion'].setValue(this._proveedorSelected[0].direccion);
    if(this._proveedorSelected[0].estado == 1){
      this.verProvForm.controls['estadoProveedor'].setValue("Activo");
    }else{
      this.verProvForm.controls['estadoProveedor'].setValue("Inactivo");
    }
    this.verProvForm.controls['fechaCreacion'].setValue(this._proveedorSelected[0].fechacreacion);
    this.verProvForm.controls['razonSocial'].setValue(this._proveedorSelected[0].razonsocial);
    this.verProvForm.controls['telefono'].setValue(this._proveedorSelected[0].telefono);
    this.verProvForm.controls['nit'].setValue(this._proveedorSelected[0].nit);
    this.verProvForm.controls['usuario'].setValue(this._proveedorSelected[0].usuario.nombre);
    this.verProvForm.controls['cuentaBanc'].setValue(this._proveedorSelected[0].cuentabancaria);
    this.verProvForm.controls['cargo'].setValue(this._proveedorSelected[0].cargo);
  }
}
