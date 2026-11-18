import cliente from './cliente.js';

export const obtenerPerfil = () => cliente.get('/users/me').then((respuesta) => respuesta.data);

export const actualizarPerfil = (datos) => cliente.put('/users/me', datos).then((respuesta) => respuesta.data);
