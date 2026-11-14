import { Router } from 'express';
import { autenticar, autorizar } from '../middlewares/auth.js';
import { esDuenioPregunta } from '../middlewares/esDuenio.js';
import validate from '../middlewares/validate.js';
import { editarPreguntaSchema } from '../schemas/pregunta.schemas.js';
import * as preguntaController from '../controllers/pregunta.controller.js';

const router = Router();

// Todas las operaciones directas sobre preguntas requieren instructor autenticado
router.use(autenticar, autorizar('instructor'));

// Modificar una pregunta existente (solo instructor dueño del curso)
router.put('/:id', esDuenioPregunta, validate({ body: editarPreguntaSchema }), preguntaController.actualizarPregunta);

// Eliminar una pregunta (solo instructor dueño del curso)
router.delete('/:id', esDuenioPregunta, preguntaController.eliminarPregunta);

export default router;
