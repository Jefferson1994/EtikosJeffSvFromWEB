// auth.service.ts
import { Injectable } from '@angular/core';
import {  Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { CrearUsuarioResponse, UserResponse, userResponseEstandar ,activaDesactivar2FA} from '../domain/models/userModelos'; // La interfaz corregida
import { activarDesactivaR2FACase } from '../../../../../src/app/features/feature-1/domain/use-cases/use-caseUsuario/activar2FA.use.case';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userSource = new BehaviorSubject<UserResponse | null>(null);
  user$: Observable<UserResponse | null> = this.userSource.asObservable();

  constructor(private activar2FAUseCase: activarDesactivaR2FACase,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.loadUserSession();
  }

  // Método para guardar el token y el usuario
  login(response: UserResponse): void {
    if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('authToken', response.token);
          // ✅ Usa 'response.user' en lugar de 'response.usuario'
        localStorage.setItem('user', JSON.stringify(response.user));

    }

    //console.log('Usuario guardado en localStorage:', response.user);
    this.userSource.next(response);
  }

  // Método para cargar la sesión desde localStorage
  private loadUserSession(): void {
    if (!isPlatformBrowser(this.platformId)) {
        return;
    }

    const token = localStorage.getItem('authToken');
    const userString = localStorage.getItem('user');

    if (token && userString) {
      try {
        // ✅ Obtiene el objeto 'user' del localStorage
        const user = JSON.parse(userString);

        // ✅ Creamos un objeto UserResponse completo para restaurar la sesión
        const restoredUser: UserResponse = {
          token: token,
          user: user,
          message: 'Sesión restaurada' // Propiedad necesaria según tu interfaz
        };
        this.userSource.next(restoredUser);
        //console.log('Sesión restaurada desde el almacenamiento local.');
      } catch (e) {
        //console.error('Error al restaurar la sesión:', e);
        this.logout(); // Si el JSON está corrupto, cerramos la sesión
      }
    }
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    this.userSource.next(null);
  }

  // Nuevo método público para obtener el usuario
  getCurrentUser(): UserResponse | null {
    return this.userSource.getValue();
  }

  // --- **NUEVO MÉTODO** ---
  updateUser2FAStatus(isActive: boolean): void {
    const currentUserResponse = this.getCurrentUser();

    if (currentUserResponse && currentUserResponse.user) {
      // 1. Clona el objeto user actual
      //    TypeScript sabe que currentUserResponse.user tiene la estructura correcta
      const updatedUser = {
        ...currentUserResponse.user,
        // 2. Actualiza el campo específico
        autenticacion_dos_pasos_activa: isActive ? 1 : 0
      };

      // 3. Crea el nuevo UserResponse completo
      const updatedUserResponse: UserResponse = {
        ...currentUserResponse,
        user: updatedUser // Asigna el usuario actualizado
      };



      // 4. Actualiza localStorage con el objeto 'updatedUser'
      localStorage.setItem('user', JSON.stringify(updatedUser));

      // 5. Notifica a los suscriptores con el UserResponse actualizado
      this.userSource.next(updatedUserResponse);

      //console.log('AuthService: Estado 2FA actualizado y guardado:', updatedUser);
    } else {
      //console.error('AuthService: No se pudo actualizar el estado 2FA, usuario no logueado.');
    }
  }

  // (Tus otros métodos como gestionar2FA)
  async gestionar2FA(activar: boolean): Promise<any> {
    try {
          const activaDesactivar2FA: activaDesactivar2FA = {
            activar: activar
          };
          const respuesta: userResponseEstandar = await this.activar2FAUseCase.execute(activaDesactivar2FA);
          return respuesta;

        } catch (error) {
          //console.error('Error al crear el usuario:', JSON.stringify(error));
          let errorMessage = 'Ocurrió un error inesperado al registrar el usuario.';
          if (error instanceof Error) {
            errorMessage = error.message;
          }
        }
  }

}
