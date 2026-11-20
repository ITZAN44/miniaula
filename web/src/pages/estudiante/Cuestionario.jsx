import { useState } from 'react';
import { rendirCuestionario } from '../../api/estudiante.service.js';
import { mensajeDeError } from '../../api/errores.js';
import Boton from '../../components/Boton.jsx';
import Alerta from '../../components/Alerta.jsx';

const textoIntentos = (cantidad) => {
  if (cantidad === 0) return 'No te quedan intentos';
  return cantidad === 1 ? 'Te queda 1 intento' : `Te quedan ${cantidad} intentos`;
};

const Resultado = ({ resultado, alReintentar }) => {
  return (
    <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-6 text-center">
      <h2 className="font-semibold text-slate-900">Resultado</h2>
      <p className="text-4xl font-semibold text-slate-900">{resultado.nota} / 100</p>
      <span
        className={`inline-block rounded-full border px-4 py-1 text-sm font-medium ${
          resultado.aprobado ? 'border-green-300 bg-green-50 text-green-700' : 'border-red-300 bg-red-50 text-red-700'
        }`}
      >
        {resultado.aprobado ? 'Aprobado' : 'Reprobado'}
      </span>
      <p className="text-sm text-slate-600">
        {resultado.correctas} de {resultado.total} correctas · Nota mínima: {resultado.notaMinima}
      </p>
      <p className="text-sm text-slate-600">
        Mejor nota: {resultado.mejorNota} · {textoIntentos(resultado.intentosRestantes)}
      </p>
      {!resultado.aprobado && resultado.intentosRestantes > 0 && (
        <Boton variante="secundario" onClick={alReintentar}>
          Volver a intentar
        </Boton>
      )}
    </div>
  );
};

const Cuestionario = ({ leccion, alResponder }) => {
  const [respuestas, setRespuestas] = useState({});
  const [resultado, setResultado] = useState(null);
  const [intentos, setIntentos] = useState(leccion.intentos);
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  const maximo = leccion.intentos + leccion.intentosRestantes;
  const respondioTodas = leccion.preguntas.every((pregunta) => respuestas[pregunta.id] !== undefined);

  const enviar = async (evento) => {
    evento.preventDefault();
    setError('');
    setEnviando(true);
    try {
      const lista = leccion.preguntas.map((pregunta) => ({ preguntaId: pregunta.id, opcion: respuestas[pregunta.id] }));
      const nuevo = await rendirCuestionario(leccion.id, lista);
      setResultado(nuevo);
      setIntentos(nuevo.intentos);
      await alResponder();
    } catch (err) {
      setError(mensajeDeError(err));
    } finally {
      setEnviando(false);
    }
  };

  const reintentar = () => {
    setResultado(null);
    setRespuestas({});
  };

  if (resultado) {
    return <Resultado resultado={resultado} alReintentar={reintentar} />;
  }

  if (leccion.preguntas.length === 0) {
    return <p className="text-sm text-slate-600">Este cuestionario todavía no tiene preguntas.</p>;
  }

  if (intentos >= maximo) {
    return (
      <Alerta tipo={leccion.completada ? 'exito' : 'error'}>
        {leccion.completada
          ? `Aprobaste este cuestionario. Tu mejor nota fue ${leccion.mejorNota}.`
          : `Usaste los ${maximo} intentos sin aprobar. Tu mejor nota fue ${leccion.mejorNota}.`}
      </Alerta>
    );
  }

  return (
    <form onSubmit={enviar} className="space-y-4">
      <p className="text-sm text-slate-600">
        Intento {intentos + 1} de {maximo} · {leccion.preguntas.length} preguntas · Nota mínima: {leccion.notaMinima}
      </p>
      {leccion.completada && (
        <Alerta tipo="exito">Ya aprobaste este cuestionario con {leccion.mejorNota}. Puedes rendirlo de nuevo para mejorar tu nota.</Alerta>
      )}

      {leccion.preguntas.map((pregunta, indice) => (
        <fieldset key={pregunta.id} className="space-y-2 rounded-lg border border-slate-200 p-4">
          <legend className="px-1 font-medium text-slate-900">
            {indice + 1}. {pregunta.enunciado}
          </legend>
          {pregunta.opciones.map((opcion, numero) => (
            <label key={numero} className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-1.5 text-sm text-slate-700 hover:bg-slate-50">
              <input
                type="radio"
                name={`pregunta-${pregunta.id}`}
                checked={respuestas[pregunta.id] === numero}
                onChange={() => setRespuestas({ ...respuestas, [pregunta.id]: numero })}
                className="accent-indigo-600"
              />
              {opcion}
            </label>
          ))}
        </fieldset>
      ))}

      {error && <Alerta>{error}</Alerta>}
      <Boton type="submit" disabled={!respondioTodas || enviando}>
        {enviando ? 'Enviando...' : 'Enviar respuestas'}
      </Boton>
    </form>
  );
};

export default Cuestionario;
