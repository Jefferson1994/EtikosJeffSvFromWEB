import { Injectable, inject } from '@angular/core';
import { UserApiRepository } from '../../../infrastructure/userServicios/user-api.services';
import { userCambiarPassword, userResponseEstandar } from '../../models/userModelos';


@Injectable({
  providedIn: 'root'
})
export class userCambiarPaswordUseCase {

  constructor(private readonly repository: UserApiRepository) { }

  async execute(userCambiarPassword: userCambiarPassword): Promise<userResponseEstandar> {
    //console.log("cambiar pasword", JSON.stringify(userCambiarPassword));

    try {
      const respuesta = await this.repository.cambiarPassword(userCambiarPassword);
      //console.log("respuesta cambiar pasword:", JSON.stringify(respuesta));
      return respuesta;
    } catch (error: any) {
      //console.error('Error en el caso de uso:', error);
      let errorMessage = 'Ocurrió un error inesperado al registrar el usuario.';
      if (error && error.error && error.error.mensaje) {
        errorMessage = error.error.mensaje;
      }
      throw new Error(errorMessage);
    }
  }
}
