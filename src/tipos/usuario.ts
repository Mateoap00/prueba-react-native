// Tipos relacionados con Usuario

export interface CrearUsuarioDto {
  identificacion: string;
  nombres: string;
  apellidos: string;
  email: string;
  password: string;
  telefono: string;
  direccion: string;
  role: string;
  empresa: string;
}

export interface Usuario {
  identificacion: string;
  nombres: string;
  apellidos: string;
  email: string;
  telefono: string;
  direccion: string;
  role: string;
  empresa: string;
  idusuario?: string;
}

// Respuesta exitosa del API
export interface RespuestaExitosaUsuario {
  success: true;
  message: string;
  data: Usuario;
}
