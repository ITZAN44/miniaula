import { Op } from 'sequelize';
import sequelize from '../config/sequelize.js';
import { Curso, Leccion, Usuario } from '../models/index.js';
import AppError from '../errors/AppError.js';

const instructor = { model: Usuario, as: 'instructor', attributes: ['id', 'nombre'] };

const cantidadLecciones = [
  sequelize.literal('(SELECT COUNT(*) FROM lecciones WHERE lecciones.cursoId = Curso.id)'),
  'cantidadLecciones',
];

export const listarCatalogo = async ({ q, categoria, page, limit }) => {
  const where = { estado: 'publicado' };
  if (q) {
    where.titulo = { [Op.like]: `%${q}%` };
  }
  if (categoria) {
    where.categoria = categoria;
  }

  const { count, rows } = await Curso.findAndCountAll({
    where,
    attributes: { include: [cantidadLecciones] },
    include: [instructor],
    // El id desempata los cursos creados en el mismo segundo para que la paginación no repita ninguno
    order: [
      ['creadoEn', 'DESC'],
      ['id', 'DESC'],
    ],
    limit,
    offset: (page - 1) * limit,
  });

  return {
    cursos: rows,
    paginacion: { page, limit, total: count, totalPaginas: Math.ceil(count / limit) },
  };
};

export const listarCategorias = async () => {
  const filas = await Curso.findAll({
    where: { estado: 'publicado' },
    attributes: [[sequelize.fn('DISTINCT', sequelize.col('categoria')), 'categoria']],
    order: [['categoria', 'ASC']],
    raw: true,
  });

  return filas.map((fila) => fila.categoria);
};

export const obtenerDetalle = async (id) => {
  const curso = await Curso.findOne({
    where: { id, estado: 'publicado' },
    include: [instructor, { model: Leccion, as: 'lecciones', attributes: ['id', 'titulo', 'tipo', 'orden'] }],
    order: [[{ model: Leccion, as: 'lecciones' }, 'orden', 'ASC']],
  });

  if (!curso) {
    throw new AppError(404, 'NOT_FOUND', 'El curso no existe o no está publicado');
  }

  return curso;
};
