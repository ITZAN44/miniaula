const Cargando = () => {
  return (
    <div className="flex justify-center py-12" role="status">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
      <span className="sr-only">Cargando...</span>
    </div>
  );
};

export default Cargando;
