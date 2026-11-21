import { Link } from 'react-router';
import BarraProgreso from '../../components/BarraProgreso.jsx';

const estadoLeccion = (leccion, actualId) => {
  if (leccion.id === actualId) return 'Actual';
  if (leccion.completada) return 'Hecha';
  if (leccion.bloqueada) return 'Bloqueada';
  return '';
};

const Temario = ({ progreso, actualId }) => {
  return (
    <aside className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="space-y-2">
        <h2 className="font-semibold text-slate-900">{progreso.curso.titulo}</h2>
        <p className="text-sm text-slate-600">
          {progreso.completadas} de {progreso.total} lecciones · {progreso.porcentaje} %
        </p>
        <BarraProgreso porcentaje={progreso.porcentaje} />
      </div>

      <ol className="space-y-1">
        {progreso.lecciones.map((leccion, indice) => {
          const estado = estadoLeccion(leccion, actualId);
          return (
            <li key={leccion.id}>
              <Link
                to={`/aprender/${progreso.curso.id}/${leccion.id}`}
                aria-current={estado === 'Actual' ? 'page' : undefined}
                className={`flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm ${
                  estado === 'Actual'
                    ? 'border border-indigo-600 bg-indigo-50 font-medium text-indigo-700'
                    : leccion.bloqueada
                      ? 'text-slate-400 hover:bg-slate-50'
                      : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>
                  {indice + 1}. {leccion.titulo}
                </span>
                <span className="shrink-0 text-xs">{estado}</span>
              </Link>
            </li>
          );
        })}
      </ol>
    </aside>
  );
};

export default Temario;
