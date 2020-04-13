import { Component, OnInit, Input } from '@angular/core';
import { IOferta } from '../_model/oferta.model'
import { empty } from 'rxjs';
import { Respuesta } from '../_model/respuesta-api.module'
import { ListofertprovService } from './listofertprov.service'

@Component({
  selector: 'app-listofertprov',
  templateUrl: './listofertprov.component.html',
  styleUrls: ['./listofertprov.component.css']
})
export class ListofertprovComponent implements OnInit {

  constructor(private solicitudService: ListofertprovService) { }  
  array_string: string;
  cols: any[];
  registro: IOferta[]=[];
  _registroSelected: IOferta[]=[];
  ofer: IOferta;
  provNombre: string;
  idProveedor: string;
  idSoli: string;
  respuesta: Respuesta[]=[];

  ngOnInit() {    
    this.CrearPantalla();
  }

  Inicializar(){
    
  }

  CrearPantalla(){    
    let array = [];            
    array = JSON.parse(this.array_string);

    for(let i in array){
      this.provNombre = array[i].proveedor;
      this.idProveedor = array[i].idProveedor;
      this.idSoli = array[i].id;

      console.log(array[i].id);      
      
      this.ofer = <IOferta>(array[i]);
      console.log(this.ofer);
      
      this.registro.push(this.ofer);
    }
    console.log("desde el dinamico registro");
    console.log(this.registro);

    this.cols = [];
    this.cols=[
      { field: 'repuesto', header: 'repuesto' },
      { field: 'cantidad', header: 'cantidad' },
      { field: 'tiempo', header: 'tiempo' },
      { field: 'precio', header: 'precio'}
    ];
  }

  ElegirProv(){
    console.log("Elegir prov");

    this.solicitudService.setGanador(this.idSoli, this.idProveedor).subscribe({
      next: result=>{
        this.respuesta = result;
        
        console.log("respuesta..");
        console.log(this.respuesta);

        alert("El ganador es: " + this.provNombre);
      }
    });
  }

}
