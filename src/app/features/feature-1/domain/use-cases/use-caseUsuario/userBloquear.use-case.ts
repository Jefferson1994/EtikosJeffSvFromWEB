import { Injectable, inject } from '@angular/core';
import { UserApiRepository } from '../../../infrastructure/userServicios/user-api.services';
import { bloquearUsuario, userResponseEstandar } from '../../models/userModelos';


@Injectable({
  providedIn: 'root'
})
export class userBloquearUseCase {

  constructor(private readonly repository: UserApiRepository) { }

  async execute(userbloquear: bloquearUsuario): Promise<userResponseEstandar> {
    console.log("cambiar pasword", JSON.stringify(userbloquear));

    try {
      const respuesta = await this.repository.bloquarUsuario(userbloquear);
      console.log("respuesta cambiar pasword:", JSON.stringify(respuesta));
      return respuesta;
    } catch (error) {
      console.error('Error en el caso de uso al cambiar password:', error);
      throw error;
    }
  }
}
