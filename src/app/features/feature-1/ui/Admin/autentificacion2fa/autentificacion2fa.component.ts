import { Component, inject, OnInit, OnDestroy } from '@angular/core'; // Importa OnInit y OnDestroy
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { AlertService } from '../../../services/alert.service';
import { LoadingService } from '../../../services/loading.service';
import { userResponseEstandar, UserResponse } from '../../../domain/models/userModelos'; // Asegúrate de importar UserResponse

@Component({
  selector: 'app-autentificacion2fa',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './autentificacion2fa.component.html',
  styleUrl: './autentificacion2fa.component.css'
})
export class Autentificacion2faComponent implements OnInit, OnDestroy { // Implementa OnInit y OnDestroy

  // Inyección de servicios
  private authService = inject(AuthService);
  private alertService = inject(AlertService);
  private loadingService = inject(LoadingService);


  is2FAActive: boolean = false;
  isLoading: boolean = false;
  private userSubscription: Subscription | null = null;

  constructor() {}

  ngOnInit(): void {
    //console.log('--- Autentificacion2faComponent cargado e iniciando suscripción ---');
    this.userSubscription = this.authService.user$.subscribe(
      (userResponse: UserResponse | null) => {
        //console.log('Recibido nuevo estado del usuario desde AuthService:', userResponse); // Log para ver qué llega
        if (userResponse && userResponse.user) {
          const valor2FA = userResponse.user.autentificacion_dos_pasos_activa;
         // console.log('Objeto user DENTRO de subscribe:', userResponse.user.correo);
          //console.log('Valor 2FA leído (desde observable):', valor2FA, '| Tipo:', typeof valor2FA);

          this.is2FAActive = Number(valor2FA) === 1;

          //console.log('Estado is2FAActive actualizado:', this.is2FAActive);
        } else {
          //console.log('No hay usuario logueado.');
          this.is2FAActive = false;
        }
      },
      (error) => {
        //console.error('Error en la suscripción a user$:', error);
        this.is2FAActive = false;
      }
    );
  }


  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
      //console.log('Suscripción a user$ cancelada.');
    }
  }

  async on2FAToggleChange(event: Event): Promise<void> {
    const target = event.target as HTMLInputElement;
    const nuevoEstadoBooleano = target.checked;

    //.log('Nuevo estado solicitado:', nuevoEstadoBooleano);
    this.isLoading = true;
    this.loadingService.show();

    try {
      const respuesta: userResponseEstandar = await this.authService.gestionar2FA(nuevoEstadoBooleano);

      //console.log('Respuesta recibida de la API:', respuesta);
      this.authService.updateUser2FAStatus(nuevoEstadoBooleano);

      this.alertService.showSuccess(respuesta.message);
      //console.log('Operación exitosa:', respuesta.message);

    } catch (error: any) { // Captura errores lanzados por gestionar2FA
      //console.error('Error al intentar cambiar estado 2FA:', error);
      target.checked = !nuevoEstadoBooleano;
      let errorMessage = 'No se pudo actualizar el estado de 2FA.';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (error && error.error && typeof error.error.message === 'string') {
        errorMessage = error.error.message;
      }
      this.alertService.showError(errorMessage);

    } finally {
      // 6. Finaliza el estado de carga independientemente del resultado
      this.isLoading = false;
      this.loadingService.hide();
    }
  }
}
