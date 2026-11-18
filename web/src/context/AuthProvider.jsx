import { useState } from 'react';
import { AuthContext } from './AuthContext.js';
import { obtenerSesion, guardarSesion, borrarSesion } from '../api/sesion.js';
import * as authService from '../api/auth.service.js';

const AuthProvider = ({ children }) => {
  const [sesion, setSesion] = useState(obtenerSesion);

  const cambiarSesion = (nuevaSesion) => {
    guardarSesion(nuevaSesion);
    setSesion(nuevaSesion);
  };

  const iniciarSesion = async (credenciales) => {
    cambiarSesion(await authService.iniciarSesion(credenciales));
  };

  const cerrarSesion = () => {
    borrarSesion();
    setSesion(null);
  };

  const actualizarUsuario = (usuario) => {
    cambiarSesion({ ...sesion, usuario });
  };

  return (
    <AuthContext value={{ usuario: sesion?.usuario ?? null, iniciarSesion, cerrarSesion, actualizarUsuario }}>
      {children}
    </AuthContext>
  );
};

export default AuthProvider;
