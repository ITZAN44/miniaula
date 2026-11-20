import { useCallback, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router';
import useFetch from '../../hooks/useFetch.js';
import { obtenerProgreso } from '../../api/estudiante.service.js';
import Alerta from '../../components/Alerta.jsx';
import Cargando from '../../components/Cargando.jsx';
import Temario from './Temario.jsx';
import ContenidoLeccion from './ContenidoLeccion.jsx';

// La lección para seguir es la primera disponible que falta completar
const leccionParaSeguir = (lecciones) =>
  lecciones.find((leccion) => !leccion.completada && !leccion.bloqueada) ?? lecciones[0];

const VistaAula = ({ progresoInicial, leccionId }) => {
  const [progreso, setProgreso] = useState(progresoInicial);
  const { curso, lecciones } = progreso;

  const recargarProgreso = async () => {
    setProgreso(await obtenerProgreso(curso.id));
  };

  if (lecciones.length === 0) {
    return <Alerta>Este curso todavía no tiene lecciones.</Alerta>;
  }

  if (!leccionId) {
    return <Navigate to={`/aprender/${curso.id}/${leccionParaSeguir(lecciones).id}`} replace />;
  }

  const indice = lecciones.findIndex((leccion) => leccion.id === Number(leccionId));

  if (indice === -1) {
    return <Alerta>La lección no pertenece a este curso.</Alerta>;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[18rem_1fr]">
      <Temario progreso={progreso} actualId={lecciones[indice].id} />
      <ContenidoLeccion
        key={leccionId}
        leccionId={leccionId}
        cursoId={curso.id}
        anterior={lecciones[indice - 1]}
        siguiente={lecciones[indice + 1]}
        alCompletar={recargarProgreso}
      />
    </div>
  );
};

const Aula = () => {
  const { cursoId, leccionId } = useParams();
  const cargar = useCallback(() => obtenerProgreso(cursoId), [cursoId]);
  const { datos: progreso, cargando, error } = useFetch(cargar);

  if (cargando) return <Cargando />;

  if (error) {
    return (
      <div className="space-y-4">
        <Alerta>{error}</Alerta>
        <Link to={`/cursos/${cursoId}`} className="inline-block text-sm text-indigo-600 hover:underline">
          Ver el curso
        </Link>
      </div>
    );
  }

  return <VistaAula key={cursoId} progresoInicial={progreso} leccionId={leccionId} />;
};

export default Aula;
