import React, { useState, useEffect } from 'react';
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
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';
import {
  esquemaCrearUsuario,
  FormularioCrearUsuario,
} from '../schemas/usuario.schema';
import { UsuarioServicio } from '../servicios/usuario.servicio';
import { RolServicio } from '../servicios/rol.servicio';
import { Rol } from '../tipos/rol';
import { RootStackParamList } from '../navegacion/RootNavigator';

type RegistroUsuarioRouteProp = RouteProp<
  RootStackParamList,
  'RegistroUsuario'
>;

type RegistroUsuarioNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'RegistroUsuario'
>;

export default function RegistroUsuario() {
  const route = useRoute<RegistroUsuarioRouteProp>();
  const navigation = useNavigation<RegistroUsuarioNavigationProp>();
  const { idEmpresa } = route.params;
  const [cargando, setCargando] = useState(false);
  const [roles, setRoles] = useState<Rol[]>([]);
  const [cargandoRoles, setCargandoRoles] = useState(true);
  const [rolSeleccionado, setRolSeleccionado] = useState<string>('');

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormularioCrearUsuario>({
    resolver: zodResolver(esquemaCrearUsuario),
    defaultValues: {
      identificacion: '',
      nombres: '',
      apellidos: '',
      email: '',
      password: '',
      telefono: '',
      direccion: '',
      role: '',
      empresa: idEmpresa,
    },
  });

  // Cargar roles al montar el componente
  useEffect(() => {
    cargarRoles();
  }, []);

  const cargarRoles = async () => {
    try {
      const rolesObtenidos = await RolServicio.obtenerRoles();
      setRoles(rolesObtenidos);
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Error al cargar roles',
        text2: error.message || 'No se pudieron obtener los roles disponibles',
        position: 'top',
      });
    } finally {
      setCargandoRoles(false);
    }
  };

  const seleccionarRol = (idRol: string) => {
    setRolSeleccionado(idRol);
    setValue('role', idRol);
  };

  const enviarFormulario = async (datos: FormularioCrearUsuario) => {
    setCargando(true);
    try {
      const usuarioCreado = await UsuarioServicio.crearUsuario(datos);

      Toast.show({
        type: 'success',
        text1: '¡Usuario creado exitosamente!',
        text2: `${usuarioCreado.nombres} ${usuarioCreado.apellidos} ha sido registrado`,
        position: 'top',
      });

      // Limpiar formulario
      reset();
      setRolSeleccionado('');

      // TODO: Navegar a la pantalla de login
    } catch (error: any) {
      let mensajeError = 'No se pudo crear el usuario. Intente nuevamente.';

      if (error.message) {
        mensajeError = error.message;
      }

      Toast.show({
        type: 'error',
        text1: 'Error al crear usuario',
        text2: mensajeError,
        position: 'top',
      });
    } finally {
      setCargando(false);
    }
  };

  if (cargandoRoles) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#2563EB" />
        <Text className="text-gray-600 mt-4">Cargando roles...</Text>
      </View>
    );
  }

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
          <View className="mb-6">
            <Text className="text-3xl font-bold text-gray-800 mb-2">
              Registro de Usuario
            </Text>
            <Text className="text-base text-gray-600">
              Complete los datos para crear un nuevo usuario
            </Text>
          </View>

          {/* Formulario */}
          <View className="space-y-4">
            {/* Campo: Identificación */}
            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 mb-2">
                Identificación *
              </Text>
              <Controller
                control={control}
                name="identificacion"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className={`bg-white border ${
                      errors.identificacion
                        ? 'border-red-500'
                        : 'border-gray-300'
                    } rounded-lg px-4 py-3 text-gray-800`}
                    placeholder="Ej: 1234567890"
                    maxLength={10}
                    placeholderTextColor="#9CA3AF"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    editable={!cargando}
                  />
                )}
              />
              {errors.identificacion && (
                <Text className="text-red-500 text-xs mt-1">
                  {errors.identificacion.message}
                </Text>
              )}
            </View>

            {/* Campo: Nombres */}
            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 mb-2">
                Nombres *
              </Text>
              <Controller
                control={control}
                name="nombres"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className={`bg-white border ${
                      errors.nombres ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg px-4 py-3 text-gray-800`}
                    placeholder="Ej: Juan Carlos"
                    placeholderTextColor="#9CA3AF"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    editable={!cargando}
                  />
                )}
              />
              {errors.nombres && (
                <Text className="text-red-500 text-xs mt-1">
                  {errors.nombres.message}
                </Text>
              )}
            </View>

            {/* Campo: Apellidos */}
            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 mb-2">
                Apellidos *
              </Text>
              <Controller
                control={control}
                name="apellidos"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className={`bg-white border ${
                      errors.apellidos ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg px-4 py-3 text-gray-800`}
                    placeholder="Ej: Pérez García"
                    placeholderTextColor="#9CA3AF"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    editable={!cargando}
                  />
                )}
              />
              {errors.apellidos && (
                <Text className="text-red-500 text-xs mt-1">
                  {errors.apellidos.message}
                </Text>
              )}
            </View>

            {/* Campo: Email */}
            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 mb-2">
                Email *
              </Text>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className={`bg-white border ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg px-4 py-3 text-gray-800`}
                    placeholder="ejemplo@correo.com"
                    placeholderTextColor="#9CA3AF"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    editable={!cargando}
                  />
                )}
              />
              {errors.email && (
                <Text className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </Text>
              )}
            </View>

            {/* Campo: Contraseña */}
            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 mb-2">
                Contraseña *
              </Text>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className={`bg-white border ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg px-4 py-3 text-gray-800`}
                    placeholder="Mínimo 6 caracteres"
                    placeholderTextColor="#9CA3AF"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    secureTextEntry
                    editable={!cargando}
                  />
                )}
              />
              {errors.password && (
                <Text className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </Text>
              )}
            </View>

            {/* Campo: Teléfono */}
            <View className="mb-4">
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

            {/* Campo: Dirección */}
            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 mb-2">
                Dirección *
              </Text>
              <Controller
                control={control}
                name="direccion"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className={`bg-white border ${
                      errors.direccion ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg px-4 py-3 text-gray-800`}
                    placeholder="Ej: Av. Don Bosco, Cuenca"
                    placeholderTextColor="#9CA3AF"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    multiline
                    numberOfLines={2}
                    editable={!cargando}
                  />
                )}
              />
              {errors.direccion && (
                <Text className="text-red-500 text-xs mt-1">
                  {errors.direccion.message}
                </Text>
              )}
            </View>

            {/* Campo: Rol (Selector) */}
            <View className="mb-6">
              <Text className="text-sm font-semibold text-gray-700 mb-2">
                Rol *
              </Text>
              <Controller
                control={control}
                name="role"
                render={() => (
                  <View className="flex-row flex-wrap gap-2">
                    {roles.map(rol => (
                      <TouchableOpacity
                        key={rol.idrol}
                        className={`px-4 py-3 rounded-lg border ${
                          rolSeleccionado === rol.idrol
                            ? 'bg-blue-600 border-blue-600'
                            : 'bg-white border-gray-300'
                        }`}
                        onPress={() => seleccionarRol(rol.idrol)}
                        disabled={cargando}
                      >
                        <Text
                          className={`font-medium ${
                            rolSeleccionado === rol.idrol
                              ? 'text-white'
                              : 'text-gray-700'
                          }`}
                        >
                          {rol.nombre}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              />
              {errors.role && (
                <Text className="text-red-500 text-xs mt-1">
                  {errors.role.message}
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
                  Registrar Usuario
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
