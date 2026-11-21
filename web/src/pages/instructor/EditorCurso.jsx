import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import useFetch from '../../hooks/useFetch.js';
import {
  listarMisCursos,
  actualizarCurso,
  cambiarEstadoCurso,
  eliminarCurso,
  eliminarLeccion,
  reordenarLecciones,
} from '../../api/instructor.service.js';
import { aplicarErroresApi, mensajeDeError } from '../../api/errores.js';
import { cursoSchema } from './instructor.schemas.js';
import CampoFormulario from '../../components/CampoFormulario.jsx';
import Boton from '../../components/Boton.jsx';
import Alerta from '../../components/Alerta.jsx';
import Cargando from '../../components/Cargando.jsx';
import EditorLeccion from './EditorLeccion.jsx';

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

const ordenarPorCampo = (lista = []) => [...lista].sort((a, b) => a.orden - b.orden);

const VistaEditorCurso = ({ cursoInicial }) => {
  const navigate = useNavigate();
  const [curso, setCurso] = useState(cursoInicial);
  const [lecciones, setLecciones] = useState(() => ordenarPorCampo(cursoInicial.lecciones));
  const [mensaje, setMensaje] = useState(null);
  const [editorAbierto, setEditorAbierto] = useState(false);
  const [leccionSeleccionada, setLeccionSeleccionada] = useState(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(cursoSchema),
    defaultValues: {
      titulo: cursoInicial.titulo,
      categoria: cursoInicial.categoria,
      nivel: cursoInicial.nivel,
      descripcion: cursoInicial.descripcion,
    },
  });

  const guardarDatosCurso = async (datos) => {
    setMensaje(null);
    try {
      const actualizado = await actualizarCurso(curso.id, datos);
      setCurso({ ...curso, ...actualizado });
      setMensaje({ tipo: 'exito', texto: 'Datos del curso guardados' });
    } catch (err) {
      const texto = aplicarErroresApi(err, setError);
      setMensaje(texto ? { tipo: 'error', texto } : null);
    }
  };

  const cambiarEstado = async (nuevoEstado) => {
    setMensaje(null);
    try {
      const actualizado = await cambiarEstadoCurso(curso.id, nuevoEstado);
      setCurso({ ...curso, estado: actualizado.estado });
      setMensaje({
        tipo: 'exito',
        texto: nuevoEstado === 'publicado' ? 'Curso publicado correctamente' : 'Curso archivado',
      });
    } catch (err) {
      setMensaje({ tipo: 'error', texto: mensajeDeError(err) });
    }
  };

  const borrarCurso = async () => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este curso? Esta acción no se puede deshacer.')) {
      return;
    }
    setMensaje(null);
    try {
      await eliminarCurso(curso.id);
      navigate('/instructor/cursos', { replace: true });
    } catch (err) {
      setMensaje({ tipo: 'error', texto: mensajeDeError(err) });
    }
  };

  const moverLeccion = async (indice, direccion) => {
    const destino = indice + direccion;
    if (destino < 0 || destino >= lecciones.length) return;

    const copia = [...lecciones];
    const temporal = copia[indice];
    copia[indice] = copia[destino];
    copia[destino] = temporal;

    setMensaje(null);
    try {
      const idsOrdenados = copia.map((l) => l.id);
      const actualizadas = await reordenarLecciones(curso.id, idsOrdenados);
      setLecciones(ordenarPorCampo(actualizadas));
    } catch (err) {
      setMensaje({ tipo: 'error', texto: mensajeDeError(err) });
    }
  };

  const borrarLeccion = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta lección?')) {
      return;
    }
    setMensaje(null);
    try {
      await eliminarLeccion(id);
      setLecciones(lecciones.filter((l) => l.id !== id));
      if (leccionSeleccionada?.id === id) {
        setEditorAbierto(false);
        setLeccionSeleccionada(null);
      }
    } catch (err) {
      setMensaje({ tipo: 'error', texto: mensajeDeError(err) });
    }
  };

  const alGuardarLeccion = (leccionGuardada, esNueva) => {
    setMensaje(null);
    if (esNueva) {
      setLecciones(ordenarPorCampo([...lecciones, leccionGuardada]));
      setLeccionSeleccionada(leccionGuardada);
      if (leccionGuardada.tipo === 'contenido') {
        setEditorAbierto(false);
      }
    } else {
      setLecciones(
        ordenarPorCampo(lecciones.map((l) => (l.id === leccionGuardada.id ? leccionGuardada : l))),
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <Link to="/instructor/cursos" className="text-sm text-indigo-600 hover:underline">
            ← Volver a mis cursos
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-semibold text-slate-900">{curso.titulo}</h1>
            <span
              className={`rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${ESTILOS_ESTADO[curso.estado]}`}
            >
              {curso.estado}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            to={`/instructor/cursos/${curso.id}/panel`}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
          >
            Ver métricas
          </Link>
          {curso.estado !== 'publicado' && (
            <Boton type="button" onClick={() => cambiarEstado('publicado')}>
              Publicar
            </Boton>
          )}
          {curso.estado !== 'archivado' && (
            <Boton type="button" variante="secundario" onClick={() => cambiarEstado('archivado')}>
              Archivar
            </Boton>
          )}
          <Boton
            type="button"
            variante="secundario"
            onClick={borrarCurso}
            className="border-red-200 text-red-600 hover:bg-red-50"
          >
            Eliminar
          </Boton>
        </div>
      </div>

      {mensaje && <Alerta tipo={mensaje.tipo}>{mensaje.texto}</Alerta>}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Información del curso</h2>
          <form onSubmit={handleSubmit(guardarDatosCurso)} noValidate className="space-y-4">
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
              filas={4}
              error={errors.descripcion?.message}
              {...register('descripcion')}
            />
            <div className="flex justify-end">
              <Boton type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Guardando...' : 'Guardar'}
              </Boton>
            </div>
          </form>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-2">
            <h2 className="text-lg font-semibold text-slate-900">Lecciones ({lecciones.length})</h2>
            <Boton
              type="button"
              variante="secundario"
              onClick={() => {
                setLeccionSeleccionada(null);
                setEditorAbierto(true);
              }}
            >
              + Agregar lección
            </Boton>
          </div>

          {lecciones.length === 0 ? (
            <p className="py-6 text-center text-sm text-slate-500">
              Este curso no tiene lecciones aún. Agrega al menos una para poder publicarlo.
            </p>
          ) : (
            <ul className="space-y-2">
              {lecciones.map((leccion, idx) => (
                <li
                  key={leccion.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 px-3 py-2.5 text-sm"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col text-xs text-slate-400">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => moverLeccion(idx, -1)}
                        className="hover:text-slate-700 disabled:opacity-30"
                        title="Subir lección"
                      >
                        ▲
                      </button>
                      <button
                        type="button"
                        disabled={idx === lecciones.length - 1}
                        onClick={() => moverLeccion(idx, 1)}
                        className="hover:text-slate-700 disabled:opacity-30"
                        title="Bajar lección"
                      >
                        ▼
                      </button>
                    </div>
                    <span className="font-medium text-slate-900">
                      {idx + 1}. {leccion.titulo}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-xs capitalize text-slate-600">
                      {leccion.tipo}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setLeccionSeleccionada(leccion);
                        setEditorAbierto(true);
                      }}
                      className="text-xs font-medium text-indigo-600 hover:underline"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => borrarLeccion(leccion.id)}
                      className="text-xs font-medium text-red-600 hover:underline"
                    >
                      Eliminar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {editorAbierto && (
        <EditorLeccion
          key={leccionSeleccionada?.id ?? 'nueva'}
          cursoId={curso.id}
          leccionInicial={leccionSeleccionada}
          alGuardar={alGuardarLeccion}
          alCancelar={() => {
            setEditorAbierto(false);
            setLeccionSeleccionada(null);
          }}
        />
      )}
    </div>
  );
};

const EditorCurso = () => {
  const { id } = useParams();
  const { datos: cursos, cargando, error } = useFetch(listarMisCursos);

  if (cargando) return <Cargando />;
  if (error) return <Alerta>{error}</Alerta>;

  const curso = cursos?.find((c) => c.id === Number(id));

  if (!curso) {
    return (
      <div className="space-y-4">
        <Alerta>El curso solicitado no existe o no tienes permiso para editarlo.</Alerta>
        <Link to="/instructor/cursos" className="inline-block text-sm text-indigo-600 hover:underline">
          ← Volver a mis cursos
        </Link>
      </div>
    );
  }

  return <VistaEditorCurso key={curso.id} cursoInicial={curso} />;
};

export default EditorCurso;
