import { Route, Routes } from 'react-router';
import Layout from '../components/Layout.jsx';
import Inicio from '../pages/Inicio.jsx';
import NoEncontrada from '../pages/NoEncontrada.jsx';
import Login from '../pages/auth/Login.jsx';
import Registro from '../pages/auth/Registro.jsx';
import Perfil from '../pages/auth/Perfil.jsx';
import MisCursosInstructor from '../pages/instructor/MisCursosInstructor.jsx';
import EditorCurso from '../pages/instructor/EditorCurso.jsx';
import RutaProtegida from './RutaProtegida.jsx';

const RouterConfig = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Inicio />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route
          path="/perfil"
          element={
            <RutaProtegida>
              <Perfil />
            </RutaProtegida>
          }
        />
        <Route
          path="/instructor/cursos"
          element={
            <RutaProtegida roles={['instructor']}>
              <MisCursosInstructor />
            </RutaProtegida>
          }
        />
        <Route
          path="/instructor/cursos/:id"
          element={
            <RutaProtegida roles={['instructor']}>
              <EditorCurso />
            </RutaProtegida>
          }
        />
        <Route path="*" element={<NoEncontrada />} />
      </Route>
    </Routes>
  );
};

export default RouterConfig;
