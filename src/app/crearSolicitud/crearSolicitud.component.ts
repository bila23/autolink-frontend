import { Component, OnInit} from '@angular/core';
import { HttpClientModule, HttpErrorResponse, HttpClient, HttpHeaders } from '@angular/common/http';
import { SelectItem, Message } from 'primeng/api';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AlertService } from '../alert/alert.service';
import { IMarca } from '../_model/marca.model';
import { MarcaService } from '../marca/marca.service';
import { AseguradoraService } from '../aseguradora/aseguradora.service';
import { IAseguradora } from '../_model/aseguradora.model';
import { RepuestoService } from '../repuestos/repuestos.service';
import { IRepuesto } from '../_model/repuesto.model';
import { SolicitudService } from './solicitud.service';
import { IGenericResponse } from '../_model/genericResponse.model';
import { ISolicitud } from '../_model/solicitud.model';
import { ILoginResponse } from '../_model/loginResponse.model';
import { IUser } from '../_model/user.model';
import { ITaller } from '../_model/taller.model';
import { IRepsSolic } from '../_model/repsSol.model';
import { IRepuestoXSol } from '../_model/repuestpoXSoli.model';
import { IFotoXSolicitud } from '../_model/FotoxSol.model';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  templateUrl: './crearSolicitud.component.html'
})
export class CrearSolicitudComponent implements OnInit {
  private url = localStorage.getItem('API');

  retrievedImage: any;
  base64Data: any;
  retrieveResonse: any;

  msgs: Message[] = [];
  errorMessage: string;
  userL: ILoginResponse;
  usuario: IUser;
  usrTaller: ITaller;
  mostrarRepuestos: boolean;
  mostrarImagenes: boolean;
  repuestos: IRepuesto[] = [];
  cod_save: number;
  rep_sol: IRepuestoXSol[] = [];
  img_sol: IFotoXSolicitud[] = [];
  selectedFile: File = null;

  cols: any[];
  clonedRepuestos: { [s: string]: IRepsSolic; } = {};


  _marcaSeleccionada: string;

  _repuestoSelected: IRepuesto[];
  _aseguradoraSeleccionada: string;
  crearSolicitudTaller: FormGroup;
  repuestoForm: FormGroup;

  codigo: string;
  marcasSource: IMarca[];
  aseguradoraSource: IAseguradora[];

  solicitud: ISolicitud;


  marcasModelo: SelectItem[] = [];
  aseguradoras: SelectItem[] = [];

  get marcaSeleccionada(): string {
    return this._marcaSeleccionada;
  }

  set marcaSeleccionada(value: string) {
    this._marcaSeleccionada = value;
  }

  constructor(private httpClient: HttpClient, private marcaService: MarcaService, private asegService: AseguradoraService, private solicitudService: SolicitudService, private alertService: AlertService, private sanitizer: DomSanitizer) {

    this.crearSolicitudTaller = new FormGroup({
      codigoSol: new FormControl('', Validators.required),
      nombre: new FormControl('', Validators.required),
      marca: new FormControl('', Validators.required),
      modelo: new FormControl('', Validators.required),
      anho: new FormControl('', Validators.required),
      tipoV: new FormControl('', Validators.required),
      placa: new FormControl('', Validators.required),
      chasis: new FormControl('', Validators.required),
      motor: new FormControl('', Validators.required),
      siniestro: new FormControl('', Validators.required),
      poliza: new FormControl('', Validators.required),
      aseguradora: new FormControl('', Validators.required),
      tiempo: new FormControl('', Validators.required),
      repuestos: new FormControl('', Validators.required),
      cantidadRep: new FormControl('', Validators.required),
      comentarios: new FormControl('', Validators.required)
    });

    this.repuestoForm = new FormGroup({
      id_repuesto: new FormControl('0', Validators.required)
    });

  }

  ngOnInit(): void {

    this.marcasSource = [];
    this._marcaSeleccionada = "";
    this.mostrarRepuestos = false;
    this.mostrarImagenes = false;

    this.aseguradoraSource = [];

    // OBTENIENDO CODIGO DE SOLICITUD
    this.solicitudService.generarCodigo().subscribe({
      next: codigo => {
        this.codigo = codigo.toString();
        this.crearSolicitudTaller.controls['codigoSol'].setValue(this.codigo);
      },
      error: err => this.errorMessage = err
    });

    //CARGANDO LISTA DE MARCAS
    this.marcaService.getMarcas().subscribe(marcas => {
      this.marcasSource = marcas;
      if (this.marcasSource && this.marcasSource.length > 0) {
        for (let key in this.marcasSource) {
          if (this.marcasSource.hasOwnProperty(key)) {
            this.marcasModelo.push({ label: this.marcasSource[key].nombre, value: { id: this.marcasSource[key].id, nombre: this.marcasSource[key].nombre } });
          }
        }
      }
    });

    //CARGANDO LAS ASEGURADORAS
    this.asegService.getAseguradoras().subscribe(aseguradoras => {
      this.aseguradoraSource = aseguradoras;
      if (this.aseguradoraSource && this.aseguradoraSource.length > 0) {
        for (let key in this.aseguradoraSource) {
          if (this.aseguradoraSource.hasOwnProperty(key)) {
            this.aseguradoras.push({ label: this.aseguradoraSource[key].nombre, value: { id: this.aseguradoraSource[key].id, nombre: this.aseguradoraSource[key].nombre } });
          }
        }
      }
    });
  }//CIERRE DE ONINIT

  limpiarForm() {
    this.crearSolicitudTaller.reset();
    this.ngOnInit();
  }

  save_repuestos() {
    const id_rep = this.repuestoForm.controls['id_repuesto'].value;
    if (id_rep > 0) {
      this.solicitudService.guardarRepXSol(this.cod_save, id_rep).subscribe({
        next: respxSol => {
          this.msgs = [];
          this.msgs.push({ severity: 'success', summary: 'Repuesto guardado', detail: '' });
          this.alertService.success("Se ha guardado el repuesto correctamente");

          //RECUPERO LOS REPUESTOS QUE HE GUARDADO
          this.solicitudService.consultarRepXSol(this.cod_save).subscribe({
            next: rep_sol => {
              this.rep_sol = rep_sol;
            }
          });
        }
      });
    }
  }

  delete_repuestos(id_repuesto: number) {
    this.solicitudService.deleteRepXSol(this.cod_save, id_repuesto).subscribe(data => {
      //RECUPERO LOS REPUESTOS QUE HE GUARDADO
      this.solicitudService.consultarRepXSol(this.cod_save).subscribe({
        next: rep_sol => {
          this.rep_sol = rep_sol;
        }
      });
    });

  }

  show_images_form() {
    this.mostrarImagenes = true;
  }

  fileSelected(event) {
    this.selectedFile = <File>event.target.files[0];
    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
  };

  subirArchivo() {
    const dr = new FormData();
    dr.append('dr', this.selectedFile);

    this.solicitudService.guardarFoto(this.cod_save, dr).subscribe({
      next: respxSol => {
        this.msgs = [];
        this.msgs.push({ severity: 'success', summary: 'Foto guardada', detail: '' });
        this.alertService.success("Se ha guardado la foto");
        setTimeout(() => { }, 3000);
        //RECUPERO LAS IMAGENES GUARDADAS POR SOLICITUD
        // this.solicitudService.consultarFotoSol(this.cod_save).subscribe({
        //   next: img_sol => {
        //     this.img_sol = img_sol;
        //     console.log(this.img_sol);
        //   }
        // });

        // this.solicitudService.consultarFotoSol(this.cod_save).subscribe({
        //   next: img_sol => {
        //     this.img_sol = img_sol;
        //     this.retrieveResonse = this.img_sol[0].foto;
        //     this.base64Data = this.retrieveResonse.picByte;
        //     this.retrievedImage = 'data:image/jpeg;base64,' + this.base64Data;
        //   }
        // });

        // this.solicitudService.consultarFotoSol(this.cod_save).subscribe((baseImage: any) =>{
        //   let objectURL = 'data:image/jpeg;base64,' + baseImage.foto;
        //   this.thumbnail = this.sanitizer.bypassSecurityTrustUrl(objectURL);
        // });
        const httpOptions = {
          headers: { 'Content-Type': 'application/json', 
                     'Access-Control-Allow-Origin': '*' ,
                     'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
          },
          params: { id: this.cod_save.toString() }
        };
        console.log('1');
        this.httpClient.get(this.url + '/rest/solicitud/foto', httpOptions).subscribe(
          res => {
            console.log('2');
            this.retrieveResonse = res;
            console.log('3');
            this.base64Data = this.retrieveResonse.foto;
            console.log('4');
            this.retrievedImage = 'data:image/jpeg;base64,' + this.base64Data;
            console.log('5');
          }
        )
      }
    });
  }

  guardarSolicitud(estado: string, respS: IRepsSolic) {
    this.solicitudService.consultarUsuario().subscribe(usr => {
      this.usuario = usr;
      if (this.usuario != null) {
        this.solicitudService.consultarTaller().subscribe(usrTaller => {
          this.usrTaller = usrTaller;
          if (this.usrTaller != null) {
            this.solicitudService.guardarSolicitud(estado, this.usuario, this.usrTaller, this.crearSolicitudTaller, this._marcaSeleccionada, this._aseguradoraSeleccionada).subscribe({
              next: solicitudCreada => {
                this.solicitud = solicitudCreada;
                if (this.solicitud && this.solicitud != null) {
                  this.cod_save = this.solicitud.id
                  this.msgs = [];
                  this.msgs.push({ severity: 'success', summary: 'Éxito', detail: '' });
                  this.alertService.error("Se ha almacenado la solicitud.");
                  setTimeout(() => { }, 3000);
                  this.ngOnInit();
                  this.mostrarRepuestos = true;
                  //RECUPERO LOS REPUESTOS
                  this.solicitudService.findRepuestos().subscribe({
                    next: repuestos => {
                      this.repuestos = repuestos;
                    }
                  });


                } else {
                  this.msgs = [];
                  this.msgs.push({ severity: 'danger', summary: 'Error', detail: '' });
                  this.alertService.error("No se ha podido almacenar el repuesto.");
                  setTimeout(() => { }, 3000);
                  this.ngOnInit();
                }
              },
              error: err => this.errorMessage = err
            });
          } else {
            this.msgs = [];
            this.msgs.push({ severity: 'danger', summary: 'Error', detail: '' });
            this.alertService.error("No se ha encontrado el taller para el usuario logeado.");
            setTimeout(() => { }, 3000);
            this.ngOnInit();
          }
        });//cierre de consultar el taller del usuario              
      } else {
        this.msgs = [];
        this.msgs.push({ severity: 'danger', summary: 'Error', detail: '' });
        this.alertService.error("No se ha encontrado el usuario. Intente mas tarde");
        setTimeout(() => { }, 3000);
        this.ngOnInit();
      }//cierre validacion de usuario != null
    }); // cierre consultar usuario
  }//CIERRE DE GUARDAR SOLICITUD

}