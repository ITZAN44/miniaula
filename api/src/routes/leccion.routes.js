import { Router } from 'express';
import { autenticar, autorizar } from '../middlewares/auth.js';
import { esDuenioLeccion } from '../middlewares/esDuenio.js';
import validate from '../middlewares/validate.js';
import { editarLeccionSchema } from '../schemas/leccion.schemas.js';
import * as leccionController from '../controllers/leccion.controller.js';

const router = Router();

// Todas las operaciones directas sobre lecciones requieren instructor autenticado
router.use(autenticar, autorizar('instructor'));

// Modificar una leccion existente (solo instructor dueño del curso)
router.put('/:id', esDuenioLeccion, validate({ body: editarLeccionSchema }), leccionController.actualizarLeccion);

// Eliminar una leccion (solo instructor dueño del curso)
router.delete('/:id', esDuenioLeccion, leccionController.eliminarLeccion);

export default router;
