import { Component, OnInit } from '@angular/core';
import { IResultByStates } from '../_model/resultbystates.module'
import { SolicitudtableroprovService } from './solicitudtableroprov.service'

@Component({
  selector: 'app-container4',
  templateUrl: './container4.component.html',
  styleUrls: ['./container4.component.css']
})
export class Container4Component implements OnInit {
  registro: IResultByStates[]=[];
  cols: any[];
  constructor(private solicitudService:SolicitudtableroprovService) { 

  }

  ngOnInit() {
  }

  BuildStatus(estado:string){
    console.log("BuildStatus: " + estado);
    console.log("construir tabla para solicitudes ingresadas");
    //INGRESADA (ING)
    this.solicitudService.getSolicitudesByStatus(estado).subscribe({
      next: registro =>{
        this.registro=registro;
        console.log("console.. buildstatus_ingresadas");
        console.log(registro);
      }
    })

    this.cols = [];
    this.cols=[
      { field: 'fechaInicio', header: 'Fecha' },
      { field: 'codigoSolicitud', header: 'codigoSolicitudas' },
      { field: 'id', header: 'id' },
      { field: 'placa', header: 'placa'},
      { field: 'chasis', header: 'chasis' },
      { field: 'motor', header: 'motor' },
      { field: 'comentariosTaller', header: 'comentariosTaller' },
      { field: 'comentariosAseguradora', header: 'comentariosAseguradora' }
    ];

    this.ChangeUlSelected(estado);
  }

  ChangeUlSelected(estado:string){
    let a_coa =document.getElementById("a_coa");
    let a_dpp =document.getElementById("a_dpp");
    let a_goc =document.getElementById("a_goc");

    /*removemos la clase active */
    a_coa.classList.remove("active");
    a_dpp.classList.remove("active");
    a_goc.classList.remove("active");
    /*fin removemos la clase active */

    if (estado.toLowerCase() === "coa"){
      a_coa.classList.add("active");
    }else if (estado.toLowerCase() === "dpp"){
      a_dpp.classList.add("active");
    }else if (estado.toLowerCase() === "goc"){
      a_goc.classList.add("active");
    }
  }
}
