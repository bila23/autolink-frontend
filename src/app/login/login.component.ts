
import { Component, OnInit,ElementRef, ViewChild} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {LoginService} from './login.service';
import { FormGroup,  FormControl ,FormBuilder, Validators } from '@angular/forms';
import { ILoginResponse } from '../_model/loginResponse.model';
import { Message } from 'primeng/primeng';
import { AlertService } from '../alert/alert.service';
import { UserService } from '../users/user-list.services';
import { IUser } from '../_model/user.model';
import { IPregXuser } from '../_model/pregXuser.model';

@Component({
    templateUrl: './login.component.html'
    //styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
    msgs: Message[] = [];
    loading = false;
    submitted = false;
    returnUrl: string;
    userTemp: string;
    passTemp: string;
    errorMessage:string;
    userResponse: ILoginResponse;
    isPreguntasPass:boolean;
 

   loginForm = new FormGroup({
      username: new FormControl('',Validators.required),
      pwd: new FormControl('',Validators.required),
    });

    constructor(private formBuilder: FormBuilder,private route: ActivatedRoute, private router: Router, private loginService: LoginService,private userService: UserService,private alertService: AlertService) {}

    ngOnInit() {
        console.log("Cargando ventana de login ...");

        if(localStorage.getItem("currentUser") != null){
             this.router.navigate(['/users']);
        }else{
            this.router.navigate(['/login']);
        }
        //this.returnUrl = this.route.snapshot.queryParams['welcome'] || '/';
    }
   
    login() {
        //this.submitted = true;
        //this.alertService.clear();
        //this.loading = true;
        console.log("Llamaremos al servicio de login . . .");
        console.log(this.loginForm.value);
        this.userTemp = this.loginForm.controls['username'].value;
        this.passTemp = this.loginForm.controls['pwd'].value;
        console.log("username: " + this.userTemp);
        console.log("pass: " + this.passTemp);

        this.loginService.getUserLogOn(this.loginForm.controls['username'].value,this.loginForm.controls['pwd'].value).subscribe({
            next: userLog => {
                //
                console.log("*** Obtuvimos el usuario del logon: " + JSON.parse(JSON.stringify(localStorage.getItem('currentUser'))));
                this.userResponse= userLog;
                if(this.userResponse.mensaje == "Ingreso exitoso"){
                    localStorage.setItem('currentUser',JSON.stringify(this.userResponse));
                    console.log("Valores de los usuarios --> nombre (antes del for): " + this.userResponse.nombre);

                    // let userLogOn =JSON.parse(localStorage.getItem('currentUser'));// || [];
                     console.log("Mostrando los datos del usuario logeado...");
     
                     for (let i = 0; i < localStorage.length; i++){
                         let key = localStorage.key(i);
                         let value = localStorage.getItem(key);
                         console.log(key, value);
                     }
                     /*for(let key in this.userResponse){
                         if(this.userResponse.hasOwnProperty(key)){
                             //console.log("Valores de los usuarios --> id: " + this.userResponse[key].id);
                             console.log("Valores de los usuarios --> nombre: " + this.userResponse[key].nombre);
                             console.log("Valores de los usuarios --> usuario: " + this.userResponse[key].user);
                             console.log("Valores de los usuarios --> idTipo: " + this.userResponse[key].idTipo);
                             console.log("Valores de los usuarios --> idTipo: " + this.userResponse[key].tipo);
                         }
                     }*/
                     this.router.navigate(['/users']);
                }else{
                    console.log("No se ha podido autenticar");
                    this.loginForm.controls['username'].setValue("");
                    this.loginForm.controls['pwd'].setValue("");
                    this.msgs = [];
                    this.msgs.push({severity:'danger', summary:'Login fallido', detail:'Ingrese credenciales válidas'});
                    this.alertService.error("No se ha podido autenticar");
                    this.router.navigate(['/login']);
                }
            },
            error: err=>this.errorMessage=err
        });
    }

    recuperarContrasenha(){
      console.log("Vamos a recuperar la contrasenha...");
      this.router.navigate(['/solicitudCorreo']);
    }


    crearContrasenha(){
        console.log("Vamos a crear la contrasenha y preguntas de seguridad...");
        this.router.navigate(['/crearPreguntas']);

    }

    
}
