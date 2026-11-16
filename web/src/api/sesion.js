const CLAVE = 'sesion';

export const obtenerSesion = () => JSON.parse(localStorage.getItem(CLAVE));

export const guardarSesion = (sesion) => {
  localStorage.setItem(CLAVE, JSON.stringify(sesion));
};

export const borrarSesion = () => {
  localStorage.removeItem(CLAVE);
};
