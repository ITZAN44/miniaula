const Tarjeta = ({ titulo, children }) => {
  return (
    <div className="mx-auto w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="mb-6 text-xl font-semibold text-slate-900">{titulo}</h1>
      {children}
    </div>
  );
};

export default Tarjeta;
