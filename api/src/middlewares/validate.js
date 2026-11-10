import { z } from 'zod';
import AppError from '../errors/AppError.js';

z.config(z.locales.es());

const PARTES = ['body', 'params', 'query'];

const validate = (esquemas) => (req, res, next) => {
  for (const parte of PARTES) {
    if (!esquemas[parte]) {
      continue;
    }
    const resultado = esquemas[parte].safeParse(req[parte]);
    if (!resultado.success) {
      const details = resultado.error.issues.map((issue) => ({
        campo: `${parte}.${issue.path.join('.')}`,
        mensaje: issue.message,
      }));
      return next(new AppError(400, 'VALIDATION_ERROR', 'Los datos enviados no son válidos', details));
    }
    // En Express 5 req.query es de solo lectura, por eso se redefine
    Object.defineProperty(req, parte, { value: resultado.data, writable: true });
  }
  next();
};

export default validate;
