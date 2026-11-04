import Usuario from './Usuario.js';
import Curso from './Curso.js';
import Leccion from './Leccion.js';
import Pregunta from './Pregunta.js';
import Inscripcion from './Inscripcion.js';
import Progreso from './Progreso.js';

Usuario.hasMany(Curso, { foreignKey: 'instructorId', as: 'cursos' });
Curso.belongsTo(Usuario, { foreignKey: 'instructorId', as: 'instructor' });

Usuario.hasMany(Inscripcion, { foreignKey: 'estudianteId', as: 'inscripciones' });
Inscripcion.belongsTo(Usuario, { foreignKey: 'estudianteId', as: 'estudiante' });

Curso.hasMany(Leccion, { foreignKey: 'cursoId', as: 'lecciones' });
Leccion.belongsTo(Curso, { foreignKey: 'cursoId', as: 'curso' });

Curso.hasMany(Inscripcion, { foreignKey: 'cursoId', as: 'inscripciones' });
Inscripcion.belongsTo(Curso, { foreignKey: 'cursoId', as: 'curso' });

Leccion.hasMany(Pregunta, { foreignKey: 'leccionId', as: 'preguntas' });
Pregunta.belongsTo(Leccion, { foreignKey: 'leccionId', as: 'leccion' });

Inscripcion.hasMany(Progreso, { foreignKey: 'inscripcionId', as: 'progresos' });
Progreso.belongsTo(Inscripcion, { foreignKey: 'inscripcionId', as: 'inscripcion' });

Leccion.hasMany(Progreso, { foreignKey: 'leccionId', as: 'progresos' });
Progreso.belongsTo(Leccion, { foreignKey: 'leccionId', as: 'leccion' });

export { Usuario, Curso, Leccion, Pregunta, Inscripcion, Progreso };
