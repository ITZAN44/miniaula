import { useCallback, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router';
import useAuth from '../../hooks/useAuth.js';
import useFetch from '../../hooks/useFetch.js';
import { obtenerCurso, inscribirse, listarMisInscripciones } from '../../api/estudiante.service.js';
import { mensajeDeError } from '../../api/errores.js';
import { NIVELES, contarLecciones } from './formato.js';
import Boton from '../../components/Boton.jsx';
import Alerta from '../../components/Alerta.jsx';
import Cargando from '../../components/Cargando.jsx';

const estiloEnlace = 'inline-block rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700';

const BotonInscripcion = ({ cursoId }) => {
  const navigate = useNavigate();
  const { datos: inscripciones, cargando } = useFetch(listarMisInscripciones);
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  if (cargando) {
    return null;
  }

  if (inscripciones?.some((inscripcion) => inscripcion.cursoId === cursoId)) {
    return (
      <Link to={`/aprender/${cursoId}`} className={estiloEnlace}>
        Continuar el curso
      </Link>
    );
  }

  const inscribir = async () => {
    setError('');
    setEnviando(true);
    try {
      await inscribirse(cursoId);
      navigate(`/aprender/${cursoId}`);
    } catch (err) {
      setError(mensajeDeError(err));
      setEnviando(false);
    }
  };

  return (
    <div className="space-y-3">
      {error && <Alerta>{error}</Alerta>}
      <Boton onClick={inscribir} disabled={enviando}>
        {enviando ? 'Inscribiendo...' : 'Inscribirme'}
      </Boton>
    </div>
  );
};

const AccionCurso = ({ cursoId }) => {
  const { usuario } = useAuth();
  const location = useLocation();

  if (!usuario) {
    return (
      <Link to="/login" state={{ desde: location.pathname }} className={estiloEnlace}>
        Inicia sesión para inscribirte
      </Link>
    );
  }

  if (usuario.rol !== 'estudiante') {
    return <p className="text-sm text-slate-500">Solo los estudiantes pueden inscribirse en los cursos.</p>;
  }

  return <BotonInscripcion cursoId={cursoId} />;
};

const DetalleCurso = () => {
  const { id } = useParams();
  const cargar = useCallback(() => obtenerCurso(id), [id]);
  const { datos: curso, cargando, error } = useFetch(cargar);

  if (cargando) return <Cargando />;
  if (error) return <Alerta>{error}</Alerta>;

  return (
    <div className="space-y-6">
      <Link to="/cursos" className="text-sm text-indigo-600 hover:underline">
        ← Volver al catálogo
      </Link>

      <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <span className="text-xs font-medium uppercase tracking-wide text-indigo-600">{curso.categoria}</span>
        <h1 className="text-2xl font-semibold text-slate-900">{curso.titulo}</h1>
        <p className="text-sm text-slate-600">
          {curso.instructor.nombre} · Nivel {NIVELES[curso.nivel].toLowerCase()} · {contarLecciones(curso.lecciones.length)}
        </p>
        <p className="text-slate-700">{curso.descripcion}</p>
        <div className="pt-2">
          <AccionCurso cursoId={curso.id} />
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Temario</h2>
        {curso.lecciones.length === 0 ? (
          <p className="text-sm text-slate-500">Este curso todavía no tiene lecciones.</p>
        ) : (
          <ol className="divide-y divide-slate-200">
            {curso.lecciones.map((leccion, indice) => (
              <li key={leccion.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                <span className="text-slate-900">
                  {indice + 1}. {leccion.titulo}
                </span>
                {leccion.tipo === 'cuestionario' && (
                  <span className="shrink-0 rounded bg-amber-50 px-2 py-0.5 text-xs text-amber-700">Cuestionario</span>
                )}
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  );
};

export default DetalleCurso;
