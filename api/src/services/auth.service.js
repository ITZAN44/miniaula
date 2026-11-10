import bcrypt from 'bcryptjs';
import { Usuario } from '../models/index.js';
import AppError from '../errors/AppError.js';
import { firmarToken } from '../utils/jwt.js';

const COSTO_BCRYPT = 10;

export const datosPublicos = (usuario) => ({
  id: usuario.id,
  nombre: usuario.nombre,
  email: usuario.email,
  rol: usuario.rol,
});

export const registrar = async ({ nombre, email, password, rol }) => {
  const passwordHash = await bcrypt.hash(password, COSTO_BCRYPT);
  const usuario = await Usuario.create({ nombre, email, passwordHash, rol });
  return datosPublicos(usuario);
};

export const iniciarSesion = async ({ email, password }) => {
  const usuario = await Usuario.scope('conPassword').findOne({ where: { email } });
  const passwordValida = usuario && (await bcrypt.compare(password, usuario.passwordHash));
  if (!passwordValida) {
    throw new AppError(401, 'UNAUTHORIZED', 'Email o contraseña incorrectos');
  }
  return { token: firmarToken(usuario), usuario: datosPublicos(usuario) };
};
