import { apiCliente } from './api';
import { CredencialesLogin, RespuestaLogin } from '../tipos/auth';
import { AxiosError } from 'axios';

/**
 * Servicio para manejar operaciones de autenticación
 */
export class AuthServicio {
  private static readonly RUTA_BASE = '/v1/auth';

  /**
   * Iniciar sesión con email y contraseña
   * @param credenciales - Email y contraseña del usuario
   * @returns Promesa con el token y datos del usuario
   */
  static async login(credenciales: CredencialesLogin): Promise<RespuestaLogin['data']> {
    try {
      console.log('🔐 Intentando login con:', credenciales.email);

      const respuesta = await apiCliente.post<RespuestaLogin>(
        this.RUTA_BASE,
        credenciales
      );

      console.log('✅ Login exitoso:', respuesta.data);

      if (respuesta.data.success && respuesta.data.data) {
        return respuesta.data.data;
      }

      throw new Error('Formato de respuesta inesperado del servidor');
    } catch (error) {
      console.error('❌ Error en login:', error);

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
