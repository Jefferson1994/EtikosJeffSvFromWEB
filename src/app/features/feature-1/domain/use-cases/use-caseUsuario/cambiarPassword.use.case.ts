import { Injectable, inject } from '@angular/core';
import { UserApiRepository } from '../../../infrastructure/userServicios/user-api.services';
import { userCambiarPassword, userResponseEstandar } from '../../models/userModelos';


@Injectable({
  providedIn: 'root'
})
export class userCambiarPaswordUseCase {

  constructor(private readonly repository: UserApiRepository) { }

  async execute(userCambiarPassword: userCambiarPassword): Promise<userResponseEstandar> {
    console.log("cambiar pasword", JSON.stringify(userCambiarPassword));

    try {
      const respuesta = await this.repository.cambiarPassword(userCambiarPassword);
      console.log("respuesta cambiar pasword:", JSON.stringify(respuesta));
      return respuesta; // <-- CORREGIDO
    } catch (error) {
      console.error('Error en el caso de uso al cambiar password:', error);
      throw error;
    }
  }
}
