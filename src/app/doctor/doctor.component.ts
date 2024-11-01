import { Component } from '@angular/core';
import { Especialidad } from '../especialidad/models/especialidad';
import { Doctor } from './models/doctor';
import { DoctorService } from './services/doctor.service';
import { MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { PanelModule } from 'primeng/panel';
import { ToastModule } from 'primeng/toast';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { EspecialidadService } from '../especialidad/services/especialidad.service';

@Component({
  selector: 'app-doctor',
  standalone: true,
  imports: [TableModule, SidebarComponent, CommonModule, CardModule, PanelModule, ToastModule, 
    ConfirmDialogModule, DropdownModule, DialogModule, InputTextModule, FormsModule],
  templateUrl: './doctor.component.html',
  styleUrl: './doctor.component.css'
})
export class DoctorComponent {
  especialidadOpttion: Especialidad[]=[];
  doctores: Doctor[] = [];
  doctor = new Doctor();
  titulo: string = '';
  opc: string = '';
  op = 0;
  visible = false;
  isDeleteInProgress = false;

  constructor(
    private doctorService: DoctorService,
    private especialidadService: EspecialidadService,
    private messageService: MessageService,
  ) {}

  ngOnInit() {
    this.listarDoctores();
    this.cargarEspecialidades();
  }

  listarDoctores(){
    this.doctorService.getDoctores().subscribe((data) => {
      this.doctores = data;
      console.log(data)
    });
  }

  cargarEspecialidades(): void {
    this.especialidadService.getEspecialidades().subscribe({
      next: (data) => {
          // Asignar el array de especialidades a la propiedad especialidadOpttion
          this.especialidadOpttion = data;
          console.log('Especialidades cargadas:', data);
      },
      error: (error) => {
          console.error('Error al cargar especialidades', error);
          this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudieron cargar las especialidades',
          });
      }
  });}

  deleteDoctor(id: number) {
    this.isDeleteInProgress = true;
    this.doctorService.deleteDoctor(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Correcto',
          detail: 'Doctor eliminado',
        });
        this.isDeleteInProgress = false;
        this.listarDoctores();
      },
      error: () => {
        this.isDeleteInProgress = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo eliminar el Doctor',
        });
      },
    });
  }

  showDialogEdit(id: number) {
    this.titulo = 'Editar Doctor';
    this.opc = 'Editar';
    this.doctorService.getDoctorByID(id).subscribe((data) => {
      this.doctor = data;
      this.op = 1;
      this.visible = true;
    });
  }

  showDialogCreate() {
    this.titulo = 'Crear Doctor';
    this.opc = 'Agregar';
    this.op = 0;
    this.visible = true;
    this.doctor = {
      id: 0,
      nombres: '',
      apellidos: '',
      especialidad: {
        id: 0,
        nombre: ''
      }
    };
  }

  addDoctor(): void {
    if (!this.doctor.nombres || this.doctor.nombres.trim() === '') {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'El nombre del Doctor no puede estar vacío',
      });
      return;
    }

    this.doctorService.crearDoctor(this.doctor).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Correcto',
          detail: 'Doctor registrado',
        });
        this.listarDoctores();
        this.op = 0;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo agregar el Doctor',
        });
      },
    });
    this.visible = false;
  }
  
  updateDoctor() {
    this.doctorService.updateDoctor(this.doctor.id, this.doctor).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success', 
          summary: 'Correcto',
          detail: 'Doctor editado',
        });
        this.listarDoctores();
        this.op = 0;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error', 
          detail: 'No se pudo editar el Doctor',
        });
      },
    });
    this.visible = false;
  }

  opcion():void{
    if(this.op==0){
      this.addDoctor();
      this.limpiar();
    }else if(this.op==1){
      console.log("Editar");
      this.updateDoctor();
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
    this.doctor.id=0;
    this.doctor.nombres='';
    this.doctor.apellidos='';
    this.doctor.especialidad.nombre='';
   }
}
