import { useCallback, useState } from 'react';
import useFetch from '../../hooks/useFetch.js';
import {
  listarPreguntas,
  crearPregunta,
  actualizarPregunta,
  eliminarPregunta,
} from '../../api/instructor.service.js';
import { mensajeDeError } from '../../api/errores.js';
import { preguntaSchema } from './instructor.schemas.js';
import CampoFormulario from '../../components/CampoFormulario.jsx';
import Boton from '../../components/Boton.jsx';
import Alerta from '../../components/Alerta.jsx';
import Cargando from '../../components/Cargando.jsx';

const OPCIONES_INICIALES = ['', '', ''];

const ContenidoPreguntas = ({ leccionId, preguntasIniciales }) => {
  const [preguntas, setPreguntas] = useState(preguntasIniciales);
  const [error, setError] = useState('');

  const [editandoId, setEditandoId] = useState(null);
  const [enunciado, setEnunciado] = useState('');
  const [opciones, setOpciones] = useState(OPCIONES_INICIALES);
  const [indiceCorrecto, setIndiceCorrecto] = useState(0);
  const [guardando, setGuardando] = useState(false);

  const limpiarFormulario = () => {
    setEditandoId(null);
    setEnunciado('');
    setOpciones(OPCIONES_INICIALES);
    setIndiceCorrecto(0);
    setError('');
  };

  const iniciarEdicion = (pregunta) => {
    setEditandoId(pregunta.id);
    setEnunciado(pregunta.enunciado);
    setOpciones(Array.isArray(pregunta.opciones) ? [...pregunta.opciones] : OPCIONES_INICIALES);
    setIndiceCorrecto(pregunta.indiceCorrecto ?? 0);
    setError('');
  };

  const cambiarOpcion = (indice, valor) => {
    const nuevas = [...opciones];
    nuevas[indice] = valor;
    setOpciones(nuevas);
  };

  const agregarOpcion = () => {
    setOpciones([...opciones, '']);
  };

  const quitarOpcion = (indice) => {
    if (opciones.length <= 2) return;
    const nuevas = opciones.filter((_, i) => i !== indice);
    setOpciones(nuevas);
    if (indiceCorrecto >= nuevas.length) {
      setIndiceCorrecto(0);
    }
  };

  const guardarPregunta = async (e) => {
    e.preventDefault();
    setError('');

    const validacion = preguntaSchema.safeParse({
      enunciado,
      opciones,
      indiceCorrecto,
    });

    if (!validacion.success) {
      setError(validacion.error.issues[0].message);
      return;
    }

    setGuardando(true);
    try {
      if (editandoId) {
        const actualizada = await actualizarPregunta(editandoId, validacion.data);
        setPreguntas(preguntas.map((p) => (p.id === editandoId ? actualizada : p)));
      } else {
        const nueva = await crearPregunta(leccionId, validacion.data);
        setPreguntas([...preguntas, nueva]);
      }
      limpiarFormulario();
    } catch (err) {
      setError(mensajeDeError(err));
    } finally {
      setGuardando(false);
    }
  };

  const borrarPregunta = async (id) => {
    setError('');
    try {
      await eliminarPregunta(id);
      setPreguntas(preguntas.filter((p) => p.id !== id));
      if (editandoId === id) limpiarFormulario();
    } catch (err) {
      setError(mensajeDeError(err));
    }
  };

  return (
    <div className="mt-6 space-y-5 border-t border-slate-200 pt-5">
      <h3 className="text-base font-semibold text-slate-900">
        Preguntas del cuestionario ({preguntas.length})
      </h3>

      {error && <Alerta>{error}</Alerta>}

      {preguntas.length === 0 ? (
        <p className="text-sm text-slate-500">Este cuestionario aún no tiene preguntas cargadas.</p>
      ) : (
        <div className="space-y-3">
          {preguntas.map((pregunta, idx) => (
            <div key={pregunta.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-medium text-slate-900">
                  {idx + 1}. {pregunta.enunciado}
                </p>
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={() => iniciarEdicion(pregunta)}
                    className="text-xs font-medium text-indigo-600 hover:underline"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => borrarPregunta(pregunta.id)}
                    className="text-xs font-medium text-red-600 hover:underline"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
              <ul className="mt-2 space-y-1 text-xs text-slate-600">
                {pregunta.opciones.map((op, i) => (
                  <li key={i} className={i === pregunta.indiceCorrecto ? 'font-semibold text-green-700' : ''}>
                    {i === pregunta.indiceCorrecto ? '✓ ' : '• '}
                    {op}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={guardarPregunta} noValidate className="space-y-4 rounded-lg border border-slate-200 bg-white p-4">
        <h4 className="text-sm font-semibold text-slate-800">
          {editandoId ? 'Editar pregunta' : 'Agregar pregunta'}
        </h4>

        <CampoFormulario
          id="enunciado-pregunta"
          etiqueta="Enunciado"
          value={enunciado}
          onChange={(e) => setEnunciado(e.target.value)}
        />

        <div className="space-y-2">
          <span className="block text-sm font-medium text-slate-700">
            Opciones (marca la respuesta correcta)
          </span>
          {opciones.map((opcion, indice) => (
            <div key={indice} className="flex items-center gap-2">
              <input
                type="radio"
                name="indiceCorrecto"
                checked={indiceCorrecto === indice}
                onChange={() => setIndiceCorrecto(indice)}
                title="Marcar como correcta"
              />
              <input
                type="text"
                value={opcion}
                onChange={(e) => cambiarOpcion(indice, e.target.value)}
                placeholder={`Opción ${indice + 1}`}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm outline-none focus:border-indigo-500"
              />
              {opciones.length > 2 && (
                <button
                  type="button"
                  onClick={() => quitarOpcion(indice)}
                  className="text-xs text-red-600 hover:underline"
                >
                  Quitar
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={agregarOpcion}
            className="text-xs font-medium text-indigo-600 hover:underline"
          >
            + Agregar opción
          </button>
        </div>

        <div className="flex justify-end gap-2">
          {editandoId && (
            <Boton type="button" variante="secundario" onClick={limpiarFormulario}>
              Cancelar
            </Boton>
          )}
          <Boton type="submit" disabled={guardando}>
            {guardando ? 'Guardando...' : editandoId ? 'Actualizar pregunta' : 'Guardar pregunta'}
          </Boton>
        </div>
      </form>
    </div>
  );
};

const EditorPreguntas = ({ leccionId }) => {
  const cargar = useCallback(() => listarPreguntas(leccionId), [leccionId]);
  const { datos: preguntas, cargando, error } = useFetch(cargar);

  if (cargando) return <Cargando />;
  if (error) return <Alerta>{error}</Alerta>;

  return <ContenidoPreguntas key={leccionId} leccionId={leccionId} preguntasIniciales={preguntas ?? []} />;
};

export default EditorPreguntas;
