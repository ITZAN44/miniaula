import { Router } from 'express';
import validate from '../middlewares/validate.js';
import { autenticar } from '../middlewares/auth.js';
import { perfilSchema } from '../schemas/usuario.schemas.js';
import * as usuarioController from '../controllers/usuario.controller.js';

const router = Router();

router.use(autenticar);

router.get('/me', usuarioController.obtenerPerfil);
router.put('/me', validate({ body: perfilSchema }), usuarioController.actualizarPerfil);

export default router;
