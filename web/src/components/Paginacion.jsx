const Paginacion = ({ pagina, totalPaginas, alCambiar }) => {
  if (totalPaginas <= 1) {
    return null;
  }

  const paginas = Array.from({ length: totalPaginas }, (_, i) => i + 1);
  const estilo = 'min-w-9 rounded-lg border px-3 py-1.5 text-sm disabled:opacity-40';

  return (
    <nav aria-label="Paginación" className="flex flex-wrap items-center justify-center gap-1">
      <button
        type="button"
        onClick={() => alCambiar(pagina - 1)}
        disabled={pagina === 1}
        className={`${estilo} border-slate-300 text-slate-700 hover:bg-slate-100`}
        aria-label="Página anterior"
      >
        ‹
      </button>
      {paginas.map((numero) => (
        <button
          key={numero}
          type="button"
          onClick={() => alCambiar(numero)}
          aria-current={numero === pagina ? 'page' : undefined}
          className={`${estilo} ${
            numero === pagina
              ? 'border-indigo-600 bg-indigo-50 font-semibold text-indigo-700'
              : 'border-slate-300 text-slate-700 hover:bg-slate-100'
          }`}
        >
          {numero}
        </button>
      ))}
      <button
        type="button"
        onClick={() => alCambiar(pagina + 1)}
        disabled={pagina === totalPaginas}
        className={`${estilo} border-slate-300 text-slate-700 hover:bg-slate-100`}
        aria-label="Página siguiente"
      >
        ›
      </button>
    </nav>
  );
};

export default Paginacion;
