import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RegistroEmpresa from '../pantallas/RegistroEmpresa';
import RegistroUsuario from '../pantallas/RegistroUsuario';
import Login from '../pantallas/Login';
import { useEmpresaStore } from '../stores/empresaStore';

export type RootStackParamList = {
  RegistroEmpresa: undefined;
  RegistroUsuario: { idEmpresa: string };
  Login: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const { idEmpresa } = useEmpresaStore();

  // Determinar pantalla inicial basándose en si existe empresa guardada
  const initialRouteName = idEmpresa ? 'RegistroUsuario' : 'RegistroEmpresa';

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRouteName}
        screenOptions={{
          headerStyle: {
            backgroundColor: '#2563EB',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="RegistroEmpresa"
          component={RegistroEmpresa}
          options={{
            title: 'Registro de Empresa',
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="RegistroUsuario"
          component={RegistroUsuario}
          options={{
            title: 'Registro de Usuario',
            headerShown: true,
          }}
          initialParams={idEmpresa ? { idEmpresa } : undefined}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            title: 'Iniciar Sesión',
            headerShown: true,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
