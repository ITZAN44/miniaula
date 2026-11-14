import { Router } from 'express';
import { autenticar, autorizar } from '../middlewares/auth.js';
import { esDuenioPregunta } from '../middlewares/esDuenio.js';
import validate from '../middlewares/validate.js';
import { editarPreguntaSchema } from '../schemas/pregunta.schemas.js';
import * as preguntaController from '../controllers/pregunta.controller.js';

const router = Router();

const soloInstructor = [autenticar, autorizar('instructor')];

router.put('/:id', ...soloInstructor, esDuenioPregunta, validate({ body: editarPreguntaSchema }), preguntaController.actualizarPregunta);
router.delete('/:id', ...soloInstructor, esDuenioPregunta, preguntaController.eliminarPregunta);

export default router;
