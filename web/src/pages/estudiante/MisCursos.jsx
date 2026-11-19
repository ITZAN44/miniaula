import { Link } from 'react-router';
import useFetch from '../../hooks/useFetch.js';
import { listarMisInscripciones } from '../../api/estudiante.service.js';
import Alerta from '../../components/Alerta.jsx';
import Cargando from '../../components/Cargando.jsx';
import BarraProgreso from '../../components/BarraProgreso.jsx';

const textoBoton = (porcentaje) => {
  if (porcentaje === 0) return 'Empezar';
  return porcentaje === 100 ? 'Repasar' : 'Continuar';
};

const FilaCurso = ({ inscripcion }) => {
  const { curso, completadas, total, porcentaje } = inscripcion;

  return (
    <article className="grid gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-[1fr_14rem_auto] sm:items-center">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="font-semibold text-slate-900">{curso.titulo}</h2>
          {curso.estado === 'archivado' && (
            <span className="rounded-full border border-slate-300 px-2 py-0.5 text-xs text-slate-600">Archivado</span>
          )}
        </div>
        <p className="text-sm text-slate-600">
          {curso.instructor.nombre} · {curso.categoria}
        </p>
      </div>
      <div className="space-y-1.5">
        <p className="text-sm text-slate-600">
          {completadas} de {total} lecciones · {porcentaje} %
        </p>
        <BarraProgreso porcentaje={porcentaje} />
      </div>
      <Link
        to={`/aprender/${curso.id}`}
        className="rounded-lg border border-indigo-600 px-4 py-2 text-center text-sm font-medium text-indigo-700 hover:bg-indigo-50"
      >
        {textoBoton(porcentaje)}
      </Link>
    </article>
  );
};

const MisCursos = () => {
  const { datos: inscripciones, cargando, error } = useFetch(listarMisInscripciones);

  if (cargando) return <Cargando />;
  if (error) return <Alerta>{error}</Alerta>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Mis cursos</h1>
        <p className="text-sm text-slate-600">
          {inscripciones.length === 1 ? '1 curso inscrito' : `${inscripciones.length} cursos inscritos`}
        </p>
      </div>

      {inscripciones.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-600">
          <p>Todavía no te inscribiste en ningún curso.</p>
          <Link to="/cursos" className="mt-3 inline-block font-medium text-indigo-600 hover:underline">
            Ver el catálogo
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {inscripciones.map((inscripcion) => (
            <FilaCurso key={inscripcion.id} inscripcion={inscripcion} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MisCursos;
