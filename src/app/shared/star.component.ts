import { Component, OnInit } from '@angular/core';
import { AseguradoraService } from '../aseguradora/aseguradora.service';
import { IAseguradora } from '../_model/aseguradora.model';
import { SelectItem } from 'primeng/api';
import { HttpHeaders, XhrFactory, HttpClient } from '@angular/common/http';
import { FileUpload } from 'primeng/primeng';

@Component({
  templateUrl:'./star.component.html'
})

export class StarComponent implements OnInit{
  aseg: string;
  filtrado: any[]=[];
  listadoAsegs: IAseguradora[];
  uploadedFiles: any[] = [];
  encabezado: HttpHeaders;

  
  fileData: File = null;
  selectedFile: File = null;
previewUrl:any = null;
fileUploadProgress: string = null;
uploadedFilePath: string = null;

  constructor(private http: HttpClient,private aseguradoraService: AseguradoraService){}
  
  ngOnInit(){
    console.log("Consultando aseguradoras...  1 ");
    this.aseguradoraService.getAseguradoras().subscribe({
      next: data => {
        console.log("aseguradoras...");
        this.listadoAsegs = data;
      },
      error: err=>{}
    });
  }

fileProgress(fileInput: any) {
      this.fileData = <File>fileInput.target.files[0];
      this.preview();
}
 
preview() {
    // Show preview 
    var mimeType = this.fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
 
    var reader = new FileReader();      
    reader.readAsDataURL(this.fileData); 
    reader.onload = (_event) => { 
      this.previewUrl = reader.result; 
    }
}

fileSelected(event)
{
  this.selectedFile = <File>event.target.files[0];
  var reader = new FileReader();      
    reader.readAsDataURL(event.target.files[0]);
};
 
subirArchivo() {
    const dr = new FormData();
      dr.append('dr', this.selectedFile);


      this.http.put('http://4cdbf757.ngrok.io/autolink/rest/solicitud/foto/save/2',dr
       
      )
        .subscribe(res => {
          console.log(res);
          //this.uploadedFilePath = res.toString();
          alert('eexiitooo !!');
        })
}

  onUploadFinish(event) {
    console.log("Imagen .... " + event);
   }

  filtrarAseguradora(event){
    this.filtrado = [];
    for(let key in this.listadoAsegs){
      if(this.listadoAsegs.hasOwnProperty(key)){
        if(this.listadoAsegs[key].nombre.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
            this.filtrado.push(this.listadoAsegs[key].nombre);
        }
      }
    }
  }

  addHeaders(event): void{
    const formData: FormData = new FormData();
    const xhr = new XMLHttpRequest();

    for(let file of event.files) {
      formData.append('files', file);
  }

  xhr.open('POST', '/api/Data/UploadFiles', true);
   
  xhr.setRequestHeader('Content-Type','application/json');
  xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
  xhr.setRequestHeader('Origin', 'http://localhost:4200/star');
  xhr.setRequestHeader('Access-Control-Allow-Headers','X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method');
  xhr.setRequestHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  xhr.setRequestHeader('Allow', 'GET, POST, OPTIONS, PUT, DELETE');

  xhr.send(formData);
    
   /* this.encabezado= new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Origin': 'http://localhost:4200/star',
      'Access-Control-Allow-Headers': 'X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE',
      'Allow': 'GET, POST, OPTIONS, PUT, DELETE'
       }),*/

    //formData.append('file', file, file.name);

    //this.uploadedFiles.push(file);

   


  /*  this.httpClient
        .post<any>(url, formData)
        .subscribe(r => {
            // do what you need here
        }) */

  }

  onUpload(event) {
    for(let file of event.files) {
        this.uploadedFiles.push(file);
    }
}

  /*search(event) {
      let query = event.query;
      this.aseguradoraService.getAseguradoras().subscribe({
        next: data => {
          console.log("aseguradoras...");
          this.listadoAsegs = this.filterAseguradora(query,data);
        },
        error: err=>{}
      });
  }
  filterAseguradora(query,data:any[]):any[]{
    let filtered: any[] = [];
    for(let key in data){
      console.log("Llenamos el dropdownList de aseguradoras");
      if(data.hasOwnProperty(key)){
        filtered.push(data);
      }
    }
    return filtered;
  } */

  /*handleDropdown(event) {
     
  }*/

}


/******************************************************************************************************* */
/*import {Component,OnChanges,Input,Output,EventEmitter} from '@angular/core';
@Component({
  selector:'pm-star',
  templateUrl:'./star.component.html',
  styleUrls:['./star.component.css']
})
export class StarComponent implements OnChanges{
  @Input() rating:number;
  starWidth:number;
  @Output() ratingClicked: EventEmitter<string> = new EventEmitter<string>();
  onClick():void{
    this.ratingClicked.emit(`The rating ${this.rating} was clicked!`);
  }
  ngOnChanges():void{
    this.starWidth=this.rating*75/5;
  }
}
*/