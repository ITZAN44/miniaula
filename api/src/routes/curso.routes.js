import { Router } from 'express';
import { autenticar, autorizar } from '../middlewares/auth.js';
import { esDuenioCurso } from '../middlewares/esDuenio.js';
import validate from '../middlewares/validate.js';
import { crearCursoSchema, editarCursoSchema, estadoCursoSchema } from '../schemas/curso.schemas.js';
import { crearLeccionSchema, reordenarLeccionesSchema } from '../schemas/leccion.schemas.js';
import * as cursoController from '../controllers/curso.controller.js';
import * as leccionController from '../controllers/leccion.controller.js';
import { catalogoQuerySchema } from '../schemas/catalogo.schemas.js';
import { idParamSchema } from '../schemas/comun.schemas.js';
import * as catalogoController from '../controllers/catalogo.controller.js';
import * as inscripcionController from '../controllers/inscripcion.controller.js';
import * as progresoController from '../controllers/progreso.controller.js';
import { inscritoEnCurso } from '../middlewares/estaInscrito.js';

const router = Router();

const soloInstructor = [autenticar, autorizar('instructor')];
const soloEstudiante = [autenticar, autorizar('estudiante')];

router.get('/', validate({ query: catalogoQuerySchema }), catalogoController.listarCatalogo);
router.get('/categorias', catalogoController.listarCategorias);
router.get('/:id', validate({ params: idParamSchema }), catalogoController.obtenerDetalle);
router.post('/:id/inscripcion', ...soloEstudiante, validate({ params: idParamSchema }), inscripcionController.inscribir);
router.get('/:id/progreso', ...soloEstudiante, validate({ params: idParamSchema }), inscritoEnCurso, progresoController.obtenerProgreso);

router.post('/', ...soloInstructor, validate({ body: crearCursoSchema }), cursoController.crearCurso);
router.put('/:id', ...soloInstructor, esDuenioCurso, validate({ body: editarCursoSchema }), cursoController.actualizarCurso);
router.patch('/:id/estado', ...soloInstructor, esDuenioCurso, validate({ body: estadoCursoSchema }), cursoController.cambiarEstadoCurso);
router.delete('/:id', ...soloInstructor, esDuenioCurso, cursoController.eliminarCurso);
router.post('/:id/lecciones', ...soloInstructor, esDuenioCurso, validate({ body: crearLeccionSchema }), leccionController.crearLeccion);
router.patch('/:id/lecciones/orden', ...soloInstructor, esDuenioCurso, validate({ body: reordenarLeccionesSchema }), leccionController.reordenarLecciones);

export default router;
