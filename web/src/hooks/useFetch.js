import { useEffect, useState } from 'react';
import { mensajeDeError } from '../api/errores.js';

// cargar tiene que ser una función estable (importada o con useCallback)
const useFetch = (cargar) => {
  const [resultado, setResultado] = useState({ datos: null, error: '', origen: null });

  useEffect(() => {
    let activo = true;

    cargar()
      .then((datos) => activo && setResultado({ datos, error: '', origen: cargar }))
      .catch((e) => activo && setResultado({ datos: null, error: mensajeDeError(e), origen: cargar }));

    return () => {
      activo = false;
    };
  }, [cargar]);

  return { datos: resultado.datos, error: resultado.error, cargando: resultado.origen !== cargar };
};

export default useFetch;
