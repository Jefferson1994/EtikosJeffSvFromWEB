import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { AlertService } from '../../../services/alert.service';
import { LoadingService } from '../../../services/loading.service';
import { FormControl, FormGroup, FormsModule, NgForm, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoginResult, UserverificarCuenta } from '../../../domain/models/userModelos';
import { userLogin2FAUseCase } from '../../../domain/use-cases/use-caseUsuario/userLogin2Fa.use-case';

@Component({
  selector: 'app-modal-otp-general',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-otp-general.component.html',
  styleUrl: './modal-otp-general.component.css'
})
export class ModalOtpGeneralComponent {

  // ENTRADAS (INPUTS)
  @Input() userEmail: string = '';

  // SALIDAS (OUTPUTS)
  @Output() modalClosed = new EventEmitter<void>();
  @Output() otpValidated = new EventEmitter<LoginResult>();

  constructor(private UserLogin2FAUseCase : userLogin2FAUseCase) {}


  otpCode: string = '';
  showErrorMessage: boolean = false;

  private alertService = inject(AlertService);
  private loadingService = inject(LoadingService);


  async onSubmit(form: NgForm): Promise<void> {
    if (form.invalid) {
      //console.warn("El formulario OTP es inválido o está incompleto.");
      return;
    }

    try {
          this.loadingService.show();
          const datosVerificacion: UserverificarCuenta = {
            correo: this.userEmail,
            codigoOtp: this.otpCode
          };

          const respuesta: LoginResult = await this.UserLogin2FAUseCase.execute(datosVerificacion);
          this.alertService.showSuccess(respuesta.message)
          this.otpValidated.emit(respuesta);
          //console.log('Usuario creado exitosamente:', respuesta);
          this.closeModal();
          //this.closeModal();


        } catch (error) {
          //console.error('Error al crear el usuario:', JSON.stringify(error));
          let errorMessage = 'Ocurrió un error inesperado al registrar el usuario.';
          if (error instanceof Error) {
            errorMessage = error.message;
          }


          this.alertService.showError(errorMessage);
          // Muestra un mensaje de error al usuario
        } finally {
          this.loadingService.hide();
      }


    //console.log(`✅ Código OTP recolectado: ${this.otpCode}`);


  }

  closeModal(): void {
    this.modalClosed.emit();
  }


  preventClosing(event: MouseEvent): void {
    event.stopPropagation();
  }


}
