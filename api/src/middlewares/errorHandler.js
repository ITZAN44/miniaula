import { UniqueConstraintError } from 'sequelize';
import AppError from '../errors/AppError.js';

export const rutaNoEncontrada = (req, res, next) => {
  next(new AppError(404, 'NOT_FOUND', 'La ruta solicitada no existe'));
};

const normalizarError = (err) => {
  if (err instanceof AppError) {
    return err;
  }
  if (err instanceof UniqueConstraintError) {
    return new AppError(409, 'CONFLICT', 'El registro ya existe');
  }
  if (err.type === 'entity.parse.failed') {
    return new AppError(400, 'BAD_REQUEST', 'El cuerpo de la petición no es un JSON válido');
  }
  console.error(err);
  return new AppError(500, 'INTERNAL_ERROR', 'Error interno del servidor');
};

export const manejarErrores = (err, req, res, next) => {
  const error = normalizarError(err);
  res.status(error.status).json({
    error: {
      code: error.code,
      message: error.message,
      details: error.details,
    },
  });
};
