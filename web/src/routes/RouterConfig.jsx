import { Route, Routes } from 'react-router';
import Layout from '../components/Layout.jsx';
import Inicio from '../pages/Inicio.jsx';
import NoEncontrada from '../pages/NoEncontrada.jsx';
import Login from '../pages/auth/Login.jsx';
import Registro from '../pages/auth/Registro.jsx';
import Perfil from '../pages/auth/Perfil.jsx';
import Catalogo from '../pages/estudiante/Catalogo.jsx';
import DetalleCurso from '../pages/estudiante/DetalleCurso.jsx';
import Aula from '../pages/estudiante/Aula.jsx';
import RutaProtegida from './RutaProtegida.jsx';

const RouterConfig = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Inicio />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/cursos" element={<Catalogo />} />
        <Route path="/cursos/:id" element={<DetalleCurso />} />
        <Route
          path="/aprender/:cursoId/:leccionId?"
          element={
            <RutaProtegida roles={['estudiante']}>
              <Aula />
            </RutaProtegida>
          }
        />
        <Route
          path="/perfil"
          element={
            <RutaProtegida>
              <Perfil />
            </RutaProtegida>
          }
        />
        <Route path="*" element={<NoEncontrada />} />
      </Route>
    </Routes>
  );
};

export default RouterConfig;
