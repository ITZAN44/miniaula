import { Router } from 'express';
import { autenticar, autorizar } from '../middlewares/auth.js';
import * as cursoController from '../controllers/curso.controller.js';

const router = Router();

const soloInstructor = [autenticar, autorizar('instructor')];

router.get('/cursos', ...soloInstructor, cursoController.listarCursosInstructor);

export default router;
