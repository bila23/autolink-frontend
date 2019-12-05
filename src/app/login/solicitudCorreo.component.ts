import { Component, OnInit,ElementRef, ViewChild} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {LoginService} from './login.service';
import { FormGroup,  FormControl ,FormBuilder, Validators } from '@angular/forms';

@Component({
    templateUrl: './solicitudCorreo.component.html'
})
export class SolicitudCorreoComponent implements OnInit{
    loading = false;
    submitted = false;
    returnUrl: string;
    userTemp: string;
    passTemp: string;
    errorMessage:string;

    solicEmailForm = new FormGroup({
        username: new FormControl('',Validators.required),
    });

    constructor(private formBuilder: FormBuilder,private route: ActivatedRoute, private router: Router, private loginService: LoginService) {}

    ngOnInit() {
        console.log("Cargando ventana para solicitud de correo ...");
    }

    enviarCorreo(){
      console.log("Hacemos la solicitud para el envio de correo para cambiar contraseña...");
      localStorage.setItem('resetContra',JSON.stringify(true));
      this.loginService.solicitudCorreo(this.solicEmailForm.controls['username'].value).subscribe({
        next: generResp => {
                console.log("Se ha enviado correo ....");
        },
        error: err=>this.errorMessage=err
      })
      //this.router.navigate(['/resetContrasena']);
    }
}