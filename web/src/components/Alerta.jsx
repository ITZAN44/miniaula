const TIPOS = {
  error: 'border-red-200 bg-red-50 text-red-700',
  exito: 'border-green-200 bg-green-50 text-green-700',
};

const Alerta = ({ tipo = 'error', children }) => {
  return (
    <div role="alert" className={`rounded-lg border px-4 py-3 text-sm ${TIPOS[tipo]}`}>
      {children}
    </div>
  );
};

export default Alerta;
