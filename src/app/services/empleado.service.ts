import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
const apiUrl = environment.url;

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {
  empleados: any [] = [];

  constructor(private http: HttpClient) { }


  obtenerEmpleados() {
    let url = `${apiUrl}/empleados/`;

    return this.http.get(url, {responseType: 'json'}).pipe(
      map((resp: any) => {
        this.empleados = resp.objects;
        console.log(resp.objects);
        return  resp.objects;
      })
    );
  }

  crearEmpleado(empleado) {
    let url = `${apiUrl}/empleados/`;

    return this.http.post(url, empleado, {responseType: 'json'}).pipe(
      map((resp: any) => {
        console.log(resp);
        return  resp;
      })
    );
  }

  editEmpleado(empleado) {
    let url = `${apiUrl}/empleados/`;

    return this.http.put(url, empleado, {responseType: 'json'}).pipe(
      map((resp: any) => {
        console.log(resp);
        return  resp;
      })
    );
  }

}
