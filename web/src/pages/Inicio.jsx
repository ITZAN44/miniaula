import { Link } from 'react-router';
import useAuth from '../hooks/useAuth.js';

const Inicio = () => {
  const { usuario } = useAuth();

  return (
    <section className="py-12 text-center">
      <h1 className="text-3xl font-semibold text-slate-900">
        {usuario ? `Hola, ${usuario.nombre}` : 'Aprende a tu ritmo con MiniAula'}
      </h1>
      <p className="mt-3 text-slate-600">Cursos cortos con lecciones y cuestionarios.</p>
      <Link
        to="/cursos"
        className="mt-6 inline-block rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
      >
        Ver cursos
      </Link>
    </section>
  );
};

export default Inicio;
