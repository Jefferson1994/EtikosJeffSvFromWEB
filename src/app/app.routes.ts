import { Routes } from '@angular/router';
import { LoginAppComponent } from './features/feature-1/ui/User/login-app/login-app.component';
import { VerificarCuentaComponent } from './features/feature-1/ui/User/verificar-cuenta/verificar-cuenta.component';
import { CambiarContraseniaComponent } from './features/feature-1/ui/Admin/cambiar-contrasenia/cambiar-contrasenia.component';
import { DashboardAdminComponent } from './features/feature-1/ui/Admin/dashboard-admin/dashboard-admin.component';
import { Autentificacion2faComponent } from './features/feature-1/ui/Admin/autentificacion2fa/autentificacion2fa.component';
import { DesbloquearBloquearUserComponent } from './features/feature-1/ui/Admin/desbloquear-bloquear-user/desbloquear-bloquear-user.component';
import { AgregarColaboradorComponent } from './features/feature-1/ui/Admin/agregar-colaborador/agregar-colaborador.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RecuperarContraseniaComponent } from './features/feature-1/ui/User/recuperar-contrasenia/recuperar-contrasenia.component';
import { OtpRecuperarContraseniaComponent } from './features/feature-1/ui/User/otp-recuperar-contrasenia/otp-recuperar-contrasenia.component';



export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginAppComponent
  },
  {
    path: 'login',
    component: LoginAppComponent
  },
  {
    path: 'verificar-cuenta',
    component: VerificarCuentaComponent
  },
  {
    path: 'recuperar-contrasenia',
    component: RecuperarContraseniaComponent
  },
  {
    path: 'otp-Recuperarcontrasenia',
    component: OtpRecuperarContraseniaComponent
  },
  {
    path: 'admin-dashboard',
    component: DashboardAdminComponent,
    children: [
      { path: 'cambiarPasword', component: CambiarContraseniaComponent },
      { path: '2FA', component: Autentificacion2faComponent },
      { path: 'bloquearUser', component: DesbloquearBloquearUserComponent },

    ],
  },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

