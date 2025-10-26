import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import RootNavigator from './src/navegacion/RootNavigator';
import { useEmpresaStore } from './src/stores/empresaStore';

export default function App() {
  const [cargando, setCargando] = useState(true);
  const { cargarEmpresa } = useEmpresaStore();

  useEffect(() => {
    const inicializar = async () => {
      await cargarEmpresa();
      setCargando(false);
    };

    inicializar();
  }, [cargarEmpresa]);

  if (cargando) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return <RootNavigator />;
}