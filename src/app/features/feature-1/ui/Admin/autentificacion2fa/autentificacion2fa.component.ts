import { Component, inject, OnInit, OnDestroy } from '@angular/core'; // Importa OnInit y OnDestroy
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs'; // Importa Subscription para manejar la suscripción
// Asume que tienes estos servicios y modelos en las rutas correctas
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

  // Variables de estado del componente
  is2FAActive: boolean = false;
  isLoading: boolean = false; // Para el estado de carga y deshabilitar el toggle
  private userSubscription: Subscription | null = null; // Para guardar la suscripción al observable del usuario

  constructor() {}

  // --- ngOnInit: Se ejecuta al iniciar el componente ---
  ngOnInit(): void {
    console.log('--- Autentificacion2faComponent cargado e iniciando suscripción ---');

    // Nos suscribimos al observable 'user$' del AuthService.
    // Esto nos notificará inmediatamente con el estado actual y cada vez que cambie.
    this.userSubscription = this.authService.user$.subscribe(
      (userResponse: UserResponse | null) => {
        console.log('Recibido nuevo estado del usuario desde AuthService:', userResponse); // Log para ver qué llega

        // Verificamos si hay un usuario logueado y si tenemos sus datos
        if (userResponse && userResponse.user) {
          // Obtenemos el valor del estado 2FA
          const valor2FA = userResponse.user.autentificacion_dos_pasos_activa;
          console.log('Objeto user DENTRO de subscribe:', userResponse.user.correo);
          console.log('Valor 2FA leído (desde observable):', valor2FA, '| Tipo:', typeof valor2FA);

          // Convertimos a número y comparamos para establecer el estado del toggle
          this.is2FAActive = Number(valor2FA) === 1;

          console.log('Estado is2FAActive actualizado:', this.is2FAActive);
        } else {
          // Si no hay usuario (ej. después de logout), reseteamos el estado
          console.log('No hay usuario logueado.');
          this.is2FAActive = false;
        }
      },
      (error) => {
        // Manejo de error si el observable falla (raro en este caso)
        console.error('Error en la suscripción a user$:', error);
        this.is2FAActive = false;
      }
    );
  }

  // --- ngOnDestroy: Se ejecuta al destruir el componente ---
  // Es crucial desuscribirse para evitar fugas de memoria.
  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
      console.log('Suscripción a user$ cancelada.');
    }
  }

  // --- on2FAToggleChange: Se ejecuta al cambiar el interruptor ---
  async on2FAToggleChange(event: Event): Promise<void> {
    const target = event.target as HTMLInputElement;
    const nuevoEstadoBooleano = target.checked; // true si se activó, false si se desactivó

    console.log('Nuevo estado solicitado:', nuevoEstadoBooleano);
    this.isLoading = true; // Inicia estado de carga
    this.loadingService.show();

    try {
      // 1. Llama al método del AuthService que ejecuta la API
      const respuesta: userResponseEstandar = await this.authService.gestionar2FA(nuevoEstadoBooleano);

      console.log('Respuesta recibida de la API:', respuesta);

      // 2. Si la API tuvo éxito (no lanzó error), le decimos al AuthService que actualice el estado global
      //    Esto actualizará localStorage y notificará a todos los suscriptores (incluido este componente)
      this.authService.updateUser2FAStatus(nuevoEstadoBooleano);

      // 3. Muestra mensaje de éxito (usando el mensaje de la API)
      this.alertService.showSuccess(respuesta.message);
      console.log('Operación exitosa:', respuesta.message);
      // Nota: No necesitas actualizar 'this.is2FAActive' manualmente aquí,
      // la suscripción en ngOnInit lo hará automáticamente cuando updateUser2FAStatus emita el nuevo valor.

    } catch (error: any) { // Captura errores lanzados por gestionar2FA
      console.error('Error al intentar cambiar estado 2FA:', error);

      // 4. Si la API falla, REVierte el toggle visualmente a su estado anterior
      //    (El estado 'this.is2FAActive' no llegó a cambiar)
      target.checked = !nuevoEstadoBooleano;

      // 5. Muestra el mensaje de error al usuario
      //    Intenta obtener el mensaje específico del error lanzado por el UseCase/Service
      let errorMessage = 'No se pudo actualizar el estado de 2FA.';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (error && error.error && typeof error.error.message === 'string') {
        // Fallback si recibes directamente el HttpErrorResponse
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
