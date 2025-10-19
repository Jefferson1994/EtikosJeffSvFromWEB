import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  UserCredentials, UserResponse, UserCredentialsBuscar, BuscarColaboradorResponse,
  CrearUsuarioDTO, CrearUsuarioResponse,
  RolUsuario,
  ValidacionRequest,
  ValidacionResponse,
  RespuestaNegociosVinculados,
  NegocioVinculado,
  UserverificarCuenta,
  userResponseEstandar,
  userCambiarPassword,
  activaDesactivar2FA,
  bloquearUsuario,
  solicitudRecuperarContrasenia,
  cambiarContraseinaConCodigoOTP,
  LoginResult,
} from '../../domain/models/userModelos'; // Asegúrate de que los paths sean correctos
import { UserRepositorio } from '../../domain/repositories/userRepositories/user.repository'; // El contrato del repositorio
import bodyParser from 'body-parser';

@Injectable({
  providedIn: 'root'
})
export class UserApiRepository implements UserRepositorio {



  private readonly http = inject(HttpClient);

  //private readonly baseUrl = 'http://localhost:3000/api';
  private baseUrl = environment.apiUrl;

  // Publica sin token
  async CrearUsuario(crearUsario: CrearUsuarioDTO): Promise<CrearUsuarioResponse> {
    const url = `${this.baseUrl}user/createUser`;
    //console.log('la url es ', url)

    try {
      // Usamos lastValueFrom para convertir el Observable en una promesa
      // y manejarlo con async/await
      return await lastValueFrom(this.http.post<CrearUsuarioResponse>(url, crearUsario));
    } catch (error) {
      // El repositorio solo relanza el error. La lógica de manejo
      // específica va en el caso de uso o el componente.
      throw error;
    }
  }
  // Publica sin token
  async verificarCuenta(usuarioVerificarCuenta: UserverificarCuenta): Promise<userResponseEstandar> {
    const url = `${this.baseUrl}user/verificarCuenta`;
    //console.log('la url es ', url)

    try {
      // Usamos lastValueFrom para convertir el Observable en una promesa
      return await lastValueFrom(this.http.post<userResponseEstandar>(url, usuarioVerificarCuenta));
    } catch (error) {
      throw error;
    }
  }

  // Publica sin token
  async LoginUser(credentials: UserCredentials): Promise<LoginResult> {
    const url = `${this.baseUrl}user/login`;
    //console.log('url armada', url)

    try {
      // Usamos lastValueFrom para convertir el Observable en una promesa
      // y manejarlo con async/await
      return await lastValueFrom(this.http.post<LoginResult>(url, credentials));
    } catch (error) {
      // El repositorio solo relanza el error. La lógica de manejo
      // específica va en el caso de uso o el componente.
      throw error;
    }
  }

  //publica sin token
  async solicitudRecuperarCOntrasenia(userRecuperar:solicitudRecuperarContrasenia ): Promise<userResponseEstandar> {
    const url = `${this.baseUrl}user/recuperarPasword`;
    //console.log('la url es ', url)

    try {
      // Usamos lastValueFrom para convertir el Observable en una promesa
      return await lastValueFrom(this.http.post<userResponseEstandar>(url, userRecuperar));
    } catch (error) {
      throw error;
    }
  }

  //publica sin token

  async validarOtpRecuperarContrasenia(userRecuperar:cambiarContraseinaConCodigoOTP ): Promise<userResponseEstandar> {
    const url = `${this.baseUrl}user/resetPasword`;
    //console.log('la url es ', url)

    try {
      // Usamos lastValueFrom para convertir el Observable en una promesa
      return await lastValueFrom(this.http.post<userResponseEstandar>(url, userRecuperar));
    } catch (error) {
      throw error;
    }
  }

  //publica sin token
  async validarOtpLogin(userRecuperar:UserverificarCuenta ): Promise<LoginResult> {
    const url = `${this.baseUrl}user/validarOtp2Fa`;
    //console.log('la url es ', url)

    try {
      // Usamos lastValueFrom para convertir el Observable en una promesa
      return await lastValueFrom(this.http.post<LoginResult>(url, userRecuperar));
    } catch (error) {
      throw error;
    }
  }

  // Privada con  token
  async cambiarPassword(cambiarContrasenia: userCambiarPassword): Promise<userResponseEstandar> {
    const url = `${this.baseUrl}user/cambiarContrasenia`;
    try {
      const response = await lastValueFrom(
        // Bien: Esperas { success: true, message: ... }
        this.http.post<userResponseEstandar>(url, cambiarContrasenia)
      );
      // Bien: Devuelves la respuesta completa
      return response;
    } catch (error) {
      throw error;
    }
  }

  //Privada con token
  async activar2FA(userActivaDesactiva: activaDesactivar2FA): Promise<userResponseEstandar> {
    const url = `${this.baseUrl}user/activarVerificacion2Fa`;
    try {
      const response = await lastValueFrom(
        // Bien: Esperas { success: true, message: ... }
        this.http.post<userResponseEstandar>(url, userActivaDesactiva)
      );
      // Bien: Devuelves la respuesta completa
      return response;
    } catch (error) {
      throw error;
    }
  }
  // Privada con token
  async BuscarUser(userBuscar: UserCredentialsBuscar): Promise<BuscarColaboradorResponse> { // <-- OJO: Asegúrate que BuscarColaboradorResponse sea la interfaz del *usuario*, no de la respuesta completa
    const url = `${this.baseUrl}user/buscar-por-cedula`;
    try {
      const response = await lastValueFrom(
        // Bien: Espera directamente el objeto del colaborador/usuario
        this.http.post<BuscarColaboradorResponse>(url, userBuscar)
        //           ^-- Usa directamente el tipo del objeto usuario
      );
      // Bien: Devuelve la respuesta completa (que es el objeto usuario)
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Privada con token
  async bloquarUsuario(userBloquear: bloquearUsuario): Promise<userResponseEstandar> {
    const url = `${this.baseUrl}user/bloquearUsuario`;
    try {
      const response = await lastValueFrom(
        // Bien: Esperas { success: true, message: ... }
        this.http.post<userResponseEstandar>(url, userBloquear)
      );
      // Bien: Devuelves la respuesta completa
      return response;
    } catch (error) {
      throw error;
    }
  }
  // Privada con token
  async desbloquarUsuario(userBloquear: bloquearUsuario): Promise<userResponseEstandar> {
    const url = `${this.baseUrl}user/desbloquearUsuario`;
    try {
      const response = await lastValueFrom(
        // Bien: Esperas { success: true, message: ... }
        this.http.post<userResponseEstandar>(url, userBloquear)
      );
      // Bien: Devuelves la respuesta completa
      return response;
    } catch (error) {
      throw error;
    }
  }

  //Privada con token
  async cerrarCesion(): Promise<userResponseEstandar> {
    const url = `${this.baseUrl}user/cerrarSesion`;
    try {
      const response = await lastValueFrom(
        this.http.post<userResponseEstandar>(url, {})
      );
      // Bien: Devuelves la respuesta completa
      return response;
    } catch (error) {
      throw error;
    }
  }











}
