import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DatosUsuarioAuth } from '../tipos/auth';

interface AuthState {
  token: string | null;
  usuario: DatosUsuarioAuth | null;
  setAuth: (token: string, usuario: DatosUsuarioAuth) => Promise<void>;
  cargarAuth: () => Promise<void>;
  limpiarAuth: () => Promise<void>;
}

const STORAGE_TOKEN_KEY = 'authToken';
const STORAGE_USUARIO_KEY = 'authUsuario';

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  usuario: null,

  setAuth: async (token: string, usuario: DatosUsuarioAuth) => {
    try {
      await AsyncStorage.setItem(STORAGE_TOKEN_KEY, token);
      await AsyncStorage.setItem(STORAGE_USUARIO_KEY, JSON.stringify(usuario));
      set({ token, usuario });
      console.log('✅ Autenticación guardada en AsyncStorage');
    } catch (error) {
      console.error('❌ Error al guardar autenticación:', error);
    }
  },

  cargarAuth: async () => {
    try {
      const token = await AsyncStorage.getItem(STORAGE_TOKEN_KEY);
      const usuarioJson = await AsyncStorage.getItem(STORAGE_USUARIO_KEY);

      if (token && usuarioJson) {
        const usuario = JSON.parse(usuarioJson) as DatosUsuarioAuth;
        set({ token, usuario });
        console.log('✅ Autenticación cargada desde AsyncStorage');
      }
    } catch (error) {
      console.error('❌ Error al cargar autenticación:', error);
    }
  },

  limpiarAuth: async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_TOKEN_KEY);
      await AsyncStorage.removeItem(STORAGE_USUARIO_KEY);
      set({ token: null, usuario: null });
      console.log('✅ Autenticación limpiada');
    } catch (error) {
      console.error('❌ Error al limpiar autenticación:', error);
    }
  },
}));
