import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { LoginService } from '../login/login.service';

@Component({
  //moduleId: module.id,
  selector: 'side-menu',
  templateUrl: './sideMenu.component.html'
  //styleUrls: [https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css]
})
export class SideMenuComponent {
    isLogged: boolean;
    //angularclassLogo = 'assets/img/log-app-av-header.svg';
    //@Output() ratingClicked: EventEmitter<string> = new EventEmitter<string>();
    constructor(private authService: LoginService){}  

    isLoggedIn(){
      this.isLogged = this.authService.isLoggedIn();
      //this.isLogged = false;
      console.log("VALIDANDO SI EL USER ESTA LOEGADO" + this.isLogged);
      //return this.isLogged;
      return this.isLogged
    }

    @Input() rating:number;
    starWidth:number;
    @Output() ratingClicked: EventEmitter<string> = new EventEmitter<string>();
  
    onClick():void{
      this.ratingClicked.emit(`The rating ${this.rating} was clicked!`);
    }
  
    ngOnChanges():void{
      this.starWidth=this.rating*75/5;
    }

    /*ngOnChanges():boolean{
      this.isLogged = this.isLoggedIn();
      return this.isLogged;
     // this.ratingClicked.emit(this.isLogged);
    } */

}
