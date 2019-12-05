import { Component } from '@angular/core';
import {ActivatedRoute,Router} from '@angular/router'; 
import { LoginService } from './login/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
  //styleUrls: ['./app.component.css']
})
export class AppComponent {
 // title = 'Aseguradora';
  isLogged : boolean;
  isReset: boolean;
  isPreguntasPass: boolean;
  
  constructor(private  route:ActivatedRoute, private router:Router, private authService: LoginService){}

  ngOnInit():void{
    this.isReset = this.isResetContra();
    this.isLogged = this.isLoggedIn();
    


    if(this.isReset){
      this.router.navigate(['/resetContrasena']);
    }else if(this.isLogged){
      this.router.navigate(['/users']);
    }else{
      this.router.navigate(['/login']);
    }
  }

  isResetContra():boolean{
    let reset = localStorage.getItem('resetContra');
    this.isReset = (reset != null ?true: false);
    return this.isReset;
  }

  isLoggedIn(){
    this.isLogged = this.authService.isLoggedIn();
    //this.isLogged = true;
    console.log("VALIDANDO SI EL USER ESTA LOEGADO" + this.isLogged);
    //return this.isLogged;
    return this.isLogged;
  }

}