import { useCallback, useState } from 'react';
import { Link } from 'react-router';
import useFetch from '../../hooks/useFetch.js';
import { obtenerLeccion, completarLeccion } from '../../api/estudiante.service.js';
import { mensajeDeError } from '../../api/errores.js';
import Boton from '../../components/Boton.jsx';
import Alerta from '../../components/Alerta.jsx';
import Cargando from '../../components/Cargando.jsx';
import Cuestionario from './Cuestionario.jsx';

// Convierte un enlace de YouTube en la dirección que se puede incrustar; otros enlaces se muestran como link
const urlParaIncrustar = (url) => {
  try {
    const { hostname, pathname, searchParams } = new URL(url);
    const id = hostname === 'youtu.be' ? pathname.slice(1) : hostname.endsWith('youtube.com') ? searchParams.get('v') : null;
    return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
  } catch {
    return null;
  }
};

const Video = ({ url }) => {
  const incrustado = urlParaIncrustar(url);

  if (!incrustado) {
    return (
      <a href={url} target="_blank" rel="noreferrer" className="text-sm font-medium text-indigo-600 hover:underline">
        Ver el video de la lección
      </a>
    );
  }

  return (
    <div className="aspect-video overflow-hidden rounded-lg bg-slate-100">
      <iframe
        src={incrustado}
        title="Video de la lección"
        className="h-full w-full"
        allow="accelerometer; encrypted-media; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};

const LeccionContenido = ({ leccion, alCompletar }) => {
  const [completada, setCompletada] = useState(leccion.completada);
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  const completar = async () => {
    setError('');
    setEnviando(true);
    try {
      await completarLeccion(leccion.id);
      setCompletada(true);
      await alCompletar();
    } catch (err) {
      setError(mensajeDeError(err));
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="space-y-5">
      {leccion.videoUrl && <Video url={leccion.videoUrl} />}
      {leccion.contenido && <p className="whitespace-pre-line text-slate-700">{leccion.contenido}</p>}
      {error && <Alerta>{error}</Alerta>}
      {completada ? (
        <p className="text-sm font-medium text-green-700">✓ Lección completada</p>
      ) : (
        <Boton onClick={completar} disabled={enviando}>
          {enviando ? 'Guardando...' : 'Marcar como completada'}
        </Boton>
      )}
    </div>
  );
};

const ContenidoLeccion = ({ leccionId, cursoId, anterior, siguiente, alCompletar }) => {
  const cargar = useCallback(() => obtenerLeccion(leccionId), [leccionId]);
  const { datos: leccion, cargando, error } = useFetch(cargar);

  if (cargando) return <Cargando />;

  const enlace = (leccionVecina, texto) =>
    leccionVecina && !leccionVecina.bloqueada ? (
      <Link
        to={`/aprender/${cursoId}/${leccionVecina.id}`}
        className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
      >
        {texto}
      </Link>
    ) : (
      <span />
    );

  return (
    <section className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      {error ? (
        <div className="space-y-3">
          <Alerta>{error}</Alerta>
          <Link to={`/aprender/${cursoId}`} className="inline-block text-sm font-medium text-indigo-600 hover:underline">
            Ir a la lección pendiente
          </Link>
        </div>
      ) : (
        <>
          <h1 className="text-xl font-semibold text-slate-900">
            {leccion.orden}. {leccion.titulo}
          </h1>
          {leccion.tipo === 'contenido' ? (
            <LeccionContenido leccion={leccion} alCompletar={alCompletar} />
          ) : (
            <Cuestionario leccion={leccion} alResponder={alCompletar} />
          )}
        </>
      )}
      <div className="flex justify-between gap-2 border-t border-slate-200 pt-4">
        {enlace(anterior, '‹ Anterior')}
        {enlace(siguiente, 'Siguiente ›')}
      </div>
    </section>
  );
};

export default ContenidoLeccion;
