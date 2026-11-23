import { useCallback } from 'react';
import { Link, useParams } from 'react-router';
import useFetch from '../../hooks/useFetch.js';
import { obtenerResumenCurso } from '../../api/instructor.service.js';
import Cargando from '../../components/Cargando.jsx';
import Alerta from '../../components/Alerta.jsx';
import BarraProgreso from '../../components/BarraProgreso.jsx';

const ESTILOS_ESTADO = {
  borrador: 'bg-amber-50 text-amber-700 border-amber-200',
  publicado: 'bg-green-50 text-green-700 border-green-200',
  archivado: 'bg-slate-100 text-slate-600 border-slate-300',
};

const TarjetaMetrica = ({ titulo, valor, descripcion, elementoExtra }) => {
  return (
    <article className="space-y-2 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-xs font-medium uppercase tracking-wide text-slate-500">{titulo}</h3>
      <p className="text-3xl font-semibold text-slate-900">{valor}</p>
      {elementoExtra && <div className="pt-1">{elementoExtra}</div>}
      <p className="text-xs text-slate-600">{descripcion}</p>
    </article>
  );
};

const PanelCurso = () => {
  const { id } = useParams();

  const cargar = useCallback(() => obtenerResumenCurso(id), [id]);
  const { datos: resumen, cargando, error } = useFetch(cargar);

  if (cargando) return <Cargando />;
  if (error) {
    return (
      <div className="space-y-4">
        <Link to="/instructor/cursos" className="text-sm text-indigo-600 hover:underline">
          ← Volver a mis cursos
        </Link>
        <Alerta>{error}</Alerta>
      </div>
    );
  }

  const { curso, inscritos, progresoPromedio, notaPromedio, leccionDondeSeDetienen, lecciones } = resumen;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <Link to="/instructor/cursos" className="text-sm text-indigo-600 hover:underline">
            ← Volver a mis cursos
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-semibold text-slate-900">Métricas: {curso.titulo}</h1>
            <span
              className={`rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${ESTILOS_ESTADO[curso.estado]}`}
            >
              {curso.estado}
            </span>
          </div>
          <p className="text-sm text-slate-600">
            {curso.categoria} · Nivel <span className="capitalize">{curso.nivel}</span>
          </p>
        </div>

        <Link
          to={`/instructor/cursos/${curso.id}`}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
        >
          Editar contenido del curso
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <TarjetaMetrica
          titulo="Estudiantes inscritos"
          valor={inscritos}
          descripcion={
            inscritos === 0
              ? 'Aún no hay inscripciones'
              : inscritos === 1
                ? '1 estudiante inscrito en total'
                : `${inscritos} estudiantes inscritos en total`
          }
        />

        <TarjetaMetrica
          titulo="Progreso promedio"
          valor={`${progresoPromedio}%`}
          elementoExtra={<BarraProgreso porcentaje={progresoPromedio} />}
          descripcion="Avance general de los estudiantes inscritos"
        />

        <TarjetaMetrica
          titulo="Nota promedio"
          valor={notaPromedio !== null ? `${notaPromedio} / 100` : '—'}
          descripcion={
            notaPromedio !== null
              ? 'Promedio de mejores notas en cuestionarios'
              : 'Sin evaluaciones rendidas aún'
          }
        />

        <TarjetaMetrica
          titulo="Mayor punto de detención"
          valor={leccionDondeSeDetienen ? `Lección ${leccionDondeSeDetienen.orden}` : 'Ninguno'}
          descripcion={
            leccionDondeSeDetienen
              ? `${leccionDondeSeDetienen.estudiantesDetenidos} estudiantes estancados aquí`
              : inscritos === 0
                ? 'Sin datos de estudiantes aún'
                : 'Todos los estudiantes van al día'
          }
        />
      </div>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Avance detallado por lección</h2>
          <span className="text-xs text-slate-500">{lecciones.length} lecciones</span>
        </div>

        {lecciones.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-600">
            Este curso todavía no tiene lecciones creadas.
          </div>
        ) : (
          <div
            tabIndex={0}
            role="region"
            aria-label="Avance de estudiantes por lección"
            className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase text-slate-600">
                <tr>
                  <th scope="col" className="px-4 py-3">
                    Lección
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Tipo
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Completaron
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Detenidos aquí
                  </th>
                  <th scope="col" className="min-w-[140px] px-4 py-3">
                    Tasa de finalización
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {lecciones.map((leccion) => {
                  const tasa = inscritos > 0 ? Math.round((leccion.completados * 100) / inscritos) : 0;
                  const esPuntoCritico = leccionDondeSeDetienen?.id === leccion.id;

                  return (
                    <tr
                      key={leccion.id}
                      className={esPuntoCritico ? 'bg-amber-50/50 hover:bg-amber-50' : 'hover:bg-slate-50'}
                    >
                      <th scope="row" className="px-4 py-3.5 font-medium text-slate-900">
                        {leccion.orden}. {leccion.titulo}
                        {esPuntoCritico && (
                          <span className="ml-2 inline-block rounded bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800">
                            Punto de abandono
                          </span>
                        )}
                      </th>
                      <td className="px-4 py-3.5 capitalize">
                        <span
                          className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${
                            leccion.tipo === 'cuestionario'
                              ? 'bg-purple-50 text-purple-700 border border-purple-200'
                              : 'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}
                        >
                          {leccion.tipo}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        {leccion.completados} de {inscritos} ({tasa}%)
                      </td>
                      <td className="px-4 py-3.5">
                        {leccion.detenidos > 0 ? (
                          <span className="font-semibold text-amber-700">
                            {leccion.detenidos} {leccion.detenidos === 1 ? 'estudiante' : 'estudiantes'}
                          </span>
                        ) : (
                          <span className="text-slate-400">0</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="flex-1">
                            <BarraProgreso porcentaje={tasa} />
                          </div>
                          <span className="w-9 text-right text-xs font-medium text-slate-600">{tasa}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default PanelCurso;
