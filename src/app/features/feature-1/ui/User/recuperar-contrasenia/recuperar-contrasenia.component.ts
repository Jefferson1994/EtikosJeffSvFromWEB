import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertService } from '../../../services/alert.service';
import { LoadingService } from '../../../services/loading.service';
import { userRecuperarContraseniaUseCase } from '../../../domain/use-cases/use-caseUsuario/userRecuperarContrasenia.use-case';
import { userResponseEstandar, solicitudRecuperarContrasenia } from '../../../domain/models/userModelos';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'app-recuperar-contrasenia',
  standalone: true,
  // IMPORTANTE: Se añade ReactiveFormsModule para que el formulario funcione
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './recuperar-contrasenia.component.html',
  styleUrl: './recuperar-contrasenia.component.css'
})
export class RecuperarContraseniaComponent {

  private alertService = inject(AlertService);
  private loadingService = inject(LoadingService);

  forgotPasswordForm = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email]
    })
  });

  constructor(private recuperarContrasenia: userRecuperarContraseniaUseCase,
    private router: Router
  ) { }


  isLoading: boolean = false;

  get emailControl(): FormControl<string> {
    return this.forgotPasswordForm.get('email') as FormControl<string>;
  }

  async onSubmit(): Promise<void> {

    if (this.forgotPasswordForm.invalid) {
      this.forgotPasswordForm.markAllAsTouched();
      //console.error('El formulario es inválido. Por favor, revisa los errores.');
      return;
    }

    const email = this.emailControl.value;
    //console.log(`✅ Correo recolectado para recuperación: ${email}`);

    // Simular estado de carga y llamada a servicio (ejemplo asíncrono)
    this.isLoading = true;
    try {
      this.loadingService.show();
      const datosVerificacion: solicitudRecuperarContrasenia = {
        email: email,
      };

      const respuesta: userResponseEstandar = await this.recuperarContrasenia.execute(datosVerificacion);
      this.alertService.showSuccess(respuesta.message);
      //console.log('se envio el codigo exitosamente:', respuesta);
      this.emailControl.setValue('');
      this.router.navigate(
          ['/otp-Recuperarcontrasenia'],
          { queryParams: { email: email } }
        );
      //this.closeModal();


    } catch (error) {
      //console.error('Error al crear el usuario:', JSON.stringify(error));
      let errorMessage = 'Ocurrió un error inesperado al validar el correo.';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      this.alertService.showError(errorMessage);

    } finally {
      this.loadingService.hide();
      this.isLoading = false;
    }


  }
}
