import { Injectable, inject } from '@angular/core';
import { UserApiRepository } from '../../../infrastructure/userServicios/user-api.services';
import { BuscarColaboradorResponse,UserCredentialsBuscar } from '../../models/userModelos';

@Injectable({
  providedIn: 'root'
})
export class buscarUserUseCase {

  constructor(private readonly repository: UserApiRepository) {}

  async execute(userBuscar: UserCredentialsBuscar): Promise<BuscarColaboradorResponse> {
    //console.log("la empresa en el caso de uso ", JSON.stringify(userBuscar) );

    try {
      const respuesta = await this.repository.BuscarUser(userBuscar);
      //console.log("usuario obteido", JSON.stringify(respuesta));
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
