import { Router } from 'express';
import { autenticar, autorizar } from '../middlewares/auth.js';
import { esDuenioLeccion } from '../middlewares/esDuenio.js';
import validate from '../middlewares/validate.js';
import { editarLeccionSchema } from '../schemas/leccion.schemas.js';
import { crearPreguntaSchema } from '../schemas/pregunta.schemas.js';
import * as leccionController from '../controllers/leccion.controller.js';
import * as preguntaController from '../controllers/pregunta.controller.js';

const router = Router();

// Todas las operaciones directas sobre lecciones requieren instructor autenticado
router.use(autenticar, autorizar('instructor'));

// Modificar una leccion existente (solo instructor dueño del curso)
router.put('/:id', esDuenioLeccion, validate({ body: editarLeccionSchema }), leccionController.actualizarLeccion);

// Eliminar una leccion (solo instructor dueño del curso)
router.delete('/:id', esDuenioLeccion, leccionController.eliminarLeccion);

// Listar preguntas de un cuestionario (solo instructor dueño del curso)
router.get('/:id/preguntas', esDuenioLeccion, preguntaController.listarPreguntasDeLeccion);

// Crear una pregunta en un cuestionario (solo instructor dueño del curso)
router.post('/:id/preguntas', esDuenioLeccion, validate({ body: crearPreguntaSchema }), preguntaController.crearPregunta);

export default router;
