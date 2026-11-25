import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import { readFileSync } from 'node:fs';
import { parse } from 'yaml';
import swaggerUi from 'swagger-ui-express';
import healthRoutes from './routes/health.routes.js';
import authRoutes from './routes/auth.routes.js';
import usuarioRoutes from './routes/usuario.routes.js';
import cursoRoutes from './routes/curso.routes.js';
import leccionRoutes from './routes/leccion.routes.js';
import preguntaRoutes from './routes/pregunta.routes.js';
import instructorRoutes from './routes/instructor.routes.js';
import inscripcionRoutes from './routes/inscripcion.routes.js';
import { rutaNoEncontrada, manejarErrores } from './middlewares/errorHandler.js';

const documentacion = parse(readFileSync(new URL('./docs/openapi.yaml', import.meta.url), 'utf8'));

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(documentacion));
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', usuarioRoutes);
app.use('/api/cursos', cursoRoutes);
app.use('/api/lecciones', leccionRoutes);
app.use('/api/preguntas', preguntaRoutes);
app.use('/api/instructor', instructorRoutes);
app.use('/api/inscripciones', inscripcionRoutes);

app.use(rutaNoEncontrada);
app.use(manejarErrores);

export default app;
