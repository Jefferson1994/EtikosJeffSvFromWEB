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
    console.log("Creando usuario con datos:", JSON.stringify(userVerificar));
    try {
      // ✅ La llamada al repositorio usando async/await
      const respuesta = await this.repository.validarOtpRecuperarContrasenia(userVerificar);
      console.log("Respuesta del repositorio:", JSON.stringify(respuesta));
      return respuesta;
    } catch (error: any) {
      console.error('Error en el caso de uso validar otp contras:', error);

        let errorMessage = 'Error de red. No fue posible conectar con el servidor.';

        // 1. Verificar si el error es de tipo HttpErrorResponse de Angular
        if (error instanceof HttpErrorResponse) {

            // 2. Intentar extraer el mensaje del cuerpo del error (Error 400, 401, etc.)
            const errorBody = error.error;

            if (errorBody) {
                // Formato 1: Buscar la propiedad 'message' (Tu formato actual)
                if (typeof errorBody === 'object' && errorBody.message) {
                    errorMessage = errorBody.message;

                // Formato 2: Buscar la propiedad 'mensaje' (Tu formato inicial)
                } else if (typeof errorBody === 'object' && errorBody.mensaje) {
                    errorMessage = errorBody.mensaje;

                // Formato 3: El cuerpo del error es un string simple
                } else if (typeof errorBody === 'string') {
                    errorMessage = errorBody;
                }
            }

            // 3. Si no se encontró mensaje en el cuerpo, usar el status HTTP
            if (errorMessage === 'Error de red. No fue posible conectar con el servidor.') {
                 errorMessage = `Error de servidor (${error.status}): ${error.statusText || 'Error desconocido'}`;
            }

        } else if (error instanceof Error) {
            // Si es un error de JS genérico (ej. de un servicio)
            errorMessage = error.message;
        }

        // 4. Relanzar el error como una instancia limpia de Error de JavaScript
        // Esto propaga el mensaje *limpio* al componente.
        throw new Error(errorMessage)

    }
  }


}
