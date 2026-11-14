import * as usuarioService from '../services/usuario.service.js';

export const obtenerPerfil = async (req, res) => {
  const usuario = await usuarioService.obtenerPerfil(req.usuario.id);
  res.json(usuario);
};

export const actualizarPerfil = async (req, res) => {
  const usuario = await usuarioService.actualizarPerfil(req.usuario.id, req.body);
  res.json(usuario);
};
