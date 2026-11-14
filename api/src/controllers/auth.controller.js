import * as authService from '../services/auth.service.js';

export const registrar = async (req, res) => {
  const usuario = await authService.registrar(req.body);
  res.status(201).json(usuario);
};

export const iniciarSesion = async (req, res) => {
  const sesion = await authService.iniciarSesion(req.body);
  res.json(sesion);
};
