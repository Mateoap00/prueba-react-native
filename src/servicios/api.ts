import axios from 'axios';

// URL base del API
export const API_BASE_URL = 'http://167.172.19.104:3003/api';

// Instancia de axios configurada
export const apiCliente = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 segundos
});

// Interceptor para agregar token de autenticación si existe
apiCliente.interceptors.request.use(
  async (config) => {
    // TODO: Obtener token de AsyncStorage cuando implementemos autenticación
    // const token = await AsyncStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores globalmente
apiCliente.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Manejo de errores global
    if (error.response) {
      // El servidor respondió con un código de estado fuera del rango 2xx
      console.error('Error de respuesta:', error.response.data);
      console.error('Estado:', error.response.status);
    } else if (error.request) {
      // La petición fue hecha pero no hubo respuesta
      console.error('Error de red:', error.request);
    } else {
      // Algo sucedió al configurar la petición
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);
