import { Router } from 'express';
import { autenticar, autorizar } from '../middlewares/auth.js';
import { esDuenioLeccion } from '../middlewares/esDuenio.js';
import validate from '../middlewares/validate.js';
import { editarLeccionSchema } from '../schemas/leccion.schemas.js';
import { crearPreguntaSchema } from '../schemas/pregunta.schemas.js';
import * as leccionController from '../controllers/leccion.controller.js';
import * as preguntaController from '../controllers/pregunta.controller.js';
import { idParamSchema } from '../schemas/comun.schemas.js';
import { inscritoEnLeccion } from '../middlewares/estaInscrito.js';
import * as progresoController from '../controllers/progreso.controller.js';

const router = Router();

const soloInstructor = [autenticar, autorizar('instructor')];
const estudianteInscrito = [autenticar, autorizar('estudiante'), validate({ params: idParamSchema }), inscritoEnLeccion];

router.get('/:id', ...estudianteInscrito, progresoController.obtenerLeccion);
router.post('/:id/completar', ...estudianteInscrito, progresoController.completarLeccion);

router.put('/:id', ...soloInstructor, esDuenioLeccion, validate({ body: editarLeccionSchema }), leccionController.actualizarLeccion);
router.delete('/:id', ...soloInstructor, esDuenioLeccion, leccionController.eliminarLeccion);
router.get('/:id/preguntas', ...soloInstructor, esDuenioLeccion, preguntaController.listarPreguntasDeLeccion);
router.post('/:id/preguntas', ...soloInstructor, esDuenioLeccion, validate({ body: crearPreguntaSchema }), preguntaController.crearPregunta);

export default router;
