import { Route, Routes } from 'react-router';
import Layout from '../components/Layout.jsx';
import Inicio from '../pages/Inicio.jsx';
import NoEncontrada from '../pages/NoEncontrada.jsx';
import Login from '../pages/auth/Login.jsx';
import Registro from '../pages/auth/Registro.jsx';

const RouterConfig = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Inicio />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="*" element={<NoEncontrada />} />
      </Route>
    </Routes>
  );
};

export default RouterConfig;
