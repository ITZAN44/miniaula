import { Router } from 'express';
import validate from '../middlewares/validate.js';
import { registroSchema, loginSchema } from '../schemas/auth.schemas.js';
import * as authController from '../controllers/auth.controller.js';

const router = Router();

router.post('/register', validate({ body: registroSchema }), authController.registrar);
router.post('/login', validate({ body: loginSchema }), authController.iniciarSesion);

export default router;
