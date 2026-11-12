import { Usuario } from '../models/index.js';
import AppError from '../errors/AppError.js';
import { datosPublicos } from './auth.service.js';

const buscarUsuario = async (id) => {
  const usuario = await Usuario.findByPk(id);

  if (!usuario) {
    throw new AppError(404, 'NOT_FOUND', 'El usuario no existe');
  }

  return usuario;
};

export const obtenerPerfil = async (id) => datosPublicos(await buscarUsuario(id));

export const actualizarPerfil = async (id, datos) => {
  const usuario = await buscarUsuario(id);
  await usuario.update(datos);
  return datosPublicos(usuario);
};
