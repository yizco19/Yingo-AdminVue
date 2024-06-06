import axios from 'axios';
import { ElMessage } from 'element-plus';
import { useTokenStore } from '@/store/token';
import router from '@/router';

const baseURL = '/api';
const instance = axios.create({ baseURL });

// Interceptor de solicitud
instance.interceptors.request.use(
  (config) => {
    const token = useTokenStore().token;
    config.headers.set("ngrok-skip-browser-warning", true);
    if (token) {
      config.headers.Authorization = token;

    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de respuesta
instance.interceptors.response.use(
  (response) => {
    if (response.data.code === 0) {
      return response.data;
    }
    ElMessage.error(response.data.message || 'Error de servicio');
    return Promise.reject(response.data);
  },
  (error) => {

    if (error.response.status === 401) {
      ElMessage.error('¡Por favor inicia sesión primero!');
      router.push('/login');
    } else {
      ElMessage.error('Error de servicio');
    }
    return Promise.reject(error);
  }
);

export default instance;