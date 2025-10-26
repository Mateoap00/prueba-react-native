import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface EmpresaState {
  idEmpresa: string | null;
  nombreEmpresa: string | null;
  setEmpresa: (id: string, nombre: string) => Promise<void>;
  cargarEmpresa: () => Promise<void>;
  limpiarEmpresa: () => Promise<void>;
}

export const useEmpresaStore = create<EmpresaState>((set) => ({
  idEmpresa: null,
  nombreEmpresa: null,

  setEmpresa: async (id: string, nombre: string) => {
    try {
      await AsyncStorage.setItem('idEmpresa', id);
      await AsyncStorage.setItem('nombreEmpresa', nombre);
      set({ idEmpresa: id, nombreEmpresa: nombre });
      console.log('✅ Empresa guardada en AsyncStorage:', { id, nombre });
    } catch (error) {
      console.error('❌ Error al guardar empresa:', error);
    }
  },

  cargarEmpresa: async () => {
    try {
      const id = await AsyncStorage.getItem('idEmpresa');
      const nombre = await AsyncStorage.getItem('nombreEmpresa');
      if (id && nombre) {
        set({ idEmpresa: id, nombreEmpresa: nombre });
        console.log('✅ Empresa cargada desde AsyncStorage:', { id, nombre });
      }
    } catch (error) {
      console.error('❌ Error al cargar empresa:', error);
    }
  },

  limpiarEmpresa: async () => {
    try {
      await AsyncStorage.removeItem('idEmpresa');
      await AsyncStorage.removeItem('nombreEmpresa');
      set({ idEmpresa: null, nombreEmpresa: null });
      console.log('✅ Empresa limpiada de AsyncStorage');
    } catch (error) {
      console.error('❌ Error al limpiar empresa:', error);
    }
  },
}));
