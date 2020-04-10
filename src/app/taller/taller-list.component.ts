import { Component, OnInit } from '@angular/core';
import { SelectItem, Message } from 'primeng/api';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ITaller } from '../_model/taller.model';
import { TallerService } from './taller.service';
import { AlertService } from '../alert/alert.service';
import { IUser } from '../_model/user.model';
import { UserService } from '../users/user-list.services';

@Component({
  templateUrl: './taller-list.component.html'
})
export class TallerListComponent implements OnInit {
  msgs: Message[] = [];
  talleres: ITaller[] = [];
  _tallerSelected: ITaller[];
  _estadoTaller: string;
  estadosTaller: SelectItem[];
  estado: boolean;
  usuariosSource: IUser[];
  usuariosList: SelectItem[] = [];
  _userSeleccionado: string;

  filteredTalleres: ITaller[] = [];
  errorMessage: string;
  displayDialog: boolean;
  dialogVerTaller: boolean;
  dialogEditTlr: boolean;
  dialogDelTlr: boolean;

  cols: any[];

  registrarTallerForm: FormGroup;
  verTallerForm: FormGroup;
  updateTallerForm: FormGroup;

  constructor(private tallerService: TallerService, private userService: UserService, private alertService: AlertService) {
    this.cols = [
      { field: 'id', header: 'numero' },
      { field: 'nombre', header: 'nombre' }
    ];

    this.registrarTallerForm = new FormGroup({
      nombre: new FormControl('', Validators.required),
      estadoTaller: new FormControl('', Validators.required),
      razonSocial: new FormControl('', Validators.required),
      telefono: new FormControl('', Validators.required),
      direccion: new FormControl('', Validators.required),
      usuario: new FormControl('', Validators.required),
      cargo: new FormControl('', Validators.required)
    });

    this.verTallerForm = new FormGroup({
      nombre: new FormControl('', Validators.required),
      estadoTaller: new FormControl('', Validators.required),
      fechaCreacion: new FormControl('', Validators.required),
      razonSocial: new FormControl('', Validators.required),
      direccion: new FormControl('', Validators.required),
      telefono: new FormControl('', Validators.required),
      usuario: new FormControl('', Validators.required),
      cargo: new FormControl('', Validators.required)
    });

    this.updateTallerForm = new FormGroup({
      idTlr: new FormControl('', Validators.required),
      nombre: new FormControl('', Validators.required),
      estadoTaller: new FormControl('', Validators.required),
      razonSocial: new FormControl('', Validators.required),
      direccion: new FormControl('', Validators.required),
      telefono: new FormControl('', Validators.required),
      usuario: new FormControl('', Validators.required),
      cargo: new FormControl('', Validators.required)
    });
  }

  ngOnInit(): void {
    this._estadoTaller = "";
    this.tallerService.getTalleres().subscribe({
      next: talleres => {
        this.talleres = talleres
      },
      error: err => this.errorMessage = err
    });

    this.userService.getUsuarios().subscribe(usuariosSource => {
      this.usuariosSource = usuariosSource;
      if (this.usuariosSource && this.usuariosSource.length > 0) {
        for (let key in this.usuariosSource) {
          if (this.usuariosSource.hasOwnProperty(key)) {
            this.usuariosList.push({ label: this.usuariosSource[key].nombre, value: { id: this.usuariosSource[key].id, nombre: this.usuariosSource[key].nombre } });
          }
        }
      }
    });
  }

  agregarTaller() {
    this.displayDialog = true;
    this.estadosTaller = [
      { label: '', value: null },
      { label: 'Activo', value: "Activo" },
      { label: 'Inactivo', value: "Inactivo" }
    ];
    this.registrarTallerForm.controls['nombre'].setValue("");
    this.registrarTallerForm.controls['razonSocial'].setValue("");
    this.registrarTallerForm.controls['telefono'].setValue("");
    this.registrarTallerForm.controls['direccion'].setValue("");
    this._estadoTaller = "";
  }

  guardarTaller() {
    console.log("Cargando formulario para crear nuevo taller ... ");
    if (this._estadoTaller == "Activo") {
      this.estado = true;
    }
    else {
      this.estado = false;
    }

    this.tallerService.guardarTaller(this.registrarTallerForm, this.estado, this._userSeleccionado).subscribe({
      next: tallerLg => {
        if (tallerLg != null) {
          this.displayDialog = false;
          this.estadosTaller = [];
          this.usuariosList = [];
          this.msgs = [];
          this.msgs.push({ severity: 'success', summary: 'Taller creado', detail: '' });
          this.alertService.success("Se ha creado el nuevo taller");

          setTimeout(() => { }, 3000);

          this.ngOnInit();
        } else {
          this.displayDialog = false;
          this.estadosTaller = [];
          this.usuariosList = [];
          this.msgs = [];
          this.msgs.push({ severity: 'danger', summary: 'Error', detail: '' });
          this.alertService.error("No se ha creado el taller. Intente mas tarde");

          setTimeout(() => { }, 3000);

          this.ngOnInit();
        }

      },
      error: err => {
        this.displayDialog = false;
        this.errorMessage = err;
        this.msgs = [];
        this.msgs.push({ severity: 'danger', summary: 'Error', detail: '' });
        this.alertService.error("No se pudo crear el taller. Intente mas tarde.");
        setTimeout(() => { }, 3000);
        this.ngOnInit();
      }
    });
  }

  editarTaller() {
    this.dialogEditTlr = true;
    this.updateTallerForm.controls['idTlr'].setValue(this._tallerSelected[0].id);
    this.updateTallerForm.controls['nombre'].setValue(this._tallerSelected[0].nombre);
    this.updateTallerForm.controls['razonSocial'].setValue(this._tallerSelected[0].razonsocial);
    this.updateTallerForm.controls['direccion'].setValue(this._tallerSelected[0].direccion);
    this.updateTallerForm.controls['telefono'].setValue(this._tallerSelected[0].telefono);
    this.updateTallerForm.controls['cargo'].setValue(this._tallerSelected[0].cargo);
    this.updateTallerForm.controls['estadoTaller'].setValue(this._tallerSelected[0].estado);
    this.updateTallerForm.controls['usuario'].setValue(this._tallerSelected[0].usuario.nombre);
  }

  actualizar_estado(estadoUpdate : boolean){
    this.tallerService.actualizarEstado(this.updateTallerForm, estadoUpdate).subscribe({
      next: tallerLog => {
        if (tallerLog != null) {
          this.dialogEditTlr = false;
          this.estadosTaller = [];
          this.usuariosList = [];
          this.msgs = [];
          this.msgs.push({ severity: 'success', summary: 'Taller actualizado', detail: '' });
          this.alertService.success("Se ha actualizado el taller");

          setTimeout(() => { }, 3000);

          this.ngOnInit();
        } else {
          this.dialogEditTlr = false;
          this.estadosTaller = [];
          this.usuariosList = [];
          this.msgs = [];
          this.msgs.push({ severity: 'danger', summary: 'Error', detail: '' });
          this.alertService.error("No se pudo actualizar el estado del taller. Actualice el estado nuevamente.");

          setTimeout(() => { }, 3000);

          this.ngOnInit();

        }

      },
      error: err => {
        this.dialogEditTlr = false;
        this.errorMessage = err;
        this.msgs = [];
        this.msgs.push({ severity: 'danger', summary: 'Error', detail: '' });
        this.alertService.error("No se pudo actualizar el taller. Intente mas tarde.");
        setTimeout(() => { }, 3000);
        this.ngOnInit();
      }
    });
  }

  actualizarTaller() {
    this.tallerService.update_taller(this.updateTallerForm).subscribe({
      next: tallerLog => {
        if (tallerLog != null) {
          if(String(this.updateTallerForm.controls['estadoTaller'].value) == "true")
            this.estado = true;
          else
            this.estado = false;
          this.actualizar_estado(this.estado);
          this.dialogEditTlr = false;
          this._tallerSelected = [];
          this.msgs = [];
          this.msgs.push({ severity: 'success', summary: 'Taller actualizado', detail: '' });
          this.alertService.success("Se ha actualizado el taller");
          setTimeout(() => { }, 3000);
          this.ngOnInit();
        }
      },
      error: err => {
        this.dialogEditTlr = false;
        this.errorMessage = err;
        this.msgs = [];
        this.msgs.push({ severity: 'danger', summary: 'Error', detail: '' });
        this.alertService.error("No se pudo actualizar el taller. Intente mas tarde.");
        setTimeout(() => { }, 3000);
        this.ngOnInit();
      }
    });//Terminamos de actualizar el taller
  }

  verTaller() {
    console.log("visualizaremos el taller . .. ");
    this.dialogVerTaller = true;
    this.verTallerForm.controls['nombre'].setValue(this._tallerSelected[0].nombre);
    if (this._tallerSelected[0].estado == 1) {
      this.verTallerForm.controls['estadoTaller'].setValue("Activo");
    } else {
      this.verTallerForm.controls['estadoTaller'].setValue("Inactivo");
    }
    this.verTallerForm.controls['fechaCreacion'].setValue(this._tallerSelected[0].fechacreacion);
    this.verTallerForm.controls['cargo'].setValue(this._tallerSelected[0].cargo);
    this.verTallerForm.controls['razonSocial'].setValue(this._tallerSelected[0].razonsocial);
    this.verTallerForm.controls['direccion'].setValue(this._tallerSelected[0].direccion);
    this.verTallerForm.controls['telefono'].setValue(this._tallerSelected[0].telefono);
    this.verTallerForm.controls['usuario'].setValue(this._tallerSelected[0].usuario.nombre);
  }
}
