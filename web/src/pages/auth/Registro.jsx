import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import useAuth from '../../hooks/useAuth.js';
import { registrarse } from '../../api/auth.service.js';
import { aplicarErroresApi } from '../../api/errores.js';
import { registroSchema } from './auth.schemas.js';
import Tarjeta from '../../components/Tarjeta.jsx';
import CampoFormulario from '../../components/CampoFormulario.jsx';
import Boton from '../../components/Boton.jsx';
import Alerta from '../../components/Alerta.jsx';

const ROLES = [
  { valor: 'estudiante', texto: 'Estudiante' },
  { valor: 'instructor', texto: 'Instructor' },
];

const Registro = () => {
  const { iniciarSesion } = useAuth();
  const navigate = useNavigate();
  const [errorGeneral, setErrorGeneral] = useState('');
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(registroSchema), defaultValues: { rol: 'estudiante' } });

  const enviar = async (datos) => {
    setErrorGeneral('');
    try {
      await registrarse(datos);
      await iniciarSesion({ email: datos.email, password: datos.password });
      navigate('/', { replace: true });
    } catch (error) {
      if (error.response?.status === 409) {
        setError('email', { message: 'Ya existe una cuenta con este email' });
        return;
      }
      setErrorGeneral(aplicarErroresApi(error, setError));
    }
  };

  return (
    <Tarjeta titulo="Crear cuenta">
      <form onSubmit={handleSubmit(enviar)} noValidate className="space-y-4">
        {errorGeneral && <Alerta>{errorGeneral}</Alerta>}
        <CampoFormulario id="nombre" etiqueta="Nombre" error={errors.nombre?.message} {...register('nombre')} />
        <CampoFormulario id="email" etiqueta="Email" type="email" error={errors.email?.message} {...register('email')} />
        <CampoFormulario
          id="password"
          etiqueta="Contraseña"
          type="password"
          error={errors.password?.message}
          {...register('password')}
        />
        <CampoFormulario id="rol" etiqueta="Quiero" opciones={ROLES} error={errors.rol?.message} {...register('rol')} />
        <Boton type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Creando cuenta...' : 'Crear cuenta'}
        </Boton>
      </form>
      <p className="mt-6 text-center text-sm text-slate-600">
        ¿Ya tienes cuenta?{' '}
        <Link to="/login" className="font-medium text-indigo-600 hover:underline">
          Inicia sesión
        </Link>
      </p>
    </Tarjeta>
  );
};

export default Registro;
