import { Navigate, useLocation } from 'react-router';
import useAuth from '../hooks/useAuth.js';

const RutaProtegida = ({ roles, children }) => {
  const { usuario } = useAuth();
  const location = useLocation();

  if (!usuario) {
    return <Navigate to="/login" replace state={{ desde: location.pathname }} />;
  }

  if (roles && !roles.includes(usuario.rol)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RutaProtegida;
