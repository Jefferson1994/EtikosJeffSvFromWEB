// modelo de un producto
export interface UserCredentials {
  email: string;
  password: string;
}

export interface cambiarPassword {
  contrasenaActual: string;
  nuevaContrasena: string;
}


// src/app/features/feature-1/domain/models/userModelos.ts
// ✅ Define esta interfaz para que coincida con la respuesta de tu API
export interface UserResponse {
  message: string;
  user: {
    id: number;
    nombre: string;
    correo: string;
    id_rol: number;
    numero_telefono: string;
    numero_identificacion: string;
    creado_en: string;
    activo: number;
    autentificacion_dos_pasos_activa: number; // 1 o 0
    negociosAdministrados: any[]; // O tipar con una interfaz si conoces la estructura
    rol: {
      id: number;
      nombre: string;
      descripcion: string;
      activo: number;
    };
  };
  token: string;
}

export interface TwoFactorRequiredResponse {
  twoFactorRequired: true;
  message: string;
}

export type LoginResult = UserResponse | TwoFactorRequiredResponse;


export interface UserCredentialsBuscar {
  cedula: string;
}

export interface Rol {
    id: number;
    nombre: string;
    descripcion: string;
    activo: number;
}

export interface Colaborador {
    id: number;
    nombre: string;
    correo: string;
    id_rol: number;
    numero_telefono: string;
    numero_identificacion: string;
    creado_en: string;
    activo: number;
    rol: Rol;
}

export interface BuscarColaboradorResponse {
    mensaje: string;
    colaborador: Colaborador;
}

export interface CrearUsuarioDTO {
  nombre: string;
  correo: string;
  contrasena: string;
  id_rol: number;
  numero_telefono: string;
  numero_identificacion: string;
}

export interface bloquearUsuario {
  numero_identificacion: string;
}

export interface solicitudRecuperarContrasenia {
  email: string;
}

export interface cambiarContraseinaConCodigoOTP {
  email: string;
  codigoOtp: string;
  nuevaContrasena: string;
}



export interface UserverificarCuenta {
  correo: string;
  codigoOtp: string;
}

export interface userResponseEstandar {
  success: boolean;
  message: string;
}

export interface userCambiarPassword {
  contrasenaActual: string;
  nuevaContrasena: string;
}

export interface activaDesactivar2FA {
  activar: Boolean;
}


export interface CrearUsuarioResponse {
  mensaje: string;
  usuario: {
    nombre: string;
    correo: string;
    id_rol: number;
    numero_telefono: string;
    numero_identificacion: string;
    id: number;
    creado_en: string;
    activo: number;
  };
}

export interface RolUsuario {
  id: number;
  nombre: string;
  descripcion: string;
  activo: number;
}

export interface CiudadanoEstandar {
    identificacion: string;
    nombreCompleto: string;
    Nombres: string;
    Apellidos: string;
    fechaNacimiento: string;
    edad:number
    fechaDefuncion: string | null;
}


export interface ValidacionResponse {
    ok: boolean;
    datos?: CiudadanoEstandar;
}
export interface ValidacionRequest {
    tipo: string;
    identificacion: string;
}


export interface NegocioVinculado {
  id: number;
  nombre: string;
  ruc: string;
  codigo_establecimiento: string;
  descripcion: string;
  activo: number;
  id_tipo_empresa: number;
  id_datos_contacto: number;
  direccion: string;
  horario_apertura: string;
  horario_cierre: string;
  id_administrador: number;
  creado_en: string;
}


export interface RespuestaNegociosVinculados {
  mensaje: string;
  negocios: NegocioVinculado[];
}

