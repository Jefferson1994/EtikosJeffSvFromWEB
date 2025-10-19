import { Injectable, inject } from '@angular/core';
import { UserApiRepository } from '../../../infrastructure/userServicios/user-api.services';
import { cambiarContraseinaConCodigoOTP, CrearUsuarioDTO, CrearUsuarioResponse, userResponseEstandar, UserverificarCuenta } from '../../models/userModelos';
import { HttpErrorResponse } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class validarOtpCambiarPasswordUseCase {

  constructor(private readonly repository: UserApiRepository) { }


  async execute(userVerificar: cambiarContraseinaConCodigoOTP): Promise<userResponseEstandar> {
    //console.log("Creando usuario con datos:", JSON.stringify(userVerificar));
    try {
      // ✅ La llamada al repositorio usando async/await
      const respuesta = await this.repository.validarOtpRecuperarContrasenia(userVerificar);
      //console.log("Respuesta del repositorio:", JSON.stringify(respuesta));
      return respuesta;
    } catch (error: any) {
      //console.error('Error en el caso de uso validar otp contras:', error);

      let errorMessage = 'Error de red. No fue posible conectar con el servidor.';
      if (error instanceof HttpErrorResponse) {

        const errorBody = error.error;

        if (errorBody) {
          if (typeof errorBody === 'object' && errorBody.message) {
            errorMessage = errorBody.message;
          } else if (typeof errorBody === 'object' && errorBody.mensaje) {
            errorMessage = errorBody.mensaje;
          } else if (typeof errorBody === 'string') {
            errorMessage = errorBody;
          }
        }
        if (errorMessage === 'Error de red. No fue posible conectar con el servidor.') {
          errorMessage = `Error de servidor (${error.status}): ${error.statusText || 'Error desconocido'}`;
        }

      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      throw new Error(errorMessage)

    }
  }


}
