// dashboard-admin.component.ts
import { Component,ViewEncapsulation , ChangeDetectionStrategy, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router'; // Importa el servicio Router

import { HeadAdminComponent } from '../head-admin/head-admin.component';
import { MenuAdminComponent } from '../menu-admin/menu-admin.component';
import { AuthService } from '../../../services/auth.service';


export interface NavItem {
  name: string;
  view: string;
  svgPath: string;
  subItems: { name: string; view: string; path?: string }[];
  roles?: string[];
}

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [CommonModule, HeadAdminComponent, MenuAdminComponent, RouterOutlet],
  templateUrl: './dashboard-admin.component.html',
  encapsulation: ViewEncapsulation.None
})



export class DashboardAdminComponent implements OnInit {
  adminName = signal('Jefferson Vega Sarango');
  sidebarOpen = signal(true);
  currentView = signal('dashboard'); // Mantén esta variable para el despliegue del menú
  public navItems: NavItem[] = [];
  constructor(private router: Router,private authService: AuthService) {} // Inyecta el servicio Router

  ngOnInit(): void {
    this.navItems = this.getNavItemsForCurrentUser();
  }

  private allNavItems: NavItem[] =[
    // 1. Dashboard (no tiene sub-opciones)
    {
      name: 'Dashboard',
      view: 'dashboard',
      svgPath: 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8h5z', // Ícono de casa
      subItems: [],
      roles: ['Admin','Usuario']

    },


    // 4. Productos
    {
      name: '  Administrar Contraseñas',
      view: 'productos',
      svgPath:'M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm5 2h-1v-2c0-2.21-1.79-4-4-4s-4 1.79-4 4v2H7v-2c0-2.76 2.24-5 5-5s5 2.24 5 5v2z',
      subItems: [
          { name: 'Cambiar Contraseña', view: 'cambiarPasword' },
          { name: 'Activar Doble Facte 2FA', view: '2FA' }
        ],
      roles: ['Usuario','Admin']
    },

    // 5. Servicios
    {
      name: '  Administrar Usurios',
      view: 'servicios',
      svgPath: 'M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z', // Ícono de engranaje
      subItems: [
          { name: 'Bloquear o Desbloquear  Usuario', view: 'bloquearUser' }
        ],
      roles: ['Admin']
    },

  ];

  handleToggleSidebar() {
      this.sidebarOpen.update(value => !value);
    }

    handleViewChange(viewName: string) {
      // 1. Busca el ítem del menú completo
      const selectedItem = this.allNavItems.find(item => item.view === viewName);

      if (selectedItem && selectedItem.subItems.length > 0) {
        // 2. Si el ítem tiene sub-opciones, solo abre/cierra el submenú
        if (this.currentView() === viewName) {
          this.currentView.set(''); // Cierra el submenú
        } else {
          this.currentView.set(viewName); // Abre el submenú
        }
      } else {
        // 3. Si no tiene sub-opciones, navega directamente a la ruta
        this.currentView.set(viewName);
        this.router.navigate(['/admin-dashboard', viewName]);
      }

      console.log('Cambiando a la vista:', this.currentView());
    }

  getNavItemsForCurrentUser(): NavItem[] {
    const user = this.authService.getCurrentUser();
    const userRole = user?.user.rol.nombre; // Ej: 'Administrador' o 'Colaborador'

    if (!userRole) {
      return []; // Si no hay rol, no muestra nada
    }

    // Filtramos la lista maestra y devolvemos solo los ítems que incluyen el rol del usuario
    return this.allNavItems.filter(item => item.roles?.includes(userRole));
  }



}
