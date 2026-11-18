import { Router } from 'express';
import { autenticar, autorizar } from '../middlewares/auth.js';
import { esDuenioCurso } from '../middlewares/esDuenio.js';
import validate from '../middlewares/validate.js';
import { crearCursoSchema, editarCursoSchema, estadoCursoSchema } from '../schemas/curso.schemas.js';
import { crearLeccionSchema, reordenarLeccionesSchema } from '../schemas/leccion.schemas.js';
import * as cursoController from '../controllers/curso.controller.js';
import * as leccionController from '../controllers/leccion.controller.js';

const router = Router();

const soloInstructor = [autenticar, autorizar('instructor')];

router.post('/', ...soloInstructor, validate({ body: crearCursoSchema }), cursoController.crearCurso);
router.put('/:id', ...soloInstructor, esDuenioCurso, validate({ body: editarCursoSchema }), cursoController.actualizarCurso);
router.patch('/:id/estado', ...soloInstructor, esDuenioCurso, validate({ body: estadoCursoSchema }), cursoController.cambiarEstadoCurso);
router.delete('/:id', ...soloInstructor, esDuenioCurso, cursoController.eliminarCurso);
router.post('/:id/lecciones', ...soloInstructor, esDuenioCurso, validate({ body: crearLeccionSchema }), leccionController.crearLeccion);
router.patch('/:id/lecciones/orden', ...soloInstructor, esDuenioCurso, validate({ body: reordenarLeccionesSchema }), leccionController.reordenarLecciones);

export default router;
