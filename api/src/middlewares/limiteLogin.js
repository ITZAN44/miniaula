import rateLimit from 'express-rate-limit';
import AppError from '../errors/AppError.js';

const limiteLogin = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  skipSuccessfulRequests: true,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  handler: (req, res, next) => {
    next(new AppError(429, 'TOO_MANY_REQUESTS', 'Demasiados intentos fallidos, intenta de nuevo en unos minutos'));
  },
});

export default limiteLogin;
