import { apiCliente } from './api';
import { Rol, RespuestaRoles } from '../tipos/rol';
import { AxiosError } from 'axios';

/**
 * Servicio para manejar operaciones relacionadas con roles
 */
export class RolServicio {
  private static readonly RUTA_BASE = '/v1/roles';

  /**
   * Obtener todos los roles disponibles
   * @returns Promesa con la lista de roles
   */
  static async obtenerRoles(): Promise<Rol[]> {
    try {
      const respuesta = await apiCliente.get<RespuestaRoles>(this.RUTA_BASE);

      console.log('✅ Roles obtenidos:', respuesta.data);

      if (respuesta.data.success && respuesta.data.data) {
        return respuesta.data.data;
      }

      throw new Error('Formato de respuesta inesperado del servidor');
    } catch (error) {
      console.error('❌ Error al obtener roles:', error);

      if (error instanceof AxiosError && error.response) {
        const errorData = error.response.data;

        if (errorData.message) {
          throw new Error(errorData.message);
        }

        if (errorData.response?.message) {
          throw new Error(errorData.response.message);
        }
      }

      throw error;
    }
  }
}
