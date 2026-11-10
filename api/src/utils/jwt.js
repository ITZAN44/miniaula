import jwt from 'jsonwebtoken';

export const firmarToken = (usuario) =>
  jwt.sign({ id: usuario.id, rol: usuario.rol }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

export const verificarToken = (token) => jwt.verify(token, process.env.JWT_SECRET);
