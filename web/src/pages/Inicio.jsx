import useAuth from '../hooks/useAuth.js';

const Inicio = () => {
  const { usuario } = useAuth();

  return (
    <section className="py-12 text-center">
      <h1 className="text-3xl font-semibold text-slate-900">
        {usuario ? `Hola, ${usuario.nombre}` : 'Aprende a tu ritmo con MiniAula'}
      </h1>
      <p className="mt-3 text-slate-600">Cursos cortos con lecciones y cuestionarios.</p>
    </section>
  );
};

export default Inicio;
