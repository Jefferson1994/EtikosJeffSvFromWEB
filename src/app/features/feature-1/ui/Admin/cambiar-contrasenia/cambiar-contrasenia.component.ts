import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necesario para *ngIf
import { FormsModule, NgForm } from '@angular/forms'; // ¡LA CLAVE! Tu estándar
import { Router } from '@angular/router';
import { userCambiarPassword, userResponseEstandar } from '../../../domain/models/userModelos';
import { AlertService } from '../../../services/alert.service';
import { LoadingService } from '../../../services/loading.service';
import { userCambiarPaswordUseCase } from '../../../domain/use-cases/use-caseUsuario/cambiarPassword.use.case';
import { HttpErrorResponse } from '@angular/common/http';

interface ChangePasswordPayload {
  contrasenaActual: string;
  nuevaContrasena: string;
  confirmarContrasena: string;
}

@Component({
  selector: 'app-cambiar-contrasenia',
  standalone: true,
  // ¡Importante! Añade CommonModule y FormsModule
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './cambiar-contrasenia.component.html',
  styleUrl: './cambiar-contrasenia.component.css'
})
export class CambiarContraseniaComponent {

  private alertService = inject(AlertService);
  private loadingService = inject(LoadingService);
  private router = inject(Router);
  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  formData: ChangePasswordPayload = {
    contrasenaActual: '',
    nuevaContrasena: '',
    confirmarContrasena: ''
  };

  // Variables de estado
  isLoading = false;
  passwordsMatch = false; // Controla si el botón se habilita

  constructor(private cambiarPasswordUseCase: userCambiarPaswordUseCase) {
    //console.log('--- CambiarContraseniaComponent cargado ---');
  }

  checkPasswordMatch(): void {
    const { nuevaContrasena, confirmarContrasena } = this.formData;

    if (nuevaContrasena && confirmarContrasena && nuevaContrasena === confirmarContrasena) {
      this.passwordsMatch = true;
      //console.log('Validador: SÍ COINCIDEN');
    } else {
      this.passwordsMatch = false;
      if (nuevaContrasena || confirmarContrasena) {
        //console.log('Validador: NO COINCIDEN');
      }
    }
  }

  async onSubmit(form: NgForm): Promise<void> {

    //console.log('--- Se ha pulsado Submit ---');
    //console.log('¿Formulario es válido?', form.valid);
    //console.log('¿Contraseñas coinciden?', this.passwordsMatch);

    // Doble chequeo (aunque el botón debería estar deshabilitado)
    if (!form.valid || !this.passwordsMatch) {
      //console.log('Formulario inválido, no se envía.');
      return;
    }

    this.isLoading = true;

    try {
      const userCambiarPassword: userCambiarPassword = {
        contrasenaActual: this.formData.contrasenaActual,
        nuevaContrasena: this.formData.nuevaContrasena
      };
      this.loadingService.show();
      const respuesta: userResponseEstandar = await this.cambiarPasswordUseCase.execute(userCambiarPassword);

      if (!respuesta.success) {
        throw new Error(respuesta.message);
      } else {
        this.alertService.showSuccess(respuesta.message);
        form.resetForm();
        this.passwordsMatch = false;
        //console.log('la respuesta de cambir la contrasenia:', JSON.stringify(respuesta));
      }

    } catch (error) {
      //manejo de errores
      // console.error('Error al crear el usuario:', JSON.stringify(error));
      let errorMessage = 'Ocurrió un error inesperado al registrar el usuario.';
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
