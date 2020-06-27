import { Router, ActivatedRoute } from '@angular/router';
import { EmpleadoService } from './../../services/empleado.service';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-empleado',
  templateUrl: './empleado.component.html',
  styleUrls: ['./empleado.component.scss']
})
export class EmpleadoComponent implements OnInit {
  EmployeeForm: FormGroup;
  edit = false;
  @BlockUI() blockUI: NgBlockUI;

  constructor(private fb: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private empleadoServ: EmpleadoService) { }

  ngOnInit() {
    this.EmployeeForm = this.fb.group({
      id: null,
      nombres: new FormControl('', [
        Validators.required
      ]),
      apellidos: new FormControl('', [
        Validators.required
      ]),
      correo: new FormControl('', [
        Validators.required,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$'),
      ]),
      cedula: new FormControl('', [
        Validators.required,
        Validators.minLength(14)
      ]),
      nInss: new FormControl('', [
        Validators.required
      ]),
      fechaNac: new FormControl(''),
      activo: true
    });
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      console.log('id', Number(id));
      if (id) {
        this.edit = true;
        console.log(this.empleadoServ.empleados);
        const empleado = this.empleadoServ.empleados.find(x => x.id === Number(id));
        this.EmployeeForm.controls.id.setValue(empleado.id);
        this.EmployeeForm.controls.nombres.setValue(empleado.nombres);
        this.EmployeeForm.controls.apellidos.setValue(empleado.apellidos);
        this.EmployeeForm.controls.correo.setValue(empleado.correo);
        this.EmployeeForm.controls.cedula.setValue(empleado.cedula);
        this.EmployeeForm.controls.nInss.setValue(empleado.nInss);
        this.EmployeeForm.controls.fechaNac.setValue(empleado.fechaNacimiento);
        this.EmployeeForm.controls.activo.setValue(empleado.activo);
      }
    });
  }

  guardar() {

    if (this.EmployeeForm.valid) {
      console.log(this.EmployeeForm.value);
      this.blockUI.start('Guardando tus datos...');
      // Editar
      if (this.edit) {
        console.log('editar');

        this.empleadoServ.editEmpleado(this.EmployeeForm.value).subscribe((data: any) => {
          if (data.success) {
            Swal.fire({
              title: 'Exito!',
              text: 'Tus datos han sido guardados',
              icon: 'success',
              confirmButtonText: 'De acuerdo'
            });
            this.router.navigate(['/']);
            this.blockUI.stop();
          }
        }, error => {
          Swal.fire({
            title: 'Error!',
            text: 'Ocurrio un error al procesar la peticion',
            icon: 'error',
            confirmButtonText: 'De acuerdo'
          });
          this.blockUI.stop();
        });

      } else { // Crear
        const empleadoEmail = this.empleadoServ.empleados.find(x => x.correo === this.EmployeeForm.get('correo').value);
        const empleadoCedula = this.empleadoServ.empleados.find(x => x.cedula === this.EmployeeForm.get('cedula').value);
        const empleadoInss = this.empleadoServ.empleados.find(x => x.nInss === this.EmployeeForm.get('nInss').value);
        if (empleadoEmail || empleadoCedula || empleadoInss) {
          Swal.fire({
            title: 'Error!',
            text: 'No es posible crear el empleado. Ya existe uno con los siguientes elementos: email, cedula, numero Inss',
            icon: 'error',
            confirmButtonText: 'De acuerdo'
          });
          this.blockUI.stop();
          return;
        }
        this.empleadoServ.crearEmpleado(this.EmployeeForm.value).subscribe((data: any) => {
          if (data.success) {
            Swal.fire({
              title: 'Exito!',
              text: 'Tus datos han sido guardados',
              icon: 'success',
              confirmButtonText: 'De acuerdo'
            });
            this.router.navigate(['/']);
            this.blockUI.stop();
          }
        }, error => {
          Swal.fire({
            title: 'Error!',
            text: 'Ocurrio un error al procesar la peticion',
            icon: 'error',
            confirmButtonText: 'De acuerdo'
          });
          this.blockUI.stop();
        });
      }
    } else {
      this.EmployeeForm.markAllAsTouched();
      Swal.fire({
        title: 'Error!',
        text: 'Verifique sus datos',
        icon: 'error',
        confirmButtonText: 'De acuerdo'
      });
    }
  }

  parseFecha() {
    const cedula = this.EmployeeForm.get('cedula').value;
    if (cedula.length >= 14) {
      this.EmployeeForm.controls.fechaNac.setValue(cedula.substring(3, 5) + '-' + cedula.substring(5, 7) + '-' + cedula.substring(7, 9));
    }
  }

}
