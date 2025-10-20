import { Injectable, inject } from '@angular/core';
import { UserApiRepository } from '../../../infrastructure/userServicios/user-api.services';
import { CrearUsuarioDTO, CrearUsuarioResponse, userResponseEstandar, UserverificarCuenta } from '../../models/userModelos';
import { HttpErrorResponse } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class usuarioVerificarCuentaUseCase {

  constructor(private readonly repository: UserApiRepository) { }


  async execute(usuarioVerificarCuenta: UserverificarCuenta): Promise<userResponseEstandar> {
    //console.log("Creando usuario con datos:", JSON.stringify(usuarioVerificarCuenta));
    try {
      // ✅ La llamada al repositorio usando async/await
      const respuesta = await this.repository.verificarCuenta(usuarioVerificarCuenta);
      //console.log("Respuesta del repositorio:", JSON.stringify(respuesta));
      return respuesta;
    } catch (error: any) {
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
