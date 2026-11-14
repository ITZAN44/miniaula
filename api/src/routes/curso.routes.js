import { Router } from 'express';
import { autenticar, autorizar } from '../middlewares/auth.js';
import { esDuenioCurso } from '../middlewares/esDuenio.js';
import validate from '../middlewares/validate.js';
import { crearCursoSchema, editarCursoSchema, estadoCursoSchema } from '../schemas/curso.schemas.js';
import { crearLeccionSchema, reordenarLeccionesSchema } from '../schemas/leccion.schemas.js';
import * as cursoController from '../controllers/curso.controller.js';
import * as leccionController from '../controllers/leccion.controller.js';

const router = Router();

// Todas las operaciones de administracion de cursos requieren estar autenticado como instructor
router.use(autenticar, autorizar('instructor'));

// Crear un nuevo curso en borrador
router.post('/', validate({ body: crearCursoSchema }), cursoController.crearCurso);

// Modificar datos del curso (solo el instructor dueño)
router.put('/:id', esDuenioCurso, validate({ body: editarCursoSchema }), cursoController.actualizarCurso);

// Cambiar el estado a publicado o archivado (solo el instructor dueño)
router.patch('/:id/estado', esDuenioCurso, validate({ body: estadoCursoSchema }), cursoController.cambiarEstadoCurso);

// Eliminar curso si no tiene inscritos (solo el instructor dueño)
router.delete('/:id', esDuenioCurso, cursoController.eliminarCurso);

// Agregar una nueva leccion al curso (solo el instructor dueño)
router.post('/:id/lecciones', esDuenioCurso, validate({ body: crearLeccionSchema }), leccionController.crearLeccion);

// Reordenar las lecciones del curso (solo el instructor dueño)
router.patch('/:id/lecciones/orden', esDuenioCurso, validate({ body: reordenarLeccionesSchema }), leccionController.reordenarLecciones);

export default router;

