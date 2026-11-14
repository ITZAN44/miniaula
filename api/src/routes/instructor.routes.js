import { Router } from 'express';
import { autenticar, autorizar } from '../middlewares/auth.js';
import * as cursoController from '../controllers/curso.controller.js';

const router = Router();

// Todas las rutas de instructor requieren sesion activa y rol instructor
router.use(autenticar, autorizar('instructor'));

// Listado de cursos propios creados por el instructor
router.get('/cursos', cursoController.listarCursosInstructor);

export default router;
