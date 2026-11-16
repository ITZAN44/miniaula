// Marca en el formulario los campos que rechazó la API y devuelve el mensaje general
export const aplicarErroresApi = (error, setError) => {
  const { message, details } = error.response?.data?.error ?? {};

  details
    ?.filter(({ campo }) => campo.startsWith('body.'))
    .forEach(({ campo, mensaje }) => setError(campo.replace('body.', ''), { message: mensaje }));

  return message ?? 'No se pudo conectar con el servidor';
};
