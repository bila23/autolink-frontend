import { Component, OnInit } from '@angular/core';
import { SelectItem, Message } from 'primeng/api';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IMarca } from '../_model/marca.model';
import { MarcaService } from './marca.service';
import { AlertService } from '../alert/alert.service';

@Component({
  templateUrl: './marca-list.component.html'
})
export class MarcaListComponent implements OnInit {
  msgs: Message[] = [];
  marcas: IMarca[] = [];
  _marcaSelected: IMarca[];
  _estadoMarca: string;
  estadosMarca: SelectItem[];
  estado: boolean;
  errorMessage: string;
  displayDialog: boolean;
  dialogVerMarca: boolean;
  dialogEditMrc: boolean;

  cols: any[];

  registrarMarcaForm: FormGroup;
  verMarcaForm: FormGroup;
  updateMarcaForm: FormGroup;

  constructor(private marcaService: MarcaService, private alertService: AlertService) {
    this.cols = [
      { field: 'id', header: 'numero' },
      { field: 'nombre', header: 'nombre' }
    ];

    this.registrarMarcaForm = new FormGroup({
      nombre: new FormControl('', Validators.required),
      estadoMarca: new FormControl('', Validators.required)
    });

    this.verMarcaForm = new FormGroup({
      nombre: new FormControl('', Validators.required),
      estadoMarca: new FormControl('', Validators.required),
      fechaCreacion: new FormControl('', Validators.required)
    });

    this.updateMarcaForm = new FormGroup({
      idMrc: new FormControl('', Validators.required),
      nombre: new FormControl('', Validators.required),
      estadoMarca: new FormControl('', Validators.required)
    });
  }

  ngOnInit(): void {
    this._estadoMarca = "";
    this.marcaService.getMarcas().subscribe({
      next: marcas => {
        this.marcas = marcas;
      },
      error: err => this.errorMessage = err
    });
  }

  agregarMarca() {
    this.displayDialog = true;
    this.estadosMarca = [
      { label: '', value: null },
      { label: 'Activo', value: "Activo" },
      { label: 'Inactivo', value: "Inactivo" }
    ];

    this.registrarMarcaForm.controls['nombre'].setValue("");
    this._estadoMarca = "";
  }

  guardarMarca() {
    if (this._estadoMarca == "Activo") {
      this.estado = true;
    }
    else {
      this.estado = false;
    }

    this.marcaService.guardarMarca(this.registrarMarcaForm, this.estado).subscribe({
      next: marcaLog => {
        if (marcaLog != null) {
          this.displayDialog = false;
          this.estadosMarca = [];
          this._marcaSelected = [];
          this.msgs = [];
          this.msgs.push({ severity: 'success', summary: 'Marca creada', detail: '' });
          this.alertService.success("Se ha creado la nueva marca");
          setTimeout(() => { }, 3000);
          this.ngOnInit();
        } else {
          this.displayDialog = false;
          this.estadosMarca = [];
          this._marcaSelected = [];
          this.msgs = [];
          this.msgs.push({ severity: 'danger', summary: 'Error', detail: '' });
          this.alertService.error("No se ha creado la marca. Intente mas tarde");
          setTimeout(() => { }, 3000);
          this.ngOnInit();
        }
      },
      error: err => {
        this.displayDialog = false;
        this.errorMessage = err;
        this.msgs = [];
        this.msgs.push({ severity: 'danger', summary: 'Error', detail: '' });
        this.alertService.error("No se pudo crear la marca. Intente mas tarde.");
        setTimeout(() => { }, 3000);
        this.ngOnInit();
      }
    });
  }

  editarMarca() {
    this._estadoMarca = "";
    this.estadosMarca = [
      { label: '', value: null },
      { label: 'Activo', value: "Activo" },
      { label: 'Inactivo', value: "Inactivo" }
    ];

    this.dialogEditMrc = true;
    this.updateMarcaForm.controls['idMrc'].setValue(this._marcaSelected[0].id);
    this.updateMarcaForm.controls['nombre'].setValue(this._marcaSelected[0].nombre);
    var est = "";
    if(this._marcaSelected[0].estado)
      est = "Activo";
    else
      est = "Inactivo";
    this.updateMarcaForm.controls['estadoMarca'].setValue(est);
  }

  update_marca(){
    if (this.updateMarcaForm.controls['estadoMarca'].value == "Activo") {
      this.estado = true;
    } else {
      this.estado = false;
    }

    this.marcaService.actualizarEstado(this.updateMarcaForm, this.estado).subscribe({
      next: marcaLog => {
        if (marcaLog != null) {
          this.dialogEditMrc = false;
          this._marcaSelected = [];
          this.msgs = [];
          this.msgs.push({ severity: 'success', summary: 'Marca actualizada', detail: '' });
          this.alertService.success("Se ha actualizado la marca");
          setTimeout(() => { }, 3000);
          this.ngOnInit();
        } else {
          this.dialogEditMrc = false;
          this._marcaSelected = [];
          this.msgs = [];
          this.msgs.push({ severity: 'danger', summary: 'Error', detail: '' });
          this.alertService.error("No se pudo actualizar el estado de la marca. Actualice el estado nuevamente.");
          setTimeout(() => { }, 3000);
          this.ngOnInit();
        }
      },
      error: err => {
        this.displayDialog = false;
        this.errorMessage = err;
        this.msgs = [];
        this.msgs.push({ severity: 'danger', summary: 'Error', detail: '' });
        this.alertService.error("No se pudo actualizar la marca. Intente mas tarde.");
        setTimeout(() => { }, 3000);
        this.ngOnInit();
      }
    });
  }

  actualizarMarca() {
    if (this._estadoMarca != "") {
      if (this._estadoMarca == "Activo") {
        this.estado = true;
      } else {
        this.estado = false;
      }
      this.marcaService.actualizarEstado(this.updateMarcaForm, this.estado).subscribe({
        next: marcaLog => {
          if (marcaLog != null) {
            this.dialogEditMrc = false;
            this._marcaSelected = [];
            this.msgs = [];
            this.msgs.push({ severity: 'success', summary: 'Marca actualizada', detail: '' });
            this.alertService.success("Se ha actualizado la marca");
            setTimeout(() => { }, 3000);
            this.ngOnInit();
          } else {
            this.dialogEditMrc = false;
            this._marcaSelected = [];
            this.msgs = [];
            this.msgs.push({ severity: 'danger', summary: 'Error', detail: '' });
            this.alertService.error("No se pudo actualizar el estado de la marca. Actualice el estado nuevamente.");
            setTimeout(() => { }, 3000);
            this.ngOnInit();
          }
        },
        error: err => {
          this.displayDialog = false;
          this.errorMessage = err;
          this.msgs = [];
          this.msgs.push({ severity: 'danger', summary: 'Error', detail: '' });
          this.alertService.error("No se pudo actualizar la marca. Intente mas tarde.");
          setTimeout(() => { }, 3000);
          this.ngOnInit();
        }
      });
    }
  }

  verMarca() {
    this.dialogVerMarca = true;
    this.verMarcaForm.controls['nombre'].setValue(this._marcaSelected[0].nombre);
    if (this._marcaSelected[0].estado == 1) {
      this.verMarcaForm.controls['estadoMarca'].setValue("Activo");
    } else {
      this.verMarcaForm.controls['estadoMarca'].setValue("Inactivo");
    }
    this.verMarcaForm.controls['fechaCreacion'].setValue(this._marcaSelected[0].fechacreacion);
  }
}
