import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import useFetch from '../../hooks/useFetch.js';
import { listarMisCursos, crearCurso } from '../../api/instructor.service.js';
import { aplicarErroresApi } from '../../api/errores.js';
import { cursoSchema } from './instructor.schemas.js';
import CampoFormulario from '../../components/CampoFormulario.jsx';
import Boton from '../../components/Boton.jsx';
import Alerta from '../../components/Alerta.jsx';
import Cargando from '../../components/Cargando.jsx';

const NIVELES = [
  { valor: 'basico', texto: 'Básico' },
  { valor: 'intermedio', texto: 'Intermedio' },
  { valor: 'avanzado', texto: 'Avanzado' },
];

const ESTILOS_ESTADO = {
  borrador: 'bg-amber-50 text-amber-700 border-amber-200',
  publicado: 'bg-green-50 text-green-700 border-green-200',
  archivado: 'bg-slate-100 text-slate-600 border-slate-300',
};

const MisCursosInstructor = () => {
  const { datos: cursos, cargando, error } = useFetch(listarMisCursos);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [errorForm, setErrorForm] = useState('');
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(cursoSchema),
    defaultValues: { titulo: '', categoria: '', nivel: 'basico', descripcion: '' },
  });

  const guardarNuevoCurso = async (datos) => {
    setErrorForm('');
    try {
      const nuevo = await crearCurso(datos);
      reset();
      setMostrarFormulario(false);
      navigate(`/instructor/cursos/${nuevo.id}`);
    } catch (err) {
      setErrorForm(aplicarErroresApi(err, setError));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Mis cursos</h1>
          <p className="text-sm text-slate-600">Administra tus cursos, lecciones y cuestionarios</p>
        </div>
        <Boton onClick={() => setMostrarFormulario(!mostrarFormulario)}>
          {mostrarFormulario ? 'Cancelar' : '+ Nuevo curso'}
        </Boton>
      </div>

      {mostrarFormulario && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Crear nuevo curso</h2>
          <form onSubmit={handleSubmit(guardarNuevoCurso)} noValidate className="space-y-4">
            {errorForm && <Alerta>{errorForm}</Alerta>}
            <CampoFormulario id="titulo" etiqueta="Título" error={errors.titulo?.message} {...register('titulo')} />
            <div className="grid gap-4 sm:grid-cols-2">
              <CampoFormulario
                id="categoria"
                etiqueta="Categoría"
                error={errors.categoria?.message}
                {...register('categoria')}
              />
              <CampoFormulario
                id="nivel"
                etiqueta="Nivel"
                opciones={NIVELES}
                error={errors.nivel?.message}
                {...register('nivel')}
              />
            </div>
            <CampoFormulario
              id="descripcion"
              etiqueta="Descripción"
              filas={3}
              error={errors.descripcion?.message}
              {...register('descripcion')}
            />
            <div className="flex justify-end gap-2">
              <Boton type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creando...' : 'Crear en borrador'}
              </Boton>
            </div>
          </form>
        </div>
      )}

      {cargando && <Cargando />}
      {error && <Alerta>{error}</Alerta>}

      {cursos && cursos.length === 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-600">
          Todavía no has creado ningún curso. Usa el botón "+ Nuevo curso" para comenzar.
        </div>
      )}

      {cursos && cursos.length > 0 && (
        <div className="space-y-3">
          {cursos.map((curso) => (
            <div
              key={curso.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="font-semibold text-slate-900">{curso.titulo}</h2>
                  <span
                    className={`rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${ESTILOS_ESTADO[curso.estado]}`}
                  >
                    {curso.estado}
                  </span>
                </div>
                <p className="text-sm text-slate-600">
                  {curso.categoria} · <span className="capitalize">{curso.nivel}</span> ·{' '}
                  {curso.lecciones?.length ?? 0} lecciones
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  to={`/instructor/cursos/${curso.id}/panel`}
                  className="rounded-lg border border-indigo-600 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-100"
                >
                  Métricas
                </Link>
                <Link
                  to={`/instructor/cursos/${curso.id}`}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  Editar curso
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MisCursosInstructor;
