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
 } from '../../models/userModelos';

export interface UserRepositorio {
  CrearUsuario(crearUsario: CrearUsuarioDTO): Promise<CrearUsuarioResponse>;
  verificarCuenta(usuarioVerificarCuenta: UserverificarCuenta): Promise<userResponseEstandar>
  LoginUser(Login: UserCredentials): Promise<UserResponse>;
  BuscarUser(userBuscar: UserCredentialsBuscar): Promise<BuscarColaboradorResponse>;
  RolesActivos(): Promise<RolUsuario[]>;
  BuscarCiudadano(userBuscar: ValidacionRequest): Promise<ValidacionResponse>
  usuarioEmpresasVinculadas(): Promise<RespuestaNegociosVinculados>
  cambiarPassword(producto: userCambiarPassword): Promise<userResponseEstandar>
  activar2FA(userActivaDesactiva: activaDesactivar2FA): Promise<userResponseEstandar>
  bloquarUsuario(userBloquear: bloquearUsuario): Promise<userResponseEstandar>
  desbloquarUsuario(userBloquear: bloquearUsuario): Promise<userResponseEstandar>
  solicitudRecuperarCOntrasenia(userRecuperar:solicitudRecuperarContrasenia ): Promise<userResponseEstandar>
  validarOtpRecuperarContrasenia(userRecuperar:cambiarContraseinaConCodigoOTP ): Promise<userResponseEstandar>
}

