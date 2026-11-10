import bcrypt from 'bcryptjs';
import { Usuario } from '../models/index.js';

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
