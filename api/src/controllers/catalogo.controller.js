import * as catalogoService from '../services/catalogo.service.js';

export const listarCatalogo = async (req, res) => {
  const resultado = await catalogoService.listarCatalogo(req.query);
  res.json(resultado);
};

export const listarCategorias = async (req, res) => {
  const categorias = await catalogoService.listarCategorias();
  res.json(categorias);
};

export const obtenerDetalle = async (req, res) => {
  const curso = await catalogoService.obtenerDetalle(req.params.id);
  res.json(curso);
};
