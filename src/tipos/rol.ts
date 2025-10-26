// Tipos relacionados con Roles

export interface Rol {
  idrol: string;
  nombre: string;
  descripcion?: string;
}

// Respuesta del API para obtener roles
export interface RespuestaRoles {
  success: true;
  message: string;
  data: Rol[];
}
