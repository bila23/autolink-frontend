import {Component,OnInit} from '@angular/core';
import {SelectItem, Message} from 'primeng/api';
import { IUser } from '../_model/user.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IUserVista } from '../_model/userVista.model';
import { LoginService } from '../login/login.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { UserService } from './user-list.services';
import { ITipoUsuario } from '../_model/tipoUsuario.model';
import { AlertService } from '../alert/alert.service';
import { Router } from '@angular/router';

@Component({
  //selector:'app-root',
  templateUrl:'./user-list.component.html'
  //styleUrls:['./product-list.component.css']
})
export class UserListComponent implements OnInit{

 /* title:string='Lista de productos';
  imageWidth:number=50;
  imageMargin:number=2;
  showImage:boolean=true;
  filteredProducts:IProduct[] = [];
  products: IProduct[] = [];
  errorMessage:string;
  usuario:IUser; */
  msgs: Message[] = [];
  first: number = 0;
  usuarios: IUser[]=[];
  usuariosView: IUserVista[]=[];
  
  filteredUsers:IUser[] = [];
  errorMessage:string;
  displayDialog:boolean;
  dialogVerUser: boolean;
  dialogEditUsr: boolean;
  dialogDelUsr: boolean;
  _usuarioSelected: IUserVista[];
  cols: any[];

  //formulario registro de usuarios
  registrarUserForm:FormGroup;
  verUserForm: FormGroup;
  updateUserForm: FormGroup;
  tiposUsuarios: SelectItem[]=[];
  tiposUsuariosSource: ITipoUsuario[];
  estadosUsuario: SelectItem[];

  _tipoUsrActual: number;
  _estadoUsuarioActual:number;

  _tipoSeleccionado: string;
  _estadoUsuario: string;
  estado: boolean;
  _estadoUsuarioEdit: boolean;
  _tipoSeleccionadoEdit: string;
  estadoCopy:boolean;

  get tipoSeleccionado(): string{
      return this._tipoSeleccionado;
  }

  set tipoSeleccionado(value:string){
      this._tipoSeleccionado = value;
      //this.filteredUsers=this.listFilter?this.performFilter(this.listFilter):this.usuarios;
  }

  get estadoUsuario(): string{
    return this._estadoUsuario;
}

set estadoUsuario(value:string){
    this._estadoUsuario = value;
    //this.filteredUsers=this.listFilter?this.performFilter(this.listFilter):this.usuarios;
}

   /*_listFilter:string;
  get listFilter(): string{
      return this._listFilter;
  */

  /*set listFilter(value:string){
      this._listFilter = value;
      this.filteredUsers=this.listFilter?this.performFilter(this.listFilter):this.usuarios;
  }*/

  constructor(private userService:UserService, private loginService:LoginService, private alertService:AlertService){

   

    /*this.tiposUsuarios=[
      {label:'Aseguradora', value:{id:1,name:'aseguradora'}},
      {label:'Taller', value:{id:2,name:'taller'}},
      {label:'Proveedor', value:{id:3,name:'proveedor'}}
    ];*/

   

    this.registrarUserForm = new FormGroup({
      usuario: new FormControl('',Validators.required),
      nombre: new FormControl('',Validators.required),
      tipoUsuario: new FormControl('',Validators.required),
      estadoUsuario: new FormControl('',Validators.required)
    });

    this.verUserForm = new FormGroup({
      usuario: new FormControl('',Validators.required),
      nombre: new FormControl('',Validators.required),
      tipoUsuario: new FormControl('',Validators.required),
      estadoUsuario: new FormControl('',Validators.required),
      fechaCreacion: new FormControl('',Validators.required)
    });

    this.updateUserForm = new FormGroup({
      idUsr: new FormControl('',Validators.required),
      usuario: new FormControl('',Validators.required),
      nombre: new FormControl('',Validators.required),
      tipoUsuario: new FormControl('',Validators.required),
      estadoUsuario: new FormControl('',Validators.required)
    });

  }

 /*ngOnInit():void{
  let userLogOn =JSON.parse(localStorage.getItem('currentUser'));// || [];
    console.log("Cargando ventana principal de productos...");

    for (let i = 0; i < localStorage.length; i++){
      let key = localStorage.key(i);
      let value = localStorage.getItem(key);
      console.log(key, value);
    }

    //console.log("**** user: " + this.usuario.nombre);
    this.productService.getProducts().subscribe({
      next: products => {
        this.products=products
        this.filteredProducts = this.products;
      },
      error: err=>this.errorMessage=err
    });
  } */

  ngOnInit():void{
    //let userLogOn =JSON.parse(localStorage.getItem('currentUser'));// || [];
      console.log("Cargando ventana principal de usuarios...");
      this.tiposUsuarios = [];
      //this.estadoUsuario=[];
      this._estadoUsuario="";
      this._tipoSeleccionado="";
      //this.estadoUsuario=[];
      //this._usuarioSelected=[];
      //this.estadoCopy=null;
      //this._estadoUsuarioEdit=null;

     
  
     /* for (let i = 0; i < localStorage.length; i++){
        let key = localStorage.key(i);
        let value = localStorage.getItem(key);
        console.log(key, value);
      } */

      
        
      this.userService.getUsuarios().subscribe({
        next: usuarios => {
          this.usuarios=usuarios
          console.log("Lista de usuarios registrados...");
          console.log(JSON.stringify(this.usuarios));
          //this.filteredUsers = this.usuarios;
          for(let key in this.usuarios){
            if(this.usuarios.hasOwnProperty(key)){
              this.usuariosView[key]={
                id:this.usuarios[key].id,
                usuario:this.usuarios[key].usuario,
                nombre:this.usuarios[key].nombre,
                pass:this.usuarios[key].contra,
                usuariocrea: this.usuarios[key].usuariocrea,
                estado: this.usuarios[key].estado,
                fechacreacion: this.usuarios[key].fechacreacion,

                idTipo: this.usuarios[key].tipo.id,
                nombreTipo:this.usuarios[key].tipo.nombre,
                estadoTipo: this.usuarios[key].tipo.estado,
                fechacreacionTipo: this.usuarios[key].tipo.fechacreacion,
                usuariocreaTipo: this.usuarios[key].tipo.usuariocrea
              }
            }
          }
        
          console.log("User view: " + JSON.stringify(this.usuariosView));
        },
        error: err=>this.errorMessage=err
      });

      //CARGANDO LISTA DE TIPOS DE USUARIOS
      
      this.userService.getTiposUsuarios().subscribe(tiposUsuarios => {
        this.tiposUsuariosSource = tiposUsuarios;
        //this.tiposUsuarios.push({label: "Tipo de usuario", value: null});
        if(this.tiposUsuariosSource && this.tiposUsuariosSource.length > 0){
            for(let key in this.tiposUsuariosSource){
                 console.log("Llenamos el dropdownList de tipos de usuario");
                 if(this.tiposUsuariosSource.hasOwnProperty(key)){
                     this.tiposUsuarios.push({label: this.tiposUsuariosSource[key].nombre, value: {id:this.tiposUsuariosSource[key].id,nombre:this.tiposUsuariosSource[key].nombre}});
                 }
            }
        }
     });

     this.cols = [];
      this.cols=[
        { field: 'usuario', header: 'usuario' },
        { field: 'nombre', header: 'nombre' },
        { field: 'pass', header: 'contraseña' },
        { field: 'nombreTipo', header: 'Tipo de Usuario'}
      ];
    }

    reset() {
      this.first = 0;
    }
      //QUEMANDO LISTA DE USUARIOS
      /*let array=[1,2,3];
      for(let i in array){
        console.log("quemando lista de usuarios..");
        if(array.hasOwnProperty(i)){
          this.usuariosView[i]={id:+i,usuario:"usuario",nombre:"nombre",email:"email",contra:"pass",nombreTipo:"nombreTipo"};
        }
      }
      */

  /*toggleImage():void{
    this.showImage=!this.showImage;
  }*/

  /*
  performFilter(filterBy:string):IUser[]{
    filterBy = filterBy.toLocaleLowerCase();
    return this.usuarios.filter((user:IUser)=>user.nombre.toLocaleLowerCase().indexOf(filterBy) !== -1);
  }
*/

  agregarUsuario(){
    console.log("Abriendo formulario para agregar un nuevo usuario ... ");
    this.displayDialog = true;

    this.estadosUsuario=[
      {label:'', value:null},
      {label:'Activo', value:"Activo"},
      {label:'Inactivo', value:"Inactivo"}
    ];

    this.registrarUserForm.controls['usuario'].setValue("");
    this.registrarUserForm.controls['nombre'].setValue("");
    this._tipoSeleccionado = "";
    this._estadoUsuario = "";

  
  }

  guardarUser(){
    console.log("Guardando nuevo usuario ... ESTADO: " + this._estadoUsuario);

    if(this._estadoUsuario == "Activo"){
      this.estado=true;
    }
    else{
      this.estado=false;
    }
    this.userService.guardarUsuario(this.registrarUserForm,this._tipoSeleccionado,this.estado).subscribe({
        next: userLog => {
          if(userLog != null){
            console.log("*** Usuario guardado: ");
            this.displayDialog = false;
            this.estadosUsuario=[];
            this.msgs = [];
            this.msgs.push({severity:'success', summary:'Usuario creado', detail:''});
            this.alertService.success("Se ha creado el nuevo usuario");

            setTimeout(() => {}, 3000);

            this.ngOnInit();
          }else{
            this.displayDialog = false;
            this.estadosUsuario=[];
            this.msgs = [];
            this.msgs.push({severity:'danger', summary:'Error', detail:''});
            this.alertService.error("No se ha creado el usuario. Intente mas tarde");

            setTimeout(() => {}, 3000);

            this.ngOnInit();
          }
        },
        error: err=>{
          this.displayDialog = false;
          this.errorMessage=err;
          this.msgs = [];
            this.msgs.push({severity:'danger', summary:'Error', detail:''});
            this.alertService.error("No se pudo crear el usuario. Intente mas tarde.");
            setTimeout(() => {}, 3000);
            this.ngOnInit();
        }
    });
  }

  editarUsuario(){
    console.log("editaremos el usuario . .. ");
    this._estadoUsuario = "";
    this.estadosUsuario=[
      {label:'', value:null},
      {label:'Activo', value:"Activo"},
      {label:'Inactivo', value:"Inactivo"}
    ];

    //this._estadoUsuario = false;
    this.dialogEditUsr=true;
    this.updateUserForm.controls['idUsr'].setValue(this._usuarioSelected[0].id);
    this.updateUserForm.controls['usuario'].setValue(this._usuarioSelected[0].usuario);
    this.updateUserForm.controls['nombre'].setValue(this._usuarioSelected[0].nombre);
 

    /*this._tipoUsrActual= this._usuarioSelected[0].idTipo;
    this._estadoUsuarioActual=this._usuarioSelected[0].estado;*/
    
  //  this._usuarioSelected[0].idTipo = null;
    //this._tipoSeleccionado = "";

    //this.updateUserForm.controls['tipoUsuario'].setValue(this._usuarioSelected[0].nombreTipo);
    //this._tipoUsrActual = this._usuarioSelected[0].nombreTipo;
    /*this.userService.getTiposUsuarios().subscribe(tiposUsuarios => {
      this.tiposUsuariosSource = tiposUsuarios;
      //this.tiposUsuarios.push({label: "Tipo de usuario", value: null});
      if(this.tiposUsuariosSource && this.tiposUsuariosSource.length > 0){
          for(let key in this.tiposUsuariosSource){
              console.log("Llenamos el dropdownList de tipos de usuario");
              if(this.tiposUsuariosSource.hasOwnProperty(key)){
                  this.tiposUsuarios.push({label: this.tiposUsuariosSource[key].nombre, value: {id:this.tiposUsuariosSource[key].id,nombre:this.tiposUsuariosSource[key].nombre}});
              }
          }
      }
    });*/
   /* this._tipoSeleccionado = this._tipoUsrActual;
    this._estadoUsuarioActual = this._usuarioSelected[0].estado;
    this._estadoUsuario = (this._estadoUsuarioActual ? true: false);*/
  }

  actualizarUser(){
    console.log("Actualizando un usuario ... ");
    //this.estadoCopy = this._estadoUsuario;
    if ( this._tipoSeleccionado != "" && this._estadoUsuario != ""){
      this.userService.actualizarUsuario(this.updateUserForm,this._tipoSeleccionado).subscribe({
          next: userLog => {
            if(userLog != null){
              console.log("*** Se actualizo tipo y estado: ESTADO" + this._estadoUsuario);
              if(this._estadoUsuario=="Activo"){
                this.estado=true;
              }else{
                this.estado=false;
              }
              if(this._estadoUsuario != ""){
                this.userService.actualizarEstado(this.updateUserForm.controls['usuario'].value,this.estado).subscribe({
                    next: userAc => {
                        if(userAc != null){
                          this.dialogEditUsr = false;
                          this.estadosUsuario=[];
                          this.msgs = [];
                          this.msgs.push({severity:'success', summary:'Usuario actualizado', detail:''});
                          this.alertService.success("Se ha actualizado el usuario");
              
                          setTimeout(() => {}, 3000);
              
                          this.ngOnInit();
                        }else{
                          this.dialogEditUsr = false;
                          this.estadosUsuario=[];
                          this.msgs = [];
                          this.msgs.push({severity:'danger', summary:'Error', detail:''});
                          this.alertService.error("No se pudo actualizar el estado del usuario. Actualice el estado nuevamente.");
              
                          setTimeout(() => {}, 3000);
              
                          this.ngOnInit();
                        }                      
                    },
                    error: err=>{
                      this.dialogEditUsr = false;
                      this.errorMessage=err;
                      this.msgs = [];
                        this.msgs.push({severity:'danger', summary:'Error', detail:''});
                        this.alertService.error("No se pudo actualizar el usuario. Intente mas tarde.");
                        setTimeout(() => {}, 3000);
                        this.ngOnInit();
                    }
                });
              }
            }else{
              this.dialogEditUsr = false;
              this.estadosUsuario=[];
              this.msgs = [];
              this.msgs.push({severity:'danger', summary:'Error', detail:''});
              this.alertService.error("No se pudo actualizar el usuario. Intente mas tarde");
  
              setTimeout(() => {}, 3000);
  
              this.ngOnInit();
            }
              
          },
          error: err=>{
            this.dialogEditUsr = false;
            this.errorMessage=err;
            this.msgs = [];
              this.msgs.push({severity:'danger', summary:'Error', detail:''});
              this.alertService.error("No se pudo actualizar el usuario. Intente mas tarde..");
              setTimeout(() => {}, 3000);
              this.ngOnInit();
          }
      });
    }else if(this._tipoSeleccionado != "" && this._estadoUsuario == ""){
      this.userService.actualizarUsuario(this.updateUserForm,this._tipoSeleccionado).subscribe({
        next: userLog => {
          if(userLog != null){
            console.log("*** Se actualizo tipo: ");
            this.dialogEditUsr = false;
            this.estadosUsuario=[];
            this.msgs = [];
            this.msgs.push({severity:'success', summary:'Usuario actualizado', detail:''});
            this.alertService.success("Se ha actualizado el tipo de usuario");
            setTimeout(() => {}, 3000);
            this.ngOnInit();
          }else{
            this.dialogEditUsr = false;
            this.estadosUsuario=[];
            this.msgs = [];
            this.msgs.push({severity:'danger', summary:'Error', detail:''});
            this.alertService.error("No se pudo actualizar el tipo del usuario. Intente mas tarde");
            setTimeout(() => {}, 3000);
            this.ngOnInit();
          }
          
        },
        error: err=>{
          this.dialogEditUsr = false;
          this.errorMessage=err;
          this.msgs = [];
            this.msgs.push({severity:'danger', summary:'Error', detail:''});
            this.alertService.error("No se pudo actualizar el tipo del usuario. Intente mas tarde.");
            setTimeout(() => {}, 3000);
            this.ngOnInit();
        }
    });
  }else if(this._tipoSeleccionado == "" && this._estadoUsuario != ""){
    if(this._estadoUsuario=="Activo"){
      this.estado=true;
    }else{
      this.estado=false;
    }
    this.userService.actualizarEstado(this.updateUserForm.controls['usuario'].value,this.estado).subscribe({
      next: userLog => {
        if(userLog != null){
          console.log("*** Se actualizo estado: ");
          this.dialogEditUsr = false;
          this.estadosUsuario=[];
          this.msgs = [];
          this.msgs.push({severity:'success', summary:'Usuario actualizado', detail:''});
          this.alertService.success("Se ha actualizado el estado del usuario");
          setTimeout(() => {}, 3000);
          this.ngOnInit();
        }else{
          this.dialogEditUsr = false;
          this.estadosUsuario=[];
          this.msgs = [];
          this.msgs.push({severity:'danger', summary:'Error', detail:''});
          this.alertService.error("No se pudo actualizar el estado del usuario. Intente mas tarde");
          setTimeout(() => {}, 3000);
          this.ngOnInit();
        }
      },
      error: err=>{
        this.dialogEditUsr = false;
        this.errorMessage=err;
        this.msgs = [];
          this.msgs.push({severity:'danger', summary:'Error', detail:''});
          this.alertService.error("No se pudo actualizar el estado del usuario. Intente mas tarde.");
          setTimeout(() => {}, 3000);
          this.ngOnInit();
      }
  });
  }
  //this._estadoUsuario = "";

    
    this.dialogEditUsr=false;
   
    /*else if(this._estadoUsuarioEdit != null){
      this.userService.actualizarEstado(this.updateUserForm.controls['usuario'].value,this.estadoCopy).subscribe({
          next: userAc => {
            this.dialogEditUsr=false;
           // this.estadoUsuario=[];
            //this._usuarioSelected=[];
            this.ngOnInit();
          },
          error: err=>this.errorMessage=err
      });
    }*/

   /* this.userService.actualizarEstado(this.updateUserForm.controls['usuario'].value,this.estadoCopy).subscribe({
      next: userAc => {
        this.dialogEditUsr=false;
       // this.estadoUsuario=[];
        //this._usuarioSelected=[];
        this.ngOnInit();
      },
      error: err=>this.errorMessage=err
  }); */
  
  }

  /*eliminarUsuario(){
    console.log("eliminaremos el usuario . .. ");
    this.dialogDelUsr = true;
  }

  eliminarUser(){
      this.dialogDelUsr = false;
      this._usuarioSelected = null;
      this.ngOnInit();
  } */
  
  verUsuario(){
    console.log("visualizaremos el usuario . .. ");
    this.dialogVerUser=true;
    this.verUserForm.controls['usuario'].setValue(this._usuarioSelected[0].usuario);
    this.verUserForm.controls['nombre'].setValue(this._usuarioSelected[0].nombre);
    this.verUserForm.controls['tipoUsuario'].setValue(this._usuarioSelected[0].nombreTipo);
    if(this._usuarioSelected[0].estado==1){
      this.verUserForm.controls['estadoUsuario'].setValue("Activo");
    }else{
      this.verUserForm.controls['estadoUsuario'].setValue("Inactivo");
    }
    
    this.verUserForm.controls['fechaCreacion'].setValue(this._usuarioSelected[0].fechacreacion);
  }


  /*onRatingClicked(message:string):void{
    this.title= 'Product List: '+message;
  }*/
}
