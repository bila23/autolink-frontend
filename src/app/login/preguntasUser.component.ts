
import { Component, OnInit,ElementRef, ViewChild} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {LoginService} from './login.service';
import { FormGroup,  FormControl ,FormBuilder, Validators } from '@angular/forms';
import { IUser } from '../_model/user.model';
import { Message, SelectItem } from 'primeng/primeng';
import { AlertService } from '../alert/alert.service';
import { IPreguntas } from '../_model/preguntas.model';
import { UserService } from '../users/user-list.services';
import { IPregXuser } from '../_model/pregXuser.model';

@Component({
    templateUrl: './preguntasUser.component.html'
})
export class PreguntasUserComponent implements OnInit{
    loading = false;
    submitted = false;
    errorMessage:string;
    user: IUser;
    msgs: Message[] = [];
    preguntasList: SelectItem[]=[];
    preguntasSource: IPreguntas[];
    

    usuarios: IUser[];
    pregsUser:IPregXuser;

    _preguntaSelect1: IPreguntas;
    _preguntaSelect2: IPreguntas;
    _preguntaSelect3: IPreguntas;


    preguntasUserFrom = new FormGroup({
      username: new FormControl('',Validators.required),
      pwd: new FormControl('',Validators.required),
      pregunta1: new FormControl('',Validators.required),
      pregunta2: new FormControl('',Validators.required),
      pregunta3: new FormControl('',Validators.required),
      resp1: new FormControl('',Validators.required),
      resp2: new FormControl('',Validators.required),
      resp3: new FormControl('',Validators.required),
      pwd_repeat: new FormControl('',Validators.required),
    });


    constructor(private formBuilder: FormBuilder,private route: ActivatedRoute, private router: Router, private loginService: LoginService, private userService:UserService, private alertService:AlertService) {}

    ngOnInit() {
        console.log("Cargando ventana de para creacion de preguntas y contraseña ...");
       
         //Consultando la lista de usuarios registrados
       this.loginService.getPreguntas().subscribe(preguntasSource => {
        this.preguntasSource = preguntasSource;
        if(this.preguntasSource && this.preguntasSource.length > 0){
            for(let key in this.preguntasSource){
                 console.log("Llenamos el dropdownList de preguntas");
                 if(this.preguntasSource.hasOwnProperty(key)){
                     this.preguntasList.push({label: this.preguntasSource[key].pregunta, value: {id:this.preguntasSource[key].id,pregunta:this.preguntasSource[key].pregunta}});
                 }
            }
        }
     });

     this.userService.getUsuarios().subscribe({
        next: usuarios => {
          this.usuarios=usuarios
          console.log("Lista de usuarios registrados...");
          console.log(JSON.stringify(this.usuarios));
          
        },
        error: err=>this.errorMessage=err
      });
    }

    preguntasUser(){
        
        for(let key in this.usuarios){
            if(this.usuarios.hasOwnProperty(key)){
                if(this.usuarios[key].usuario == this.preguntasUserFrom.controls['username'].value){
                    this.user = this.usuarios[key];
                } 
            }
          }
          //GUARDANDO PRIMER PREGUNTA
          this.loginService.savePreguntas(this._preguntaSelect1.id,this.user.id,this.preguntasUserFrom.controls['resp1'].value).subscribe({
            next: pregsUsr => {
                this.pregsUser= pregsUsr;
                if(this.pregsUser.id != null){
                    console.log("Preguntas del usuario: " + JSON.stringify(this.pregsUser));
                     //this.router.navigate(['/users']);
                    this.pregsUser = null;
                      //GUARDANDO SEGUNDA PREGUNTA
                    this.loginService.savePreguntas(this._preguntaSelect2.id,this.user.id,this.preguntasUserFrom.controls['resp2'].value).subscribe({
                        next: pregsUsr => {
                            this.pregsUser= pregsUsr;
                            if(this.pregsUser.id != null){
                                console.log("Preguntas del usuario: " + JSON.stringify(this.pregsUser));
                                //this.router.navigate(['/users']);
                                this.pregsUser = null;
                                  //GUARDANDO TERCERA PREGUNTA
                                    this.loginService.savePreguntas(this._preguntaSelect3.id,this.user.id,this.preguntasUserFrom.controls['resp3'].value).subscribe({
                                        next: pregsUsr => {
                                            this.pregsUser= pregsUsr;
                                            if(this.pregsUser.id != null){
                                                console.log("Preguntas del usuario: " + JSON.stringify(this.pregsUser));
                                                this.cambiarPass();//this.router.navigate(['/users']);
                                            }else{

                                                this.msgs = [];
                                                this.msgs.push({severity:'danger', summary:'Error', detail:'Error creando preguntas'});
                                                this.alertService.error("No se han podido registrar sus preguntas y contraseña");
                                                this.router.navigate(['/login']);
                                            }
                                        },
                                        error: err=>this.errorMessage=err
                                    });
                            }else{
                                this.msgs = [];
                                this.msgs.push({severity:'danger', summary:'Error', detail:'Error creando preguntas'});
                                this.alertService.error("No se han podido registrar sus preguntas y contraseña");
                                this.router.navigate(['/login']);
                            }
                        },
                        error: err=>this.errorMessage=err
                    });
                }else{
                    this.msgs = [];
                    this.msgs.push({severity:'danger', summary:'Error', detail:'Error creando preguntas'});
                    this.alertService.error("No se han podido registrar sus preguntas y contraseña");
                    this.router.navigate(['/login']);
                }
            },
            error: err=>this.errorMessage=err
        });
      } 

    

    cambiarPass(){
        if(this.preguntasUserFrom.controls['pwd'].value != this.preguntasUserFrom.controls['pwd_repeat'].value){

            this.preguntasUserFrom.controls['username'].setValue("");
            this.preguntasUserFrom.controls['pwd'].setValue("");
            this.preguntasUserFrom.controls['pwd_repeat'].setValue("");

            this.msgs = [];
            this.msgs.push({severity:'danger', summary:'Contraseña invalida', detail:'Las contraseñas deben coincidir'});
            this.alertService.error("Repita de nuevo las contraseñas");
            console.log("Las contraseñas deben coincidir ...");
        }else{
            console.log("Llamamos al servicio de guardar usuario para actualizar su contraseña ...");
           this.loginService.cambiarContraseña(this.preguntasUserFrom.controls['username'].value, this.preguntasUserFrom.controls['pwd'].value)
            .subscribe({
                next: userLog => {
                    if(userLog!=null){
                        console.log("*** Obtuvimos el usuario del cambio de contrasenha: " + JSON.stringify(userLog));

                        this.msgs = [];
                        this.msgs.push({severity:'success', summary:'Contraseña actualizadda', detail:'Se ha actualizado su contrasenha'});
                        this.alertService.success("Contraseña actualizada");
                        
                        setTimeout(() => {
                                            this.router.navigate(['/login']);
                                        },
                                    3000
                        );
                    }else{
                        this.msgs = [];
                        this.msgs.push({severity:'danger', summary:'Actualizacion fallida', detail:'No se ha podido actualizar su contrasenha. Intente mas tarde'});
                        this.alertService.error("No se ha actualizado su contrasenha");
                        this.preguntasUserFrom.controls['username'].setValue("");
                        this.preguntasUserFrom.controls['pwd'].setValue("");
                        this.preguntasUserFrom.controls['pwd_repeat'].setValue("");

                        setTimeout(() => {
                                            this.router.navigate(['/login']);
                                        },
                                    3000
                        );
                        this.router.navigate(['/login']);
                    }
                    
                },
                error: err=>this.errorMessage=err
            });
        }
       
    }
}
