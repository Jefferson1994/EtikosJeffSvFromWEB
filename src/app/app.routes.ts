import { Routes } from '@angular/router';
import { LoginAppComponent } from './features/feature-1/ui/User/login-app/login-app.component';
import { VerificarCuentaComponent } from './features/feature-1/ui/User/verificar-cuenta/verificar-cuenta.component';

import { DashboardAdminComponent } from './features/feature-1/ui/Admin/dashboard-admin/dashboard-admin.component';
import { AgregarColaboradorComponent } from './features/feature-1/ui/Admin/agregar-colaborador/agregar-colaborador.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';


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
  /*{
    path: 'admin-dashboard',
    component: DashboardAdminComponent,
    children: [
      { path: 'empresalist', component: VerEmpresasComponent },
      { path: 'crearEmpresa', component: CrearEmpresaComponent },
      { path: 'seleccionarEmpresaProducto', component: VerEmpresasComponent },
      { path: 'seleccionarEmpresaServicio', component: VerEmpresasComponent },
      { path: 'seleccionarEmpresaColaborador', component: VerEmpresasComponent },
      { path: 'listarColaboradorEmpresa', component: VerEmpresasComponent },
      { path: 'listarProductoEmpresa', component: VerEmpresasComponent },
      { path: 'listarServicioEmpresa', component: VerEmpresasComponent },
      { path: 'crearProducto/:id_empresa', component: CrearProductoComponent },
      { path: 'crearServicio/:id_empresa', component: CrearProductoComponent },
      { path: 'AgregarColaborador/:id_empresa', component: AgregarColaboradorComponent },
      { path: 'verDetalleEmpresa/:id_empresa', component: VerEmpresaDetalleComponent },
      { path: 'verTodasColaboradores/:id_empresa', component: ListarColaboradoresComponent },
      { path: 'verTodosProductos/:id_empresa', component: ListarProductosComponent },
      { path: 'verTodosServicios/:id_empresa', component: ListarServiciosComponent },
      { path: 'abrirCaja', component: AbrircajaComponent },
      { path: 'movimientosCaja', component: MovimientoscajaComponent },
      { path: 'cerraCaja', component: CerrarcajaComponent },
    ],
  },*/


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

