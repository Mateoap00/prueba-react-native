// Tipos relacionados con Autenticación

export interface CredencialesLogin {
  email: string;
  password: string;
}

export interface DatosUsuarioAuth {
  idusuario: string;
  email: string;
  nombres: string;
  apellidos: string;
  role: string;
  empresa: string;
}

export interface RespuestaLogin {
  success: true;
  message: string;
  data: {
    token: string;
    usuario: DatosUsuarioAuth;
  };
}
