import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router'; // Importar ActivatedRoute
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
  email: string | null = null; // Aquí guardaremos el email
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute, // 1. Inyecta ActivatedRoute para leer la URL
    private router: Router,
    // private authService: AuthService,
    // private alertService: AlertService
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
        console.error("No se proporcionó email");
        this.router.navigate(['/login']);
      }
    });
  }

  onSubmit(): void {
    if (this.verifyForm.invalid || !this.email) {
      return;
    }

    this.isLoading = true;
    const codigoOtp = this.verifyForm.value.codigoOtp;

    console.log('Enviando para verificar:', this.email, codigoOtp);

    // --- Lógica de llamada al servicio (descomentar cuando lo tengas) ---
    /*
    this.authService.verificarCuenta(this.email, codigoOtp).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.alertService.showSuccess('¡Cuenta verificada! Ya puedes iniciar sesión.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.isLoading = false;
        this.alertService.showError(err.error.message || 'Código incorrecto o expirado.');
      }
    });
    */

    // Simulación (borra esto después)
    setTimeout(() => {
      this.isLoading = false;
      if (codigoOtp === '123456') {
         console.log('¡Éxito! Redirigiendo a login...');
         this.router.navigate(['/login']);
      } else {
         console.log('Código incorrecto');
      }
    }, 1500);
  }
}
