import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FormsModule, ReactiveFormsModule,FormBuilder ,FormGroup  } from '@angular/forms';
import { AppComponent } from './app.component';
import {HttpClientModule} from '@angular/common/http';
import { RouterModule } from '@angular/router';
import {DialogModule} from 'primeng/dialog';
import {PanelModule} from 'primeng/panel';
import {DropdownModule} from 'primeng/dropdown';
import {TableModule} from 'primeng/table';
import {InputTextModule} from 'primeng/inputtext';
import {PaginatorModule} from 'primeng/paginator';
import { GrowlModule } from "primeng/components/growl/growl";
import { Message } from "primeng/components/common/api";
import {AutoCompleteModule} from 'primeng/autocomplete';
import {FileUploadModule} from 'primeng/fileupload';

import { LoginComponent } from "./login/login.component";
import { UserListComponent } from './users/user-list.component';
import {StarComponent} from './shared/star.component';
import {ConvertToSpacesPipe} from './shared/convert-to-spaces.pipe';
import { ProductDetailComponent } from './users/product-detail.component';
import { WelcomeComponent } from './home/welcomen.component';
import { ProductDetailGuard } from './users/product-detail.guard';
import {  SolicitudCorreoComponent } from './login/solicitudCorreo.component';
import { SideMenuComponent } from './header/SideMenu.component';
import { HeaderComponent } from './header/header.component';
import { ResetPassComponent } from './login/resetPass.component';
import { TallerListComponent } from './taller/taller-list.component';
import { DatePipe } from '@angular/common';
import { AseguradoraListComponent } from './aseguradora/aseguradora.component';
import { MarcaListComponent } from './marca/marca-list.component';
import { ProveedorListComponent } from './proveedor/proveedor-list.component';
import { ModeloListComponent } from './modelo/modelo-list.component';
import { AlertComponent } from './alert/alert.component';
import { RepuestoListComponent } from './repuestos/repuestos-list.component';
import { CallCenterComponent } from './callCenter/callCenter.component';
import { PreguntasUserComponent } from './login/preguntasUser.component';
import { PruebaComponent } from './prueba/prueba.component';


@NgModule({
  declarations: [
    AppComponent,HeaderComponent,UserListComponent,ConvertToSpacesPipe,StarComponent,LoginComponent,PreguntasUserComponent,ProductDetailComponent,
    WelcomeComponent,SolicitudCorreoComponent, SideMenuComponent,ResetPassComponent,TallerListComponent,AseguradoraListComponent,MarcaListComponent,ProveedorListComponent,ModeloListComponent,AlertComponent,RepuestoListComponent,CallCenterComponent, PruebaComponent
  ],
  imports: [
    BrowserModule,BrowserAnimationsModule,FormsModule,PanelModule,DropdownModule,TableModule,HttpClientModule, ReactiveFormsModule,DialogModule,InputTextModule,PaginatorModule,GrowlModule,NgbModule,AutoCompleteModule,FileUploadModule,
    RouterModule.forRoot([
      {path: 'login',component: LoginComponent},
      {path: 'solicitudCorreo',component: SolicitudCorreoComponent},
      {path: 'resetContrasena',component: ResetPassComponent},
      {path: 'crearPreguntas',component: PreguntasUserComponent},
      {path: 'users',component: UserListComponent},
      {path: 'header',component: HeaderComponent},
      //{path: 'products/:id',canActivate:[ProductDetailGuard],component: ProductDetailComponent},
      {path: 'talleres',component: TallerListComponent},
      {path: 'aseguradoras',component: AseguradoraListComponent},
      {path: 'marcas',component: MarcaListComponent},
      {path: 'modelos',component: ModeloListComponent},
      {path: 'proveedores',component: ProveedorListComponent},
      {path: 'repuestos',component: RepuestoListComponent},
      {path: 'callCenter',component: CallCenterComponent},
      {path: 'star',component: StarComponent},
      {path: 'welcome',component: WelcomeComponent},
      {path: 'prueba', component: PruebaComponent}
      //{path: '',component: WelcomeComponent,pathMatch: 'full'},
      //{path: '**',component: WelcomeComponent,pathMatch: 'full'} /* pagina 404*/
    ]) //,{useHash: true})
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
