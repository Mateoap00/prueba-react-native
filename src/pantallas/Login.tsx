import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { loginSchema, type FormularioLogin } from '../schemas/auth.schema';
import { AuthServicio } from '../servicios/auth.servicio';
import { useAuthStore } from '../stores/authStore';
import type { RootStackParamList } from '../navegacion/RootNavigator';

type LoginNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Login'
>;

export default function Login() {
  const navigation = useNavigation<LoginNavigationProp>();
  const { setAuth } = useAuthStore();
  const [cargando, setCargando] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormularioLogin>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const enviarFormulario = async (datos: FormularioLogin) => {
    try {
      setCargando(true);

      const { token, usuario } = await AuthServicio.login(datos);

      await setAuth(token, usuario);

      Toast.show({
        type: 'success',
        text1: 'Inicio de sesión exitoso',
        text2: `Bienvenido ${usuario.nombres}`,
        position: 'top',
      });

      // TODO: Navegar a la pantalla principal/dashboard
    } catch (error) {
      const mensaje =
        error instanceof Error ? error.message : 'Error al iniciar sesión';

      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: mensaje,
        position: 'top',
      });
    } finally {
      setCargando(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        className="bg-white"
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 justify-center px-6 py-8">
          {/* Header */}
          <View className="mb-8">
            <Text className="text-3xl font-bold text-gray-800 mb-2">
              Iniciar Sesión
            </Text>
            <Text className="text-gray-600">
              Ingresa tus credenciales para continuar
            </Text>
          </View>

          {/* Formulario */}
          <View className="space-y-4">
            {/* Email */}
            <View>
              <Text className="text-gray-700 font-medium mb-2">Email</Text>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className="border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
                    placeholder="ejemplo@correo.com"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    editable={!cargando}
                  />
                )}
              />
              {errors.email && (
                <Text className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </Text>
              )}
            </View>

            {/* Contraseña */}
            <View>
              <Text className="text-gray-700 font-medium mb-2">Contraseña</Text>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className="border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
                    placeholder="••••••••"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    secureTextEntry
                    editable={!cargando}
                  />
                )}
              />
              {errors.password && (
                <Text className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </Text>
              )}
            </View>

            {/* Botón de submit */}
            <TouchableOpacity
              className={`rounded-lg py-4 mt-6 ${
                cargando ? 'bg-blue-300' : 'bg-blue-500'
              }`}
              onPress={handleSubmit(enviarFormulario)}
              disabled={cargando}
            >
              {cargando ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white text-center font-semibold text-lg">
                  Iniciar Sesión
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
