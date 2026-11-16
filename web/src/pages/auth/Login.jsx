import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import useAuth from '../../hooks/useAuth.js';
import { aplicarErroresApi } from '../../api/errores.js';
import { loginSchema } from './auth.schemas.js';
import Tarjeta from '../../components/Tarjeta.jsx';
import CampoFormulario from '../../components/CampoFormulario.jsx';
import Boton from '../../components/Boton.jsx';
import Alerta from '../../components/Alerta.jsx';

const Login = () => {
  const { iniciarSesion } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [errorGeneral, setErrorGeneral] = useState('');
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const enviar = async (datos) => {
    setErrorGeneral('');
    try {
      await iniciarSesion(datos);
      navigate(location.state?.desde ?? '/', { replace: true });
    } catch (error) {
      setErrorGeneral(aplicarErroresApi(error, setError));
    }
  };

  return (
    <Tarjeta titulo="Iniciar sesión">
      <form onSubmit={handleSubmit(enviar)} noValidate className="space-y-4">
        {errorGeneral && <Alerta>{errorGeneral}</Alerta>}
        <CampoFormulario id="email" etiqueta="Email" type="email" error={errors.email?.message} {...register('email')} />
        <CampoFormulario
          id="password"
          etiqueta="Contraseña"
          type="password"
          error={errors.password?.message}
          {...register('password')}
        />
        <Boton type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Ingresando...' : 'Ingresar'}
        </Boton>
      </form>
      <p className="mt-6 text-center text-sm text-slate-600">
        ¿No tienes cuenta?{' '}
        <Link to="/registro" className="font-medium text-indigo-600 hover:underline">
          Regístrate
        </Link>
      </p>
    </Tarjeta>
  );
};

export default Login;
