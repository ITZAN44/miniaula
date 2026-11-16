const ESTILO = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15';

const CampoFormulario = ({ id, etiqueta, error, opciones, ...props }) => {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-medium text-slate-700">
        {etiqueta}
      </label>
      {opciones ? (
        <select id={id} className={ESTILO} aria-invalid={Boolean(error)} {...props}>
          {opciones.map(({ valor, texto }) => (
            <option key={valor} value={valor}>
              {texto}
            </option>
          ))}
        </select>
      ) : (
        <input id={id} className={ESTILO} aria-invalid={Boolean(error)} {...props} />
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default CampoFormulario;
