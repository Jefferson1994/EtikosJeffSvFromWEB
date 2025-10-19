import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { userCerrarSesionUseCase } from '../../../domain/use-cases/use-caseUsuario/userCerrarSesion.use-case';
import { AlertService } from '../../../services/alert.service';
import { LoadingService } from '../../../services/loading.service';
@Component({
  selector: 'app-head-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './head-admin.component.html',
  styleUrls: ['./head-admin.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeadAdminComponent {


  private alertService = inject(AlertService);
  private loadingService = inject(LoadingService);

  constructor(private authService: AuthService,
    private cerrarSesionUseCase: userCerrarSesionUseCase,
    private router: Router
  ) {

  }
  adminName = signal('Admin');
  rol = signal('Admin');

  ngOnInit(): void {
    // ✅ Get the user's name from the AuthService and update the signal
    const user = this.authService.getCurrentUser();
    if (user && user.user && user.user.nombre) {
      this.adminName.set(user.user.nombre);
      //this.rol.set(user.user.id_rol.toString());
    }
  }



  @Output() toggleSidebarEvent = new EventEmitter<void>();

  profileMenuOpen = signal(false);

  toggleProfileMenu() {
    this.profileMenuOpen.update(value => !value);
  }

  async cerrarSesion() {
    this.profileMenuOpen.set(false);

    try {
      this.loadingService.show();

      const response = await this.cerrarSesionUseCase.execute();

      if (response.success) {
        //console.log('Cierre de sesión exitoso. Eliminando credenciales locales.');
      }

      this.authService.logout();

      this.router.navigate(['/login']);

    } catch (error) {
      //console.error('Error al cerrar sesión (Front/Back):', error);
      this.authService.logout();
      this.alertService.showError('Error al cerrar sesión. Por favor, inténtelo de nuevo.');
      this.router.navigate(['/login']);
    }finally {
      this.loadingService.hide();
    }
  }
}
