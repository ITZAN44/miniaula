import { useCallback, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import useFetch from '../../hooks/useFetch.js';
import { listarCatalogo, listarCategorias } from '../../api/estudiante.service.js';
import { NIVELES } from './niveles.js';
import Boton from '../../components/Boton.jsx';
import Alerta from '../../components/Alerta.jsx';
import Cargando from '../../components/Cargando.jsx';
import Paginacion from '../../components/Paginacion.jsx';

const estiloFiltro = (activo) =>
  `rounded-full border px-4 py-1.5 text-sm ${
    activo ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-300 text-slate-700 hover:bg-slate-100'
  }`;

const TarjetaCurso = ({ curso }) => {
  return (
    <article className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <span className="text-xs font-medium uppercase tracking-wide text-indigo-600">{curso.categoria}</span>
      <h2 className="mt-1 font-semibold text-slate-900">{curso.titulo}</h2>
      <p className="mt-1 text-sm text-slate-600">
        {curso.instructor.nombre} · {curso.cantidadLecciones} {curso.cantidadLecciones === 1 ? 'lección' : 'lecciones'}
      </p>
      <p className="mt-3 line-clamp-2 flex-1 text-sm text-slate-600">{curso.descripcion}</p>
      <div className="mt-4 flex items-center justify-between gap-2">
        <span className="rounded-full border border-slate-300 px-3 py-0.5 text-xs text-slate-600">{NIVELES[curso.nivel]}</span>
        <Link
          to={`/cursos/${curso.id}`}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Ver curso
        </Link>
      </div>
    </article>
  );
};

const Catalogo = () => {
  const [parametros, setParametros] = useSearchParams();
  const q = parametros.get('q') ?? '';
  const categoria = parametros.get('categoria') ?? '';
  const pagina = Number(parametros.get('page')) || 1;
  const [busqueda, setBusqueda] = useState(q);

  const cargar = useCallback(
    () => listarCatalogo({ q: q || undefined, categoria: categoria || undefined, page: pagina }),
    [q, categoria, pagina],
  );
  const { datos, cargando, error } = useFetch(cargar);
  const { datos: categorias } = useFetch(listarCategorias);

  // Al cambiar la búsqueda o la categoría se vuelve a la primera página
  const filtrar = (cambios) => {
    const filtros = { q, categoria, ...cambios };
    setParametros(Object.fromEntries(Object.entries(filtros).filter(([, valor]) => valor)));
  };

  const buscar = (evento) => {
    evento.preventDefault();
    filtrar({ q: busqueda.trim() });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900">Cursos disponibles</h1>

      <form onSubmit={buscar} className="flex gap-2">
        <input
          type="search"
          value={busqueda}
          onChange={(evento) => setBusqueda(evento.target.value)}
          placeholder="Buscar cursos por título..."
          aria-label="Buscar cursos por título"
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15"
        />
        <Boton type="submit">Buscar</Boton>
      </form>

      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => filtrar({ categoria: '' })} className={estiloFiltro(!categoria)}>
          Todas
        </button>
        {categorias?.map((nombre) => (
          <button
            key={nombre}
            type="button"
            onClick={() => filtrar({ categoria: nombre })}
            className={estiloFiltro(categoria === nombre)}
          >
            {nombre}
          </button>
        ))}
      </div>

      {cargando && <Cargando />}
      {error && <Alerta>{error}</Alerta>}

      {!cargando && datos && datos.cursos.length === 0 && (
        <p className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-600">
          No hay cursos que coincidan con la búsqueda.
        </p>
      )}

      {!cargando && datos && datos.cursos.length > 0 && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {datos.cursos.map((curso) => (
              <TarjetaCurso key={curso.id} curso={curso} />
            ))}
          </div>
          <Paginacion
            pagina={datos.paginacion.page}
            totalPaginas={datos.paginacion.totalPaginas}
            alCambiar={(numero) => filtrar({ page: numero })}
          />
        </>
      )}
    </div>
  );
};

export default Catalogo;
