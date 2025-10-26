// Tipos relacionados con Empresa

export interface CrearEmpresaDto {
  razonsocial: string;
  ruc: string;
  contacto: string;
  telefono: string;
}

export interface Empresa {
  razonsocial: string;
  ruc: string;
  contacto: string;
  telefono: string;
  idempresa: string;
}

// Respuesta exitosa del API
export interface RespuestaExitosaEmpresa {
  success: true;
  message: string;
  data: Empresa;
}

// Respuesta de error del API
export interface RespuestaErrorEmpresa {
  response: {
    success: false;
    message: string;
    data?: Empresa;
  };
  status: number;
  options: Record<string, unknown>;
  message: string;
  name: string;
}
