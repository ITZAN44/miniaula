import * as authService from '../services/auth.service.js';

export const registrar = async (req, res) => {
  const usuario = await authService.registrar(req.body);
  res.status(201).json(usuario);
};
