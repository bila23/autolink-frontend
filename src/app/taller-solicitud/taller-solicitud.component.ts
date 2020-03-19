import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { SolicitudtableroService } from '../container2/solicitudtablero.service'
import { tallerSolicitudService } from './taller-solicitud.service'
import { IResultByStates } from '../_model/resultbystates.module'
import { IRepuesto } from '../_model/repuesto.model'
import { SelectItem, Message } from 'primeng/api';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IResultUpdateModule } from '../_model/result-update.module'

@Component({
  selector: 'app-taller-solicitud',
  templateUrl: './taller-solicitud.component.html',
  styleUrls: ['./taller-solicitud.component.css']
})
export class TallerSolicitudComponent implements OnInit {
  repuestos: IRepuesto[] = [];
  registro: IResultByStates[] = [];
  _registroSelected: IResultByStates[];
  cols: any[];
  dialogEditSoli: boolean;
  dialogEstado: boolean;
  estadosSoli: SelectItem[];
  _estadoSoli: string;
  updateSoliForm: FormGroup;
  estadoSolForm: FormGroup;
  resultUpdateCometAsegu: IResultUpdateModule;
  registroview: IRepuesto[] = [];
  verpiezaSoli: SelectItem[];
  dialogVerPieza: boolean;
  cols_verpiezas: any[];
  MostrarTabla: boolean;


  constructor(private solicitudService: SolicitudtableroService, private el: ElementRef, private tallerService: tallerSolicitudService, private router: Router) {
    this.estadoSolForm = new FormGroup({});
    this.updateSoliForm = new FormGroup({
      id: new FormControl('', Validators.required),
      NoReclamo: new FormControl('', Validators.required),
      placa: new FormControl(''),
      chasis: new FormControl(''),
      motor: new FormControl(''),
      comentariosAseguradora: new FormControl('')
    });
  }

  goToForm() {
    // alert('ir a formulario');
    this.MostrarTabla = false;
    this.router.navigate(['/crearsolicitud']);
  }

  backToForm() {
    this.MostrarTabla = true;
  }

  ngOnInit() {
    this.BuildStatus("ING");
    this.MostrarTabla = true;
  }

  BuildStatus(estado: string) {
    this.solicitudService.getSolicitudesByStatus(estado).subscribe({
      next: registro => {
        this.registro = registro;
      }
    })

    this.cols = [];
    this.cols = [
      { field: 'nombreAsegurado', header: 'Propietario' },
      { field: 'tipoVehiculo', header: 'Tipo' },
      { field: 'siniestro', header: 'Siniestro' },
      { field: 'motor', header: 'Motor' },
      { field: 'placa', header: 'Placa' }
    ];

    this.ChangeUlSelected(estado);
  }

  ChangeUlSelected(estado: string) {
    let a_ing = document.getElementById("a_ing");
    let a_anu = document.getElementById("a_anu");
    let a_dep = document.getElementById("a_dep");
    let a_esc = document.getElementById("a_esc");
    let a_cpd = document.getElementById("a_cpd");
    let a_cea = document.getElementById("a_cea");

    /*removemos la clase active */
    a_ing.classList.remove("active");
    a_anu.classList.remove("active");
    a_dep.classList.remove("active");
    a_esc.classList.remove("active");
    a_cpd.classList.remove("active");
    a_cea.classList.remove("active");
    /*fin removemos la clase active */

    if (estado.toLowerCase() === "ing") {
      a_ing.classList.add("active");
      this.hideCesta();
    } else if (estado.toLowerCase() === "anu") {
      a_anu.classList.add("active");
      this.hideCesta();
    } else if (estado.toLowerCase() === "dep") {
      a_dep.classList.add("active");
      this.hideCesta();
      this.showCesta();
    } else if (estado.toLowerCase() === "esc") {
      a_esc.classList.add("active");
      this.hideCesta();
    } else if (estado.toLowerCase() === "cpd") {
      a_cpd.classList.add("active");
      this.hideCesta();
    } else if (estado.toLowerCase() === "cea") {
      a_cea.classList.add("active");
      this.hideCesta();
    }
  }

  VerPiezasSolicitud() {
    this.registroview = [];
    this.verpiezaSoli = [
      { label: '', value: null },
      { label: 'Activo', value: "Activo" },
      { label: 'Inactivo', value: "Inactivo" }
    ];

    if (typeof this._registroSelected !== typeof undefined) {
      let id_selected = this._registroSelected[0].id;

      this.dialogVerPieza = true;
      this.solicitudService.getPiezasSoli(id_selected.toString()).subscribe({
        next: registro => {

          for (let re in registro) {
            this.registroview.push(registro[re].repuesto);
          }
        }
      })

      this.cols_verpiezas = [];
      this.cols_verpiezas = [
        { field: "nombre", header: "Nombre" },
        { field: "valor", header: "Precio" }
      ]
    }
  }

  hideCesta() {
    var cesta = document.getElementById('cesta');
    cesta.classList.remove("show");
    cesta.classList.add("hide");
  }
  showCesta() {
    var cesta = document.getElementById('cesta');
    cesta.classList.remove("hide");
    cesta.classList.add("show");
  }

  MostrarAlerta() {
    if (typeof this._registroSelected !== typeof undefined)
      this.dialogEstado = true;
  }

  mostrar_repuestos(id: number) {
    console.log('Entro al metodo: ' + id);
    this.tallerService.mostrarRepuestos(id).subscribe({
      next: repuesto => {
        this.repuestos = repuesto;
        console.log(repuesto);
      }
    })
  }

  hideDialogEstado() {
    this.dialogEstado = false;
  }

  CambiarEstado() {
    if (typeof this._registroSelected !== typeof undefined) {
      let id = this._registroSelected[0].id;
      this.tallerService.SetEstado(id, 'ESC').subscribe({
        next: result => {
          this.resultUpdateCometAsegu = result[0];
          this.hideDialogEstado();
          this.BuildStatus('ESC');
          this._registroSelected = undefined;
        }
      })
    }
  }


}