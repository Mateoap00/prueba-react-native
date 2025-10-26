import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';
import {
  esquemaCrearEmpresa,
  FormularioCrearEmpresa,
} from '../schemas/empresa.schema';
import { EmpresaServicio } from '../servicios/empresa.servicio';
import { useEmpresaStore } from '../stores/empresaStore';
import { RootStackParamList } from '../navegacion/RootNavigator';

type RegistroEmpresaNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'RegistroEmpresa'
>;

export default function RegistroEmpresa() {
  const navigation = useNavigation<RegistroEmpresaNavigationProp>();
  const [cargando, setCargando] = useState(false);
  const { setEmpresa } = useEmpresaStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormularioCrearEmpresa>({
    resolver: zodResolver(esquemaCrearEmpresa),
    defaultValues: {
      razonsocial: '',
      ruc: '',
      contacto: '',
      telefono: '',
    },
  });

  const enviarFormulario = async (datos: FormularioCrearEmpresa) => {
    setCargando(true);
    try {
      const empresaCreada = await EmpresaServicio.crearEmpresa(datos);

      // Guardar empresa en el store global y AsyncStorage
      await setEmpresa(empresaCreada.idempresa, empresaCreada.razonsocial);

      Toast.show({
        type: 'success',
        text1: '¡Empresa creada exitosamente!',
        text2: `${empresaCreada.razonsocial} ha sido registrada`,
        position: 'top',
      });

      // Limpiar formulario
      reset();

      // Navegar a la pantalla de creación de usuario con el idEmpresa
      setTimeout(() => {
        navigation.navigate('RegistroUsuario', {
          idEmpresa: empresaCreada.idempresa,
        });
      }, 1500);
    } catch (error: any) {
      let mensajeError = 'No se pudo crear la empresa. Intente nuevamente.';

      // El servicio ya lanza el error.message correctamente
      if (error.message) {
        mensajeError = error.message;
      }

      Toast.show({
        type: 'error',
        text1: 'Error al crear empresa',
        text2: mensajeError,
        position: 'top',
      });
    } finally {
      setCargando(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-gray-50"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 px-6 py-8">
          {/* Encabezado */}
          <View className="mb-8">
            <Text className="text-3xl font-bold text-gray-800 mb-2">
              Registro de Empresa
            </Text>
            <Text className="text-base text-gray-600">
              Complete los datos para registrar su empresa
            </Text>
          </View>

          {/* Formulario */}
          <View className="space-y-4">
            {/* Campo: Razón Social */}
            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 mb-2">
                Razón Social *
              </Text>
              <Controller
                control={control}
                name="razonsocial"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className={`bg-white border ${
                      errors.razonsocial ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg px-4 py-3 text-gray-800`}
                    placeholder="Ej: Restaurante El Buen Sabor S.A.C."
                    placeholderTextColor="#9CA3AF"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    editable={!cargando}
                  />
                )}
              />
              {errors.razonsocial && (
                <Text className="text-red-500 text-xs mt-1">
                  {errors.razonsocial.message}
                </Text>
              )}
            </View>

            {/* Campo: RUC */}
            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 mb-2">
                RUC *
              </Text>
              <Controller
                control={control}
                name="ruc"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className={`bg-white border ${
                      errors.ruc ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg px-4 py-3 text-gray-800`}
                    placeholder="12345678901"
                    placeholderTextColor="#9CA3AF"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    keyboardType="numeric"
                    maxLength={13}
                    editable={!cargando}
                  />
                )}
              />
              {errors.ruc && (
                <Text className="text-red-500 text-xs mt-1">
                  {errors.ruc.message}
                </Text>
              )}
            </View>

            {/* Campo: Contacto */}
            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 mb-2">
                Nombre de Contacto *
              </Text>
              <Controller
                control={control}
                name="contacto"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className={`bg-white border ${
                      errors.contacto ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg px-4 py-3 text-gray-800`}
                    placeholder="Ej: Juan Pérez"
                    placeholderTextColor="#9CA3AF"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    editable={!cargando}
                  />
                )}
              />
              {errors.contacto && (
                <Text className="text-red-500 text-xs mt-1">
                  {errors.contacto.message}
                </Text>
              )}
            </View>

            {/* Campo: Teléfono */}
            <View className="mb-6">
              <Text className="text-sm font-semibold text-gray-700 mb-2">
                Teléfono *
              </Text>
              <Controller
                control={control}
                name="telefono"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className={`bg-white border ${
                      errors.telefono ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg px-4 py-3 text-gray-800`}
                    placeholder="Ej: 0987654321"
                    placeholderTextColor="#9CA3AF"
                    maxLength={10}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    keyboardType="phone-pad"
                    editable={!cargando}
                  />
                )}
              />
              {errors.telefono && (
                <Text className="text-red-500 text-xs mt-1">
                  {errors.telefono.message}
                </Text>
              )}
            </View>

            {/* Botón de envío */}
            <TouchableOpacity
              className={`rounded-lg py-4 ${
                cargando ? 'bg-blue-300' : 'bg-blue-600'
              }`}
              onPress={handleSubmit(enviarFormulario)}
              disabled={cargando}
            >
              {cargando ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text className="text-white text-center font-semibold text-base">
                  Registrar Empresa
                </Text>
              )}
            </TouchableOpacity>

            {/* Link a Login */}
            <View className="mt-6">
              <Text className="text-gray-600 text-center mb-2">
                ¿Ya tienes una cuenta?
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('Login')}
                disabled={cargando}
              >
                <Text className="text-blue-600 text-center font-semibold">
                  Iniciar Sesión
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Toast para notificaciones */}
      <Toast />
    </KeyboardAvoidingView>
  );
}
