import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router'; // Importamos RouterLink
import { cambiarContraseinaConCodigoOTP, userResponseEstandar } from '../../../domain/models/userModelos';
import { AlertService } from '../../../services/alert.service';
import { LoadingService } from '../../../services/loading.service';
import { validarOtpCambiarPasswordUseCase } from '../../../domain/use-cases/use-caseUsuario/userValidarOtpContrasenia.use-case';

interface RestablecerPayload {
  codigoOtp: string;
  nuevaContrasena: string;
  confirmarContrasena: string;
}

@Component({
  selector: 'app-otp-recuperar-contrasenia',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink // Añadimos RouterLink para que la navegación funcione
  ],
  templateUrl: './otp-recuperar-contrasenia.component.html',
  styleUrl: './otp-recuperar-contrasenia.component.css'
})
export class OtpRecuperarContraseniaComponent implements OnInit {

  // Dependencias
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // Propiedades de estado
  public email: string | null = null;
  isLoading = false;
  passwordsMatch = false;

  // Nuevas variables para la funcionalidad de 'Ver Contraseña'
  public showNewPassword = false;
  public showConfirmPassword = false;
  private alertService = inject(AlertService);
  private loadingService = inject(LoadingService);

  // Modelo de datos para el formulario Template-Driven
  formData: RestablecerPayload = {
    codigoOtp: '',
    nuevaContrasena: '',
    confirmarContrasena: ''
  };
  constructor(private recuperarContrasenia: validarOtpCambiarPasswordUseCase,
    ) { }

  ngOnInit(): void {
    // 1. Leer el email de los queryParams de la URL
    this.route.queryParams.subscribe(params => {
      if (params['email']) {
        this.email = params['email'];
      } else {
        console.error("Falta el parámetro 'email'. Redirigiendo al inicio de recuperación.");
        // Si no hay email, redirige al paso 1 (Asegúrate de que esta ruta exista)
        this.router.navigate(['/recuperar-contrasenia']);
      }
    });
  }

  // Lógica para verificar la coincidencia de contraseñas
  checkPasswordMatch(): void {
    const nueva = this.formData.nuevaContrasena;
    const confirmar = this.formData.confirmarContrasena;

    // Lógica simplificada: Comprueba que ambas sean cadenas no vacías (truthy) y que sean iguales.
    this.passwordsMatch = (
      !!nueva &&
      !!confirmar &&
      nueva === confirmar
    );
  }

  // Métodos para cambiar la visibilidad de las contraseñas
  toggleNewPasswordVisibility(): void {
    this.showNewPassword = !this.showNewPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  async onSubmit(form: NgForm): Promise<void> {

    // 2. Validación de formulario y coincidencia de contraseñas
    if (!form.valid || !this.passwordsMatch || !this.email) {
      console.log('Formulario inválido o contraseñas no coinciden. No se envía.');
      return;
    }

    this.isLoading = true;

    // 3. Preparar el payload final


    try {
      this.loadingService.show();
          const datosVerificacion: cambiarContraseinaConCodigoOTP = {
          email: this.email,
          codigoOtp: this.formData.codigoOtp,
          nuevaContrasena: this.formData.nuevaContrasena
        };


      const respuesta: userResponseEstandar = await this.recuperarContrasenia.execute(datosVerificacion);
      this.alertService.showSuccess(respuesta.message);
      console.log('se envio el codigo exitosamente:', respuesta);
      this.router.navigate(
        ['/login']
      );
      //this.closeModal();


    } catch (error) {
      console.error('Error al crear el usuario:', JSON.stringify(error));
      let errorMessage = 'Ocurrió un error inesperado al registrar el usuario.';
      if (error instanceof Error) {
        errorMessage = error.message;
      }


      this.alertService.showError(errorMessage);
      // Muestra un mensaje de error al usuario
    } finally {
      this.loadingService.hide();
      this.isLoading = false;
    }


  }
}
