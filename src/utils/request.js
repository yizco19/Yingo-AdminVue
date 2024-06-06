// Definir una instancia personalizada para las solicitudes

// Importar axios (npm install axios)
import axios from 'axios';


import { ElMessage } from 'element-plus';
// Definir una variable para almacenar el prefijo común, baseURL
const baseURL = '/api';
// Crear una instancia de axios con la baseURL definida
const instance = axios.create({baseURL});
import { useTokenStore } from '@/store/token'
// Agregar un interceptor de petición
instance.interceptors.request.use(
    (config) => {
        // Agregar el token de acceso
        const token = useTokenStore().token;
        if (token) {
            config.headers.Authorization = token
        }
        return config;
    },
    (error) => {
        // Manejar errores de petición
        return Promise.reject(error);
    }
    
)
import router from '@/router'

// Agregar interceptor de respuesta
instance.interceptors.response.use(
    result => {
        // Si el código de estado de negocio es 0, significa que la operación se realizó con éxito
        if (result.data.code == 0) {
            return result.data;
        }
        // Si el código de estado no es 0, significa que la operación falló
        ElMessage.error(result.data.message || 'Error de servicio');
        return Promise.reject(result.data); // Convertir el estado asíncrono en un estado de fallo
    },
    err => {
        // Si el código de estado de respuesta es 401, significa que no se ha iniciado sesión, mostrar un mensaje correspondiente y redirigir a la página de inicio de sesión
        if (err.response.status === 401) {
            ElMessage.error('¡Por favor inicia sesión primero!');
            router.push('/login');
        } else {
            ElMessage.error('Error de servicio');
        }
        return Promise.reject(err); // Convertir el estado asíncrono en un estado de fallo
    }
)


export default instance;
