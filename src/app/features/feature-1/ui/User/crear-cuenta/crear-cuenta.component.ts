import { Component, ChangeDetectionStrategy, signal, Input, Output, EventEmitter, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CiudadanoEstandar, CrearUsuarioResponse, RolUsuario } from '../../../domain/models/userModelos';
import { crearUsuarioUseCase } from '../../../domain/use-cases/use-caseUsuario/crearUsuario.use-case';
import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon, SweetAlertResult } from 'sweetalert2';
import { AlertService } from '../../../services/alert.service';
import { LoadingService } from '../../../services/loading.service';

@Component({
  selector: 'app-crear-cuenta',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-cuenta.component.html',
  styleUrls: ['./crear-cuenta.component.css'],
})
export class CrearCuentaComponent implements OnInit {

  @Output() modalClosed = new EventEmitter<void>();
  private alertService = inject(AlertService);
  private loadingService = inject(LoadingService);

  loading = true;


  registro: any = {
    nombre: '',
    correo: '',
    contrasena: '',
    id_rol: 1,
    numero_telefono: '',
    numero_identificacion: '',
  };

  public roles: RolUsuario[] = [];
  identificacionParaValidar: string = '';
  ciudadanoValidado: CiudadanoEstandar | null = null;
  errorValidacion: string | null = null;


  constructor(private router: Router, private crearUserUseCase: crearUsuarioUseCase,
    ) { }

  async ngOnInit(): Promise<void> {

  }



  async onSubmit(form: NgForm): Promise<void> {
    if (!form.valid) {
      //console.log('Formulario no válido. Por favor, revisa los campos.');
      return;
    }

    try {
      this.loadingService.show();
      const respuesta: CrearUsuarioResponse = await this.crearUserUseCase.execute(this.registro);
      this.alertService.showSuccess(respuesta.mensaje).then(() => {
        this.closeModal();
        const email = this.registro.correo;

        this.router.navigate(
          ['/verificar-cuenta'],
          { queryParams: { email: email } }
        );
      });
      //console.log('Usuario creado exitosamente:', respuesta);
      //this.closeModal();


    } catch (error) {
      //console.error('Error al crear el usuario:', JSON.stringify(error));
      let errorMessage = 'Ocurrió un error inesperado al registrar el usuario.';
      if (error instanceof Error) {
        errorMessage = error.message;
      }


      this.alertService.showError(errorMessage);
      // Muestra un mensaje de error al usuario
    }finally {
      this.loadingService.hide();
    }
  }

  onCancel(): void {
    this.closeModal();
  }

  closeModal(): void {
    this.modalClosed.emit();
  }


  private esCedulaValida(cedula: string): boolean {
    if (!/^\d{10}$/.test(cedula)) {
      return false;
    }

    const digitos = cedula.split('').map(Number);
    const verificador = digitos.pop();

    if (digitos[2] < 0 || digitos[2] > 5) {
      return false;
    }

    const coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2];
    let suma = 0;

    for (let i = 0; i < digitos.length; i++) {
      let producto = digitos[i] * coeficientes[i];

      if (producto >= 10) {
        producto -= 9;
      }
      suma += producto;
    }


    const residuo = suma % 10;
    const digitoCalculado = (residuo === 0) ? 0 : 10 - residuo;

    return digitoCalculado === verificador;
  }

  validarIndentificacion(): void {

    this.errorValidacion = null;
    this.ciudadanoValidado = null;

    const cedula = this.registro.numero_identificacion;

    if (cedula.length !== 10) {
      this.alertService.showError('La cédula debe tener 10 dígitos.');
      return;
    }

    //  Ejecutar la validación local
    if (this.esCedulaValida(cedula)) {
      //console.log('Cédula matemáticamente válida.');

    } else {
      //console.log('Cédula inválida según algoritmo.');
      this.errorValidacion = 'El número de cédula no es válido.';
      this.registro.numero_identificacion = '';
      this.alertService.showError(this.errorValidacion);
    }

  }

}
