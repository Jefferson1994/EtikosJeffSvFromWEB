import { Component, OnInit, ChangeDetectionStrategy, signal, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { buscarUserUseCase } from '../../../../feature-1/domain/use-cases/use-caseUsuario/userBusca.use-case';
import { AuthService } from '../../../services/auth.service';
import { LoadingService } from '../../../services/loading.service';
import { AlertService } from '../../../services/alert.service';
import { userBloquearUseCase } from '../../../domain/use-cases/use-caseUsuario/userBloquear.use-case';
import { bloquearUsuario, userResponseEstandar, } from '../../../domain/models/userModelos';
import { userDesBloquearUseCase } from '../../../domain/use-cases/use-caseUsuario/userDesbloquear.use-case';

@Component({
  selector: 'app-desbloquear-bloquear-user',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './desbloquear-bloquear-user.component.html',
  styleUrl: './desbloquear-bloquear-user.component.css'
})
export class DesbloquearBloquearUserComponent {

  private loadingService = inject(LoadingService);
  private alertService = inject(AlertService);
  loading = false;

  colaboradorData = signal<any>({
    cedula: '',
    nombre: '',
    correo: '',
    numero_telefono: '',
    numero_identificacion: '',
    id_negocio: null,
    codigo_punto_emision_movil: ''
  });
  isProcessing = signal(false);
  isAdminFound = signal<boolean>(false);
  camposBloqueados = signal<boolean>(true);
  desbloquepunto = signal<boolean>(true);


  cedulaData = signal<any>({ cedula: '' });
  constructor(
    private buscarUserUseCase: buscarUserUseCase,
    private authService: AuthService,
    private router: Router,
    private bloquearUserUseCase: userBloquearUseCase,
    private desbloquearUserUseCase: userDesBloquearUseCase

  ) { }

  async onBuscarColaborador(): Promise<void> {
    // ✅ Usa una variable local para obtener el valor de la señal
    const cedula = this.cedulaData().cedula;


    if (!cedula || cedula.length !== 10) {
      this.colaboradorData.set(null);
      this.camposBloqueados.set(false);
      return;
    }


    try {
      this.isProcessing.set(true);
      this.isAdminFound.set(false);
      this.loading = true;      // <-- Inicia la carga del componente
      this.loadingService.show(); // <-- Inicia la carga global
      console.log('Buscando colaborador con cédula:', cedula);
      const userCredentials = { cedula: cedula };
      const respuesta = await this.buscarUserUseCase.execute(userCredentials);
      console.log('la respues de consulta', JSON.stringify(respuesta))

      if (respuesta && respuesta) {
        this.colaboradorData.set(respuesta.colaborador);
        this.camposBloqueados.set(true); // Bloquea los campos si se encuentra al colaborador
        this.desbloquepunto.set(false);
        this.loading = false;     // <-- Detiene la carga del componente
        this.loadingService.hide();
        console.log('Rol del colaborador encontrado:', respuesta.colaborador.rol?.nombre); // Usa '?.' por seguridad

        // Compara directamente con respuesta.rol.nombre y usa 'Admin' (como en tu JSON)
        if (respuesta.colaborador.rol?.nombre === 'Admin') {
          this.alertService.showError('No se puede bloquear o desbloquear un usuario con rol Admin.');
          this.isAdminFound.set(true);
          this.loading = false;
        }
      } else {
        console.log('No se encontró un colaborador con esa cédula.');
        this.colaboradorData.set(null);
        this.camposBloqueados.set(false); // Desbloquea los campos para que se puedan editar
        this.desbloquepunto.set(true);
        this.loading = false;     // <-- Detiene la carga del componente
        this.loadingService.hide();
      }
    } catch (error) {
      console.error('Error al buscar colaborador:', error);
      this.colaboradorData.set(null);
      this.camposBloqueados.set(false); // Desbloquea los campos en caso de error
      this.desbloquepunto.set(true);

    } finally {
      this.loading = false;
      this.loadingService.hide();
      this.isProcessing.set(false);
    }
  }

  async cambiarEstado(nuevoEstado: 0 | 1): Promise<void> {
  const colaborador = this.colaboradorData();

  if (!colaborador || this.isAdminFound()) { // Ya previene acción si es admin
    console.log('Acción no permitida (no hay colaborador o es Admin).');
    return;
  }

  const accion = nuevoEstado === 0 ? 'bloquear' : 'desbloquear';
  const cedulaUsuario = colaborador.numero_identificacion;

  this.isProcessing.set(true);
  this.loadingService.show(); // Inicia loading global si lo usas aquí

  try {
    let respuesta: userResponseEstandar;
    const userDataPayload = { numero_identificacion: cedulaUsuario }; // Objeto a enviar

    console.log(`Intentando ${accion} al usuario ${cedulaUsuario}...`);

    // Llama al UseCase correspondiente
    if (nuevoEstado === 0) {
      respuesta = await this.bloquearUserUseCase.execute(userDataPayload);
    } else {
      respuesta = await this.desbloquearUserUseCase.execute(userDataPayload);
    }

    console.log(`Respuesta de la API (${accion}):`, JSON.stringify(respuesta));

    // Verifica si la API reportó un error
    if (!respuesta.success) {
      // Lanza un error para que sea capturado por el catch
      throw new Error(respuesta.message || `Falló la operación de ${accion}.`);
    }

    // --- ÉXITO ---
    // 1. Actualiza el estado local en la señal ANTES de limpiar,
    //    para que el usuario vea el cambio brevemente si es necesario.
    this.colaboradorData.update(currentData => {
      if (!currentData) return null;
      return { ...currentData, activo: nuevoEstado };
    });

    // 2. Muestra la alerta de éxito
    this.alertService.showSuccess(respuesta.message).then(() => {
      // 3. DESPUÉS de cerrar la alerta, limpia todo
      console.log('Limpiando formulario después del éxito.');
      this.colaboradorData.set(null);      // Limpia los datos del usuario encontrado
      this.cedulaData.set({ cedula: '' }); // Limpia el campo de búsqueda de cédula
      this.isAdminFound.set(false);      
      //this.errorBusqueda.set(null);      // Limpia cualquier error de búsqueda previo
    });

  } catch (error: any) {
    // --- MANEJO DE ERRORES ---
    console.error(`Error al ${accion} usuario:`, error);
    // Intenta obtener el mensaje específico del error
    const errorMessage = error?.message || `Error al ${accion} el usuario.`;
    this.alertService.showError(errorMessage);

  } finally {
    // --- SIEMPRE SE EJECUTA ---
    // Finaliza el estado de procesamiento
    this.isProcessing.set(false);
    this.loadingService.hide(); // Detiene loading global si lo usaste
    console.log(`--- Proceso de ${accion} finalizado ---`);
  }
}
}
