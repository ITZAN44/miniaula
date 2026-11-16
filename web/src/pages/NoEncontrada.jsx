import { Link } from 'react-router';

const NoEncontrada = () => {
  return (
    <section className="py-12 text-center">
      <h1 className="text-2xl font-semibold text-slate-900">Página no encontrada</h1>
      <Link to="/" className="mt-4 inline-block text-indigo-600 hover:underline">
        Volver al inicio
      </Link>
    </section>
  );
};

export default NoEncontrada;
