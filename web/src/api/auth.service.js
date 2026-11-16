import cliente from './cliente.js';

export const iniciarSesion = (credenciales) =>
  cliente.post('/auth/login', credenciales).then((respuesta) => respuesta.data);

export const registrarse = (datos) =>
  cliente.post('/auth/register', datos).then((respuesta) => respuesta.data);
