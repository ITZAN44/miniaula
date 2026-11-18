import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { crearLeccion, actualizarLeccion } from '../../api/instructor.service.js';
import { aplicarErroresApi } from '../../api/errores.js';
import { leccionSchema } from './instructor.schemas.js';
import CampoFormulario from '../../components/CampoFormulario.jsx';
import Boton from '../../components/Boton.jsx';
import Alerta from '../../components/Alerta.jsx';
import EditorPreguntas from './EditorPreguntas.jsx';

const TIPOS_LECCION = [
  { valor: 'contenido', texto: 'Contenido (texto y video)' },
  { valor: 'cuestionario', texto: 'Cuestionario' },
];

const EditorLeccion = ({ cursoId, leccionInicial, alGuardar, alCancelar }) => {
  const [leccionActual, setLeccionActual] = useState(leccionInicial);
  const [mensaje, setMensaje] = useState(null);

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(leccionSchema),
    shouldUnregister: true,
    defaultValues: {
      titulo: leccionInicial?.titulo ?? '',
      tipo: leccionInicial?.tipo ?? 'contenido',
      contenido: leccionInicial?.contenido ?? '',
      videoUrl: leccionInicial?.videoUrl ?? '',
      notaMinima: leccionInicial?.notaMinima ?? '',
    },
  });

  const tipoSeleccionado = useWatch({ control, name: 'tipo' });

  const enviar = async (datos) => {
    setMensaje(null);
    const carga = {
      titulo: datos.titulo,
      tipo: datos.tipo,
      contenido: datos.tipo === 'contenido' ? datos.contenido || null : null,
      videoUrl: datos.tipo === 'contenido' ? datos.videoUrl || null : null,
      notaMinima: datos.tipo === 'cuestionario' ? Number(datos.notaMinima) : null,
    };

    try {
      if (leccionActual) {
        const actualizada = await actualizarLeccion(leccionActual.id, carga);
        setLeccionActual(actualizada);
        alGuardar(actualizada, false);
        setMensaje({ tipo: 'exito', texto: 'Lección actualizada' });
      } else {
        const nueva = await crearLeccion(cursoId, carga);
        setLeccionActual(nueva);
        alGuardar(nueva, true);
        if (nueva.tipo === 'cuestionario') {
          setMensaje({ tipo: 'exito', texto: 'Cuestionario creado. Ahora puedes agregar las preguntas abajo.' });
        }
      }
    } catch (err) {
      const texto = aplicarErroresApi(err, setError);
      setMensaje(texto ? { tipo: 'error', texto } : null);
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">
          {leccionActual ? `Editar lección: ${leccionActual.titulo}` : 'Nueva lección'}
        </h3>
        <Boton type="button" variante="secundario" onClick={alCancelar}>
          Cerrar
        </Boton>
      </div>

      <form onSubmit={handleSubmit(enviar)} noValidate className="space-y-4">
        {mensaje && <Alerta tipo={mensaje.tipo}>{mensaje.texto}</Alerta>}

        <div className="grid gap-4 sm:grid-cols-2">
          <CampoFormulario
            id="titulo-leccion"
            etiqueta="Título de la lección"
            error={errors.titulo?.message}
            {...register('titulo')}
          />
          <CampoFormulario
            id="tipo-leccion"
            etiqueta="Tipo"
            opciones={TIPOS_LECCION}
            disabled={Boolean(leccionActual)}
            error={errors.tipo?.message}
            {...register('tipo')}
          />
        </div>

        {tipoSeleccionado === 'contenido' ? (
          <>
            <CampoFormulario
              id="video-leccion"
              etiqueta="URL del video (opcional)"
              placeholder="https://www.youtube.com/watch?v=..."
              error={errors.videoUrl?.message}
              {...register('videoUrl')}
            />
            <CampoFormulario
              id="contenido-leccion"
              etiqueta="Contenido de texto"
              filas={4}
              error={errors.contenido?.message}
              {...register('contenido')}
            />
          </>
        ) : (
          <CampoFormulario
            id="nota-minima"
            etiqueta="Nota mínima de aprobación (1 a 100)"
            type="number"
            min="1"
            max="100"
            error={errors.notaMinima?.message}
            {...register('notaMinima')}
          />
        )}

        <div className="flex justify-end gap-2">
          <Boton type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Guardando...' : leccionActual ? 'Guardar lección' : 'Crear lección'}
          </Boton>
        </div>
      </form>

      {leccionActual && leccionActual.tipo === 'cuestionario' && (
        <EditorPreguntas leccionId={leccionActual.id} />
      )}
    </div>
  );
};

export default EditorLeccion;
