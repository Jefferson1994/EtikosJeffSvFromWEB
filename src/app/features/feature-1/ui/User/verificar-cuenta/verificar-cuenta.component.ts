import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { usuarioVerificarCuentaUseCase } from '../../../domain/use-cases/use-caseUsuario/userValidarCuenta-case';
import { AlertService } from '../../../services/alert.service';
import { LoadingService } from '../../../services/loading.service';
import { userResponseEstandar, UserverificarCuenta } from '../../../domain/models/userModelos';

// import { AuthService } from '../auth.service';
// import { AlertService } from '../alert.service';

@Component({
  selector: 'app-verificar-cuenta',
  standalone: true,
  // ¡Importante! Añade los módulos para el formulario y *ngIf
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './verificar-cuenta.component.html',
  styleUrl: './verificar-cuenta.component.css'
})
export class VerificarCuentaComponent implements OnInit {

  verifyForm: FormGroup;
  email: string | null = null;
  isLoading = false;

  private alertService = inject(AlertService);
  private loadingService = inject(LoadingService);

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private verificar: usuarioVerificarCuentaUseCase,

  ) {
    this.verifyForm = this.fb.group({
      // Usaremos un solo campo (la Opción 1 flexible que discutimos)
      codigoOtp: ['', [Validators.required, Validators.minLength(6)]]
    });
  }


  ngOnInit(): void {
    // 2. Lee el parámetro 'email' de la URL al cargar
    this.route.queryParams.subscribe(params => {
      if (params['email']) {
        this.email = params['email'];
      } else {
        // Si alguien entra a esta URL sin un email, lo sacamos
        // this.alertService.showError('Ruta no válida');
        //console.error("No se proporcionó email");
        this.router.navigate(['/login']);
      }
    });
  }

  async onSubmit(): Promise<void> {
    if (this.verifyForm.invalid || !this.email) {
      return;
    }

    this.isLoading = true;
    const codigoOtp = this.verifyForm.value.codigoOtp;

    //console.log('Enviando para verificar:', this.email, codigoOtp);

    try {
      this.loadingService.show();
      const datosVerificacion: UserverificarCuenta = {
        correo: this.email,
        codigoOtp: codigoOtp
      };

      const respuesta: userResponseEstandar = await this.verificar.execute(datosVerificacion);
      this.alertService.showSuccess(respuesta.message).then(() => {
        this.router.navigate(
          ['/login'],
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
    } finally {
      this.loadingService.hide();
    }


  }
}
