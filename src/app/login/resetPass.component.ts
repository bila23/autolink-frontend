
import { Component, OnInit,ElementRef, ViewChild} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {LoginService} from './login.service';
import { FormGroup,  FormControl ,FormBuilder, Validators } from '@angular/forms';
import { IUser } from '../_model/user.model';
import { Message } from 'primeng/primeng';
import { AlertService } from '../alert/alert.service';

@Component({
    templateUrl: './resetPass.component.html'
})
export class ResetPassComponent implements OnInit{
    loading = false;
    submitted = false;
    returnUrl: string;
    userTemp: string;
    passTemp: string;
    errorMessage:string;
    user: IUser;
    msgs: Message[] = [];

    resetPassForm = new FormGroup({
      username: new FormControl('',Validators.required),
      pwd: new FormControl('',Validators.required),
      pwd_repeat: new FormControl('',Validators.required),
    });

    constructor(private formBuilder: FormBuilder,private route: ActivatedRoute, private router: Router, private loginService: LoginService, private alertService:AlertService) {}

    ngOnInit() {
        console.log("Cargando ventana de cambio de contraseña ...");
        //this.returnUrl = this.route.snapshot.queryParams['welcome'] || '/';
        localStorage.removeItem('resetContra');
    }

    cambiarPass(){
        if(this.resetPassForm.controls['pwd'].value != this.resetPassForm.controls['pwd_repeat'].value){

            this.resetPassForm.controls['username'].setValue("");
            this.resetPassForm.controls['pwd'].setValue("");
            this.resetPassForm.controls['pwd_repeat'].setValue("");

            this.msgs = [];
            this.msgs.push({severity:'danger', summary:'Contraseña invalida', detail:'Las contraseñas deben coincidir'});
            this.alertService.error("Repita de nuevo las contraseñas");
            //this.router.navigate(['/resertContrasenha']);

           

            console.log("Las contraseñas deben coincidir ...");
        }else{
            console.log("Llamamos al servicio de guardar usuario para actualizar su contraseña ...");
           this.loginService.cambiarContraseña(this.resetPassForm.controls['username'].value, this.resetPassForm.controls['pwd'].value)
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
                        this.resetPassForm.controls['username'].setValue("");
                        this.resetPassForm.controls['pwd'].setValue("");
                        this.resetPassForm.controls['pwd_repeat'].setValue("");

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
