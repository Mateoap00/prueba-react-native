import { apiCliente } from './api';
import {
  CrearUsuarioDto,
  Usuario,
  RespuestaExitosaUsuario
} from '../tipos/usuario';
import { AxiosError } from 'axios';

/**
 * Servicio para manejar operaciones relacionadas con usuarios
 */
export class UsuarioServicio {
  private static readonly RUTA_BASE = '/v1/usuarios';

  /**
   * Crear un nuevo usuario
   * @param datos Datos del usuario a crear
   * @returns Promesa con el usuario creado
   * @throws Error con el mensaje del servidor si falla
   */
  static async crearUsuario(datos: CrearUsuarioDto): Promise<Usuario> {
    try {
      const respuesta = await apiCliente.post<RespuestaExitosaUsuario>(
        this.RUTA_BASE,
        datos
      );

      console.log('✅ Respuesta exitosa del servidor:', respuesta.data);

      if (respuesta.data.success && respuesta.data.data) {
        return respuesta.data.data;
      }

      throw new Error('Formato de respuesta inesperado del servidor');
    } catch (error) {
      console.error('❌ Error al crear usuario:', error);

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

  /**
   * Obtener todos los usuarios
   * @returns Promesa con la lista de usuarios
   */
  static async obtenerUsuarios(): Promise<Usuario[]> {
    try {
      const respuesta = await apiCliente.get<{ success: true; data: Usuario[] }>(
        this.RUTA_BASE
      );

      if (respuesta.data.success && respuesta.data.data) {
        return respuesta.data.data;
      }

      throw new Error('Formato de respuesta inesperado del servidor');
    } catch (error) {
      console.error('❌ Error al obtener usuarios:', error);
      throw error;
    }
  }
}
