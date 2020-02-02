import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-headerview2',
  templateUrl: './headerview2.component.html',
  styleUrls: ['./headerview2.component.css']
})
export class Headerview2Component implements OnInit {

  constructor(private authService: LoginService, private router: Router) { }
  NombreUsuario: string;

  ngOnInit() {
    this.NombreUsuario=localStorage.getItem("NombreUser");
  }

  logOut(){
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
