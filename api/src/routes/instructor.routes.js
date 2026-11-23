import { Router } from 'express';
import { autenticar, autorizar } from '../middlewares/auth.js';
import { esDuenioCurso } from '../middlewares/esDuenio.js';
import validate from '../middlewares/validate.js';
import { idParamSchema } from '../schemas/comun.schemas.js';
import * as cursoController from '../controllers/curso.controller.js';

const router = Router();

const soloInstructor = [autenticar, autorizar('instructor')];

router.get('/cursos', ...soloInstructor, cursoController.listarCursosInstructor);
router.get(
  '/cursos/:id/resumen',
  ...soloInstructor,
  validate({ params: idParamSchema }),
  esDuenioCurso,
  cursoController.obtenerResumenCurso,
);

export default router;
