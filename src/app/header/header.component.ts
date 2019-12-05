import { Component, OnChanges, OnInit } from '@angular/core';
import { LoginService } from '../login/login.service';
import { Router } from '@angular/router';
import { ILoginResponse } from '../_model/loginResponse.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
  //styleUrls: ['./app.component.css']
})
export class HeaderComponent implements OnInit, OnChanges {
 // title = 'Aseguradora';
  isLogged : boolean;
  userLog: ILoginResponse;
  nombreUser:string;
  emailUser:string;
  //_listFilter:boolean;

  constructor(private authService: LoginService, private router:Router){}

/*  get listFilter(): boolean{
    return this._listFilter;
}

set listFilter(value:boolean){
    this._listFilter = value;
    //this.filteredUsers=this.listFilter?this.performFilter(this.listFilter):this.usuarios;
}*/

ngOnChanges(){
  }

ngOnInit(){
  if(JSON.stringify(localStorage.getItem('currentUser')) != null){
    console.log("HEADER: USER LOGEADO " + JSON.stringify(localStorage.getItem('currentUser')));
   this.userLog = JSON.parse(JSON.parse(JSON.stringify(localStorage.getItem('currentUser'))));
   console.log("HEADER:  " + JSON.stringify(this.userLog));
   //this.nombreUser = this.userLog.nombre;
   //this.emailUser = this.userLog.user;
  } 
}

 principalUsuario(){
    this.router.navigate(['/users']);
  }

  principalTaller(){
    this.router.navigate(['/talleres']);
  }

  principalAseguradora(){
    this.router.navigate(['/aseguradoras']);
  }

  principalMarca(){
    this.router.navigate(['/marcas']);
  }

  principalProveedor(){
    this.router.navigate(['/proveedores']);
  }

  principalModelo(){
    this.router.navigate(['/modelos']);
  }

  principalRepuesto(){
    this.router.navigate(['/repuestos']);
  }

  principalCallCenter(){
    this.router.navigate(['/callCenter']);
  }

  principalStar(){
    this.router.navigate(['/star']);
  }

  logOut(){
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}