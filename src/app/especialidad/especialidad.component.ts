import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { Especialidad } from './models/especialidad';
import { EspecialidadService } from './services/especialidad.service';
import { MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { PanelModule } from 'primeng/panel';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-especialidad',
  standalone: true,
  imports: [TableModule, SidebarComponent, CommonModule, CardModule, PanelModule, ToastModule, 
    ConfirmDialogModule, DropdownModule, DialogModule, InputTextModule, FormsModule],
  templateUrl: './especialidad.component.html',
  styleUrl: './especialidad.component.css'
})
export class EspecialidadComponent {
  especialidades: Especialidad[] = [];
  especialidad = new Especialidad();
  titulo: string = '';
  opc: string = '';
  op = 0;
  visible = false;
  isDeleteInProgress = false;

  constructor(
    private especialidadService: EspecialidadService,
    private messageService: MessageService,
  ) {}

  ngOnInit() {
    this.listarEspecialidades();
  }

  listarEspecialidades(){
    this.especialidadService.getEspecialidades().subscribe((data) => {
      this.especialidades = data;
      console.log(data)
    });
  }

  deleteEspecialidad(id: number) {
    this.isDeleteInProgress = true;
    this.especialidadService.deleteEspecialidad(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Correcto',
          detail: 'Especialidad eliminado',
        });
        this.isDeleteInProgress = false;
        this.listarEspecialidades();
      },
      error: () => {
        this.isDeleteInProgress = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo eliminar el Especialidad',
        });
      },
    });
  }

  showDialogEdit(id: number) {
    this.titulo = 'Editar Especialidad';
    this.opc = 'Editar';
    this.especialidadService.getEspecialidadByID(id).subscribe((data) => {
      this.especialidad = data;
      this.op = 1;
      this.visible = true;
    });
  }

  showDialogCreate() {
    this.titulo = 'Crear Especialidad';
    this.opc = 'Agregar';
    this.op = 0;
    this.visible = true;
    this.especialidad = {
      id: 0,
      nombre: ''
    };
  }

  addEspecialidad(): void {
    if (!this.especialidad.nombre || this.especialidad.nombre.trim() === '') {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'El nombre del Especialidad no puede estar vacío',
      });
      return;
    }

    this.especialidadService.crearEspecialidad(this.especialidad).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Correcto',
          detail: 'Especialidad registrado',
        });
        this.listarEspecialidades();
        this.op = 0;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo agregar el Especialidad',
        });
      },
    });
    this.visible = false;
  }
  
  updateEspecialidad() {
    this.especialidadService.updateEspecialidad(this.especialidad.id, this.especialidad).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success', 
          summary: 'Correcto',
          detail: 'Especialidad editado',
        });
        this.listarEspecialidades();
        this.op = 0;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error', 
          detail: 'No se pudo editar el Especialidad',
        });
      },
    });
    this.visible = false;
  }


  opcion():void{
    if(this.op==0){
      this.addEspecialidad();
      this.limpiar();
    }else if(this.op==1){
      console.log("Editar");
      this.updateEspecialidad();
      this.limpiar();
    }else{
      console.log("No se hace nada");
      this.limpiar();
    }
    
  }
  limpiar(){
    this.titulo='';
    this.opc='';
    this.op = 0; 
    this.especialidad.id=0;
    this.especialidad.nombre='';
   }
}
