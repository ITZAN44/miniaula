import AppError from '../errors/AppError.js';
import { verificarToken } from '../utils/jwt.js';

export const autenticar = (req, res, next) => {
  const [tipo, token] = (req.headers.authorization || '').split(' ');

  if (tipo !== 'Bearer' || !token) {
    throw new AppError(401, 'UNAUTHORIZED', 'Debes iniciar sesión');
  }

  try {
    const { id, rol } = verificarToken(token);
    req.usuario = { id, rol };
  } catch {
    throw new AppError(401, 'UNAUTHORIZED', 'La sesión no es válida o expiró');
  }

  next();
};

export const autorizar = (...roles) => (req, res, next) => {
  if (!roles.includes(req.usuario.rol)) {
    throw new AppError(403, 'FORBIDDEN', 'No tienes permiso para realizar esta acción');
  }

  next();
};
