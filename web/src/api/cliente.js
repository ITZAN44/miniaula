import axios from 'axios';
import { obtenerSesion, borrarSesion } from './sesion.js';

const cliente = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

cliente.interceptors.request.use((config) => {
  const sesion = obtenerSesion();
  if (sesion) {
    config.headers.Authorization = `Bearer ${sesion.token}`;
  }
  return config;
});

cliente.interceptors.response.use(
  (respuesta) => respuesta,
  (error) => {
    // Si el token venció o no es válido se cierra la sesión
    if (error.response?.status === 401 && obtenerSesion()) {
      borrarSesion();
      window.location.assign('/login');
    }
    return Promise.reject(error);
  },
);

export default cliente;
