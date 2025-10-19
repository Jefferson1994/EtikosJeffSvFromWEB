import { Injectable, inject } from '@angular/core';
import { UserApiRepository } from '../../../infrastructure/userServicios/user-api.services';
import { activaDesactivar2FA, userCambiarPassword, userResponseEstandar } from '../../models/userModelos';


@Injectable({
  providedIn: 'root'
})
export class activarDesactivaR2FACase {

  constructor(private readonly repository: UserApiRepository) { }

  async execute(userActivaDesactiva: activaDesactivar2FA): Promise<userResponseEstandar> {
    console.log("cambiar pasword", JSON.stringify(userActivaDesactiva));

    try {
      const respuesta = await this.repository.activar2FA(userActivaDesactiva);
      console.log("respuesta cambiar pasword:", JSON.stringify(respuesta));
      return respuesta; // <-- CORREGIDO
    } catch (error) {
      console.error('Error en el caso de uso al cambiar password:', error);
      throw error;
    }
  }
}
