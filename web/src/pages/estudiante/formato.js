export const NIVELES = {
  basico: 'Básico',
  intermedio: 'Intermedio',
  avanzado: 'Avanzado',
};

export const contarLecciones = (cantidad) => `${cantidad} ${cantidad === 1 ? 'lección' : 'lecciones'}`;
