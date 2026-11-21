import { Link, Outlet, useNavigate } from 'react-router';
import useAuth from '../hooks/useAuth.js';
import Boton from './Boton.jsx';

const Layout = () => {
  const { usuario, cerrarSesion } = useAuth();
  const navigate = useNavigate();

  const salir = () => {
    cerrarSesion();
    navigate('/login');
  };

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white">
        <nav className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <Link to="/" className="text-lg font-semibold text-indigo-600">
            MiniAula
          </Link>
          {usuario ? (
            <div className="flex items-center gap-4 text-sm">
              <Link to="/cursos" className="text-slate-600 hover:text-indigo-600">
                Cursos
              </Link>
              {usuario.rol === 'estudiante' && (
                <Link to="/mis-cursos" className="text-slate-600 hover:text-indigo-600">
                  Mis cursos
                </Link>
              )}
              {usuario.rol === 'instructor' && (
                <Link to="/instructor/cursos" className="text-slate-600 hover:text-indigo-600">
                  Mis cursos
                </Link>
              )}
              <Link to="/perfil" className="text-slate-600 hover:text-indigo-600">
                {usuario.nombre}
              </Link>
              <Boton variante="secundario" onClick={salir}>
                Salir
              </Boton>
            </div>
          ) : (
            <div className="flex items-center gap-4 text-sm">
              <Link to="/cursos" className="text-slate-600 hover:text-indigo-600">
                Cursos
              </Link>
              <Link to="/login"className="text-slate-600 hover:text-indigo-600">
                Iniciar sesión
              </Link>
              <Link to="/registro" className="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700">
                Registrarse
              </Link>
            </div>
          )}
        </nav>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
