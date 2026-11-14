import { Router } from 'express';
import { autenticar, autorizar } from '../middlewares/auth.js';
import { esDuenioLeccion } from '../middlewares/esDuenio.js';
import validate from '../middlewares/validate.js';
import { editarLeccionSchema } from '../schemas/leccion.schemas.js';
import { crearPreguntaSchema } from '../schemas/pregunta.schemas.js';
import * as leccionController from '../controllers/leccion.controller.js';
import * as preguntaController from '../controllers/pregunta.controller.js';

const router = Router();

const soloInstructor = [autenticar, autorizar('instructor')];

router.put('/:id', ...soloInstructor, esDuenioLeccion, validate({ body: editarLeccionSchema }), leccionController.actualizarLeccion);
router.delete('/:id', ...soloInstructor, esDuenioLeccion, leccionController.eliminarLeccion);
router.get('/:id/preguntas', ...soloInstructor, esDuenioLeccion, preguntaController.listarPreguntasDeLeccion);
router.post('/:id/preguntas', ...soloInstructor, esDuenioLeccion, validate({ body: crearPreguntaSchema }), preguntaController.crearPregunta);

export default router;
