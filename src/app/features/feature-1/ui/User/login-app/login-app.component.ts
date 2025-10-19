import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginUseCase } from '../../../domain/use-cases/use-caseUsuario/login.use-case';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';
import { Router, RouterLink } from '@angular/router'; // Importación correcta del Router de Angular
import { CrearCuentaComponent } from '../crear-cuenta/crear-cuenta.component';
import { LoadingService } from '../../../services/loading.service';
import { AlertService } from '../../../services/alert.service';
import { ModalOtpGeneralComponent } from '../modal-otp-general/modal-otp-general.component';
import { LoginResult, TwoFactorRequiredResponse, UserResponse } from '../../../domain/models/userModelos';

@Component({
  selector: 'app-login-app',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, CrearCuentaComponent, RouterLink, ModalOtpGeneralComponent],
  templateUrl: './login-app.component.html',
  styleUrl: './login-app.component.css'
})
export class LoginAppComponent {
  email: string = '';
  password: string = '';
  showCrearCuentaModal = false;

  constructor(
    private loginCase: LoginUseCase,
    private authService: AuthService,
    private router: Router // Inyección del servicio Router en el constructor
  ) { }
  private alertService = inject(AlertService);
  private loadingService = inject(LoadingService);
  showModalOtp = false

  isTwoFactorRequired(response: LoginResult): response is TwoFactorRequiredResponse {
    return (response as TwoFactorRequiredResponse).twoFactorRequired === true;
  }

  async onSubmit() {
    if (!this.email || !this.password) {
      this.alertService.showError('Debe ingresar su correo y contraseña.');
      return;
    }
    const credentials = {
      email: this.email,
      password: this.password
    };
    console.log("Login datasssss:", credentials);

    try {
      this.loadingService.show();

      const response: LoginResult = await this.loginCase.execute(credentials);
      console.log('Login successful!', JSON.stringify(response));


      if (this.isTwoFactorRequired(response)) {
        console.log('2FA Requerido. Abriendo modal.', response.message);
        this.showModalOtp = true;

        return;
      }

      const userResponse = response as UserResponse;
      this.authService.login(userResponse);

      if (response.user.rol.nombre === 'Admin') {
        console.log('Redirigiendo a la página de administrador...');
        this.router.navigate(['/admin-dashboard']);
      } else if (response.user.rol.nombre === 'Usuario') {
        console.log('esta en la pagina del Usuario');
        this.router.navigate(['/admin-dashboard']);
      }

    } catch (error) {
      console.error('Login failed:', error);
      this.alertService.showError('No se pudo iniciar sesión. Verifique sus credenciales.');
    } finally {
      this.loadingService.hide();
    }
  }


  abrirModalCrearCuenta(): void {
    this.showCrearCuentaModal = true;
  }

  onModalClosed(): void {
    this.showCrearCuentaModal = false;
  }

  onModalOtpClosed(): void {
    this.showModalOtp = false;
  }

  onOtpValidated(response: LoginResult): void {
    console.log("✅ 2FA completado. Recibido token y usuario del modal.");

    // 1. Ocultar el modal inmediatamente
    this.showModalOtp = false;

    // 2. Guardar el token de sesión
    const userResponse = response as UserResponse; // Asegúrate de que el tipo sea compatible
    this.authService.login(userResponse);

    if (userResponse.user.rol.nombre === 'Admin') {
      console.log('Redirigiendo a la página de administrador...');
      this.router.navigate(['/admin-dashboard']);
    } else if (userResponse.user.rol.nombre === 'Usuario') {
      console.log('esta en la pagina del Usuario');
      this.router.navigate(['/admin-dashboard']);
    }

  }
}
