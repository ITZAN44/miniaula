import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import useAuth from '../../hooks/useAuth.js';
import useFetch from '../../hooks/useFetch.js';
import { obtenerPerfil, actualizarPerfil } from '../../api/usuario.service.js';
import { aplicarErroresApi } from '../../api/errores.js';
import { perfilSchema } from './auth.schemas.js';
import Tarjeta from '../../components/Tarjeta.jsx';
import CampoFormulario from '../../components/CampoFormulario.jsx';
import Boton from '../../components/Boton.jsx';
import Alerta from '../../components/Alerta.jsx';
import Cargando from '../../components/Cargando.jsx';

const FormularioPerfil = ({ perfil }) => {
  const { actualizarUsuario } = useAuth();
  const [mensaje, setMensaje] = useState(null);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(perfilSchema),
    defaultValues: { nombre: perfil.nombre, email: perfil.email },
  });

  const enviar = async (datos) => {
    setMensaje(null);
    try {
      actualizarUsuario(await actualizarPerfil(datos));
      setMensaje({ tipo: 'exito', texto: 'Perfil actualizado' });
    } catch (error) {
      const texto = aplicarErroresApi(error, setError, { duplicado: 'email' });
      setMensaje(texto ? { tipo: 'error', texto } : null);
    }
  };

  return (
    <form onSubmit={handleSubmit(enviar)} noValidate className="space-y-4">
      {mensaje && <Alerta tipo={mensaje.tipo}>{mensaje.texto}</Alerta>}
      <p className="text-sm text-slate-600">
        Rol: <span className="font-medium capitalize text-slate-900">{perfil.rol}</span>
      </p>
      <CampoFormulario id="nombre" etiqueta="Nombre" error={errors.nombre?.message} {...register('nombre')} />
      <CampoFormulario id="email" etiqueta="Email" type="email" error={errors.email?.message} {...register('email')} />
      <Boton type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
      </Boton>
    </form>
  );
};

const Perfil = () => {
  const { datos: perfil, cargando, error } = useFetch(obtenerPerfil);

  return (
    <Tarjeta titulo="Mi perfil">
      {cargando && <Cargando />}
      {error && <Alerta>{error}</Alerta>}
      {perfil && <FormularioPerfil perfil={perfil} />}
    </Tarjeta>
  );
};

export default Perfil;
