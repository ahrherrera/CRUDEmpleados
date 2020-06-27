import { EmpleadoService } from './../../services/empleado.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  data: any [] = [
    {
      nombres: 'Javier',
      apellidos: 'Malespin',
      correo: 'kjsbdksjdljk@gmail.com',
      cedula: '002-373747-4883K',
      nInss: '48375487',
      fechaNacimiento: '2020-06-26',
      activo: true
    }
  ];

  constructor(public empleadosServ: EmpleadoService, private router: Router) {
  }

  ngOnInit() {
    this.updateEmpleados();
  }

  updateEmpleados() {
    this.empleadosServ.obtenerEmpleados().subscribe();
  }

  editar(data) {
    this.router.navigate([data.data.id, 'editar']);
  }

  eliminar(data) {
    Swal.fire({
      title: 'Confirme su acción',
      text: '¿Desea eliminar este Empleado?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'No',
      confirmButtonText: 'Si, eliminar'
    }).then((result) => {
      if (result.value) {
        this.blockUI.start('Eliminando registro');
        data.data.activo = false;
        console.log(data.data);
        this.empleadosServ.editEmpleado(data.data).subscribe(resp => {
          console.log(resp);
          this.blockUI.stop();
          this.updateEmpleados();
        }, error => {
          this.blockUI.stop();
          Swal.fire({
            title: 'Error!',
            text: 'Ocurrio un error al procesar la peticion',
            icon: 'error',
            confirmButtonText: 'De acuerdo'
          });
        });
      }
    });
  }
}
