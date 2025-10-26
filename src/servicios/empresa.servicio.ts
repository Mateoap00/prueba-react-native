import { apiCliente } from './api';
import {
  CrearEmpresaDto,
  Empresa,
  RespuestaExitosaEmpresa
} from '../tipos/empresa';
import { AxiosError } from 'axios';

/**
 * Servicio para manejar operaciones relacionadas con empresas
 */
export class EmpresaServicio {
  private static readonly RUTA_BASE = '/v1/empresa';

  /**
   * Crear una nueva empresa
   * @param datos Datos de la empresa a crear
   * @returns Promesa con la empresa creada
   * @throws Error con el mensaje del servidor si falla
   */
  static async crearEmpresa(datos: CrearEmpresaDto): Promise<Empresa> {
    try {
      const respuesta = await apiCliente.post<RespuestaExitosaEmpresa>(
        this.RUTA_BASE,
        datos
      );

      console.log('✅ Respuesta exitosa del servidor:', respuesta.data);

      // La respuesta exitosa viene en formato: { success: true, message: "...", data: {...} }
      if (respuesta.data.success && respuesta.data.data) {
        return respuesta.data.data;
      }

      throw new Error('Formato de respuesta inesperado del servidor');
    } catch (error) {
      console.error('❌ Error al crear empresa:', error);

      // Manejar errores de Axios
      if (error instanceof AxiosError && error.response) {
        const errorData = error.response.data;

        // El servidor responde con: { response: { success: false, message: "...", data?: {...} }, status: 400, ... }
        // O con estructura similar
        if (errorData.message) {
          throw new Error(errorData.message);
        }

        // Si viene en formato { response: { message: "..." } }
        if (errorData.response?.message) {
          throw new Error(errorData.response.message);
        }
      }

      throw error;
    }
  }

  /**
   * Obtener todas las empresas
   * @returns Promesa con la lista de empresas
   */
  static async obtenerEmpresas(): Promise<Empresa[]> {
    try {
      const respuesta = await apiCliente.get<Empresa[]>(this.RUTA_BASE);
      return respuesta.data;
    } catch (error) {
      console.error('Error al obtener empresas:', error);
      throw error;
    }
  }

  /**
   * Obtener una empresa por ID
   * @param id ID de la empresa
   * @returns Promesa con la empresa encontrada
   */
  static async obtenerEmpresaPorId(id: string): Promise<Empresa> {
    try {
      const respuesta = await apiCliente.get<Empresa>(
        `${this.RUTA_BASE}/${id}`
      );
      return respuesta.data;
    } catch (error) {
      console.error('Error al obtener empresa:', error);
      throw error;
    }
  }

  /**
   * Actualizar una empresa existente
   * @param id ID de la empresa a actualizar
   * @param datos Datos actualizados de la empresa
   * @returns Promesa con la empresa actualizada
   */
  static async actualizarEmpresa(
    id: string,
    datos: Partial<CrearEmpresaDto>
  ): Promise<Empresa> {
    try {
      const respuesta = await apiCliente.patch<Empresa>(
        `${this.RUTA_BASE}/${id}`,
        datos
      );
      return respuesta.data;
    } catch (error) {
      console.error('Error al actualizar empresa:', error);
      throw error;
    }
  }

  /**
   * Eliminar una empresa
   * @param id ID de la empresa a eliminar
   * @returns Promesa con confirmación de eliminación
   */
  static async eliminarEmpresa(id: string): Promise<void> {
    try {
      await apiCliente.delete(`${this.RUTA_BASE}/${id}`);
    } catch (error) {
      console.error('Error al eliminar empresa:', error);
      throw error;
    }
  }
}
