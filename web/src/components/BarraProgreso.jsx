const BarraProgreso = ({ porcentaje }) => {
  return (
    <div
      role="progressbar"
      aria-valuenow={porcentaje}
      aria-valuemin={0}
      aria-valuemax={100}
      className="h-2 w-full overflow-hidden rounded-full bg-slate-200"
    >
      <div className="h-full rounded-full bg-indigo-600 transition-all" style={{ width: `${porcentaje}%` }} />
    </div>
  );
};

export default BarraProgreso;
