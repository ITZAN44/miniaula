export const mensajeDeError = (error) =>
  error.response?.data?.error?.message ?? 'No se pudo conectar con el servidor';

// Marca en el formulario los campos que rechazó la API y devuelve el mensaje general
export const aplicarErroresApi = (error, setError, { duplicado } = {}) => {
  if (error.response?.status === 409 && duplicado) {
    setError(duplicado, { message: 'Ya está registrado' });
    return '';
  }

  error.response?.data?.error?.details
    ?.filter(({ campo }) => campo.startsWith('body.'))
    .forEach(({ campo, mensaje }) => setError(campo.replace('body.', ''), { message: mensaje }));

  return mensajeDeError(error);
};
