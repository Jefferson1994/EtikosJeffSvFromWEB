import { UserCredentials,UserResponse,UserCredentialsBuscar,BuscarColaboradorResponse,
  CrearUsuarioDTO,CrearUsuarioResponse,RolUsuario,
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
 } from '../../models/userModelos';

export interface UserRepositorio {
  CrearUsuario(crearUsario: CrearUsuarioDTO): Promise<CrearUsuarioResponse>;
  verificarCuenta(usuarioVerificarCuenta: UserverificarCuenta): Promise<userResponseEstandar>
  LoginUser(Login: UserCredentials): Promise<LoginResult>;
  validarOtpLogin(userRecuperar:UserverificarCuenta ): Promise<LoginResult>
  BuscarUser(userBuscar: UserCredentialsBuscar): Promise<BuscarColaboradorResponse>;
  cambiarPassword(producto: userCambiarPassword): Promise<userResponseEstandar>
  activar2FA(userActivaDesactiva: activaDesactivar2FA): Promise<userResponseEstandar>
  bloquarUsuario(userBloquear: bloquearUsuario): Promise<userResponseEstandar>
  desbloquarUsuario(userBloquear: bloquearUsuario): Promise<userResponseEstandar>
  solicitudRecuperarCOntrasenia(userRecuperar:solicitudRecuperarContrasenia ): Promise<userResponseEstandar>
  validarOtpRecuperarContrasenia(userRecuperar:cambiarContraseinaConCodigoOTP ): Promise<userResponseEstandar>
  cerrarCesion(): Promise<userResponseEstandar>


}

