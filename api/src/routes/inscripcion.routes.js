import { Router } from 'express';
import { autenticar, autorizar } from '../middlewares/auth.js';
import * as inscripcionController from '../controllers/inscripcion.controller.js';

const router = Router();

router.get('/mias', autenticar, autorizar('estudiante'), inscripcionController.listarMisInscripciones);

export default router;
