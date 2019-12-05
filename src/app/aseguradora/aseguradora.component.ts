import {Component,OnInit} from '@angular/core';
import {SelectItem, Message} from 'primeng/api';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IAseguradora } from '../_model/aseguradora.model';
import { AseguradoraService } from './aseguradora.service';
import { AlertService } from '../alert/alert.service';
import { UserService } from '../users/user-list.services';
import { IUser } from '../_model/user.model';

@Component({
  templateUrl:'./aseguradora-list.component.html'
  //styleUrls:['./product-list.component.css']
})

export class AseguradoraListComponent implements OnInit{
  msgs: Message[] = [];
  aseguradoras: IAseguradora[]=[];
  _aseguradoraSelected: IAseguradora[];
  cols: any[];
  _estadoAseguradora: string;
  _userSeleccionado: string;
  usuariosSource: IUser[];
  usuariosList: SelectItem[]=[];
  errorMessage:string;
  displayDialog:boolean;
  dialogEditAseg: boolean;
  dialogVerAseg: boolean;
  estado:boolean;
  registrarAseguradoraForm:FormGroup;
  updateAsegForm: FormGroup;
  verAseguradoraForm: FormGroup;
  
  estadosAseguradora: SelectItem[];
  filteredTalleres:IAseguradora[] = [];
  
  updateTallerForm: FormGroup;

constructor(private aseguradoraService: AseguradoraService,private userService:UserService,private alertService:AlertService){
  this.cols=[
    { field: 'id', header: 'numero' },
    { field: 'nombre', header: 'nombre' }
  ];

  this.registrarAseguradoraForm = new FormGroup({
    nombre: new FormControl('',Validators.required),
    estadoAseguradora: new FormControl('',Validators.required),
    razonSocial: new FormControl('',Validators.required),
    iva: new FormControl('',Validators.required),
    nit: new FormControl('',Validators.required),
    usuario: new FormControl('',Validators.required),
    cargo: new FormControl('',Validators.required)
  });

  this.updateAsegForm = new FormGroup({
    idAseg: new FormControl('',Validators.required),
    nombre: new FormControl('',Validators.required),
    estadoAseg: new FormControl('',Validators.required),
    razonSocial: new FormControl('',Validators.required),
    iva: new FormControl('',Validators.required),
    nit: new FormControl('',Validators.required),
    usuario: new FormControl('',Validators.required),
    cargo: new FormControl('',Validators.required)
  });

  this.verAseguradoraForm = new FormGroup({
    nombre: new FormControl('',Validators.required),
    estadoAseguradora: new FormControl('',Validators.required),
    fechaCreacion: new FormControl('',Validators.required),
    razonSocial: new FormControl('',Validators.required),
    iva: new FormControl('',Validators.required),
    nit: new FormControl('',Validators.required),
    usuario: new FormControl('',Validators.required),
    cargo: new FormControl('',Validators.required)
  });

}
  
ngOnInit():void{
      console.log("Cargando ventana principal de aseguradoras...");  
      //this.usuariosList = [];
      this._estadoAseguradora="";
      this.aseguradoraService.getAseguradoras().subscribe({
        next: aseguradoras => {
          this.aseguradoras=aseguradoras
          console.log("Lista de aseguradas registradas...");
          console.log(JSON.stringify(this.aseguradoras));
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

    
    agregarAseguradora(){
        console.log("Abriendo formulario para agregar una nueva aseguradora...");
        this.displayDialog = true;
        //this.usuariosList = [];
        this.estadosAseguradora=[
          {label:'', value:null},
          {label:'Activo', value:"Activo"},
          {label:'Inactivo', value:"Inactivo"}
        ];

        this.registrarAseguradoraForm.controls['nombre'].setValue("");
        this.registrarAseguradoraForm.controls['razonSocial'].setValue("");
        this.registrarAseguradoraForm.controls['iva'].setValue("");
        this.registrarAseguradoraForm.controls['nit'].setValue("");
        this.registrarAseguradoraForm.controls['cargo'].setValue("");
        this._estadoAseguradora = "";
    }

    
    guardarAseguradora(){
        console.log("Cargando formulario para crear nueva aseguradora ... ");
        if(this._estadoAseguradora == "Activo"){
          this.estado=true;
        }
        else{
          this.estado=false;
        }

        this.aseguradoraService.guardarAseguradora(this.registrarAseguradoraForm,this.estado,this._userSeleccionado).subscribe({
            next: userLog => {
              if(userLog!=null){
                console.log("*** Aseguradora guardada: ");
                this.displayDialog = false;
                this.estadosAseguradora=[];
                this.usuariosList = [];
                this.msgs = [];
                this.msgs.push({severity:'success', summary:'Aseguradora creada', detail:''});
                this.alertService.success("Se ha creado la nueva aseguradora");
                setTimeout(() => {}, 3000);
                this.ngOnInit();
              }else{
                this.displayDialog = false;
                this.estadosAseguradora=[];
                this.usuariosList = [];
                this.msgs = [];
                this.msgs.push({severity:'danger', summary:'Error', detail:''});
                this.alertService.error("No se ha creado la aseguradora. Intente mas tarde");
                setTimeout(() => {}, 3000);
                this.ngOnInit();
              }
            },
            error: err=>{
              this.displayDialog = false;
              this.errorMessage=err;
              this.msgs = [];
                this.msgs.push({severity:'danger', summary:'Error', detail:''});
                this.alertService.error("No se pudo crear la aseguradora. Intente mas tarde.");
                setTimeout(() => {}, 3000);
                this.ngOnInit();
            }
        });
    }

    editarAseguradora(){
        console.log("editaremos el taller . .. ");
        this.dialogEditAseg=true;
        this._estadoAseguradora = "";

        this.estadosAseguradora=[
          {label:'', value:null},
          {label:'Activo', value:"Activo"},
          {label:'Inactivo', value:"Inactivo"}
        ];

        this.updateAsegForm.controls['idAseg'].setValue(this._aseguradoraSelected[0].id);
        this.updateAsegForm.controls['nombre'].setValue(this._aseguradoraSelected[0].nombre);
        this.updateAsegForm.controls['razonSocial'].setValue(this._aseguradoraSelected[0].razonsocial);
        this.updateAsegForm.controls['nit'].setValue(this._aseguradoraSelected[0].nit);
        this.updateAsegForm.controls['iva'].setValue(this._aseguradoraSelected[0].iva);
        this.updateAsegForm.controls['cargo'].setValue(this._aseguradoraSelected[0].cargo);
       
      }
    
      actualizarAseguradora(){
        console.log("Actualizando una aseguradora ... ");
        this.aseguradoraService.actualizarAseguradora(this.updateAsegForm,this._userSeleccionado).subscribe({
          next: asegLog => {
            if(asegLog != null){
              console.log("Hemos actualizado la asguradora " + JSON.stringify(asegLog));

              if (this._estadoAseguradora != ""){
                if(this._estadoAseguradora=="Activo"){
                  this.estado=true;
                }else{
                  this.estado=false;
                }
              
              this.aseguradoraService.actualizarEstado(this.updateAsegForm,this.estado).subscribe({
                  next: asegLog => {
                    if(asegLog != null){
                      console.log("*** Aseguradora actualizada: ");
                      this.dialogEditAseg=false;
                      this.estadosAseguradora=[];
                      this.usuariosList = [];
                      this.msgs = [];
                      this.msgs.push({severity:'success', summary:'Aseguradora actualizada', detail:''});
                      this.alertService.success("Se ha actualizado la aseguradora");
          
                      setTimeout(() => {}, 3000);
          
                      this.ngOnInit();
                    }else{
                      this.dialogEditAseg=false;
                      this.estadosAseguradora=[];
                      this.usuariosList = [];
                      this.msgs = [];
                      this.msgs.push({severity:'danger', summary:'Error', detail:''});
                      this.alertService.error("No se pudo actualizar el estado de la asrguradora. Actualice el estado nuevamente.");
                      setTimeout(() => {}, 3000);
                      this.ngOnInit();
                    }
                  },
                  error: err=>{
                    this.dialogEditAseg=false;
                    this.errorMessage=err;
                    this.msgs = [];
                      this.msgs.push({severity:'danger', summary:'Error', detail:''});
                      this.alertService.error("No se pudo actualizar la aseguradora. Intente mas tarde.");
                      setTimeout(() => {}, 3000);
                      this.ngOnInit();
                  }
              });
            }else{
              console.log("*** Aseguradora actualizado: ");
              this.dialogEditAseg=false;
              this._aseguradoraSelected = [];
              this.msgs = [];
              this.msgs.push({severity:'success', summary:'Aseguradora actualizada', detail:''});
              this.alertService.success("Se ha actualizado la aseguradora");
              setTimeout(() => {}, 3000);
              this.ngOnInit();
            }
            }else{
              this.dialogEditAseg=false;
              //this._proveedorSelected = [];
              this.msgs = [];
              this.msgs.push({severity:'danger', summary:'Error', detail:''});
              this.alertService.error("No se pudo actualizar el estado de la aseguradora. Actualice el estado nuevamente.");
              setTimeout(() => {}, 3000);
              this.ngOnInit();
            }
          },
          error: err=>{
            this.dialogEditAseg=false;
            this.errorMessage=err;
            this.msgs = [];
              this.msgs.push({severity:'danger', summary:'Error', detail:''});
              this.alertService.error("No se pudo actualizar la aseguradora. Intente mas tarde.");
              setTimeout(() => {}, 3000);
              this.ngOnInit();
          }
        }); //terminamos de actuzaliar la aseguradora
      }

      verAseguradora(){
        console.log("visualizaremos el taller . .. ");
        this.dialogVerAseg=true;
        this.verAseguradoraForm.controls['nombre'].setValue(this._aseguradoraSelected[0].nombre);
        if(this._aseguradoraSelected[0].estado){
          this.verAseguradoraForm.controls['estadoAseguradora'].setValue("Activo");
        }else{
          this.verAseguradoraForm.controls['estadoAseguradora'].setValue("Inactivo");
        }
        this.verAseguradoraForm.controls['fechaCreacion'].setValue(this._aseguradoraSelected[0].fechacreacion);
        this.verAseguradoraForm.controls['cargo'].setValue(this._aseguradoraSelected[0].cargo);
    this.verAseguradoraForm.controls['razonSocial'].setValue(this._aseguradoraSelected[0].razonsocial);
    this.verAseguradoraForm.controls['usuario'].setValue(this._aseguradoraSelected[0].usuario.nombre);
    this.verAseguradoraForm.controls['nit'].setValue(this._aseguradoraSelected[0].nit);
    this.verAseguradoraForm.controls['iva'].setValue(this._aseguradoraSelected[0].iva);
    }
    /*
  eliminarTaller(){
    console.log("eliminaremos el taller . .. ");
    this.dialogDelTlr=true;
    
  }

  eliminarTalr(){
    //llamanos al servicio que actualiza para cambiar el estado
    this.dialogDelTlr = false;
    this._tallerSelected = null;
    this.ngOnInit();
  }
  }*/
}
