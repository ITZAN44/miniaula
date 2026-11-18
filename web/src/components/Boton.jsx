const VARIANTES = {
  primario: 'bg-indigo-600 text-white hover:bg-indigo-700',
  secundario: 'border border-slate-300 text-slate-700 hover:bg-slate-100',
};

const Boton = ({ variante = 'primario', className = '', ...props }) => {
  return (
    <button
      className={`rounded-lg px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60 ${VARIANTES[variante]} ${className}`}
      {...props}
    />
  );
};

export default Boton;
