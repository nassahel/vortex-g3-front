import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';

type DecodedToken = {
  userId: string;
  userRol: string;
  userName: string;
};

type ReqAuthProps = {
  allowedRoles: string[];
  children: React.ReactNode;  // Definir el tipo de children correctamente
};

const ReqAuth = ({ allowedRoles = [], children }: ReqAuthProps) => {
  const [isLoading, setIsLoading] = useState(true);  // Estado para controlar la carga
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/';
      setIsLoading(false);  // Finaliza la carga
      return;
    }

    const user = jwtDecode<DecodedToken>(token);

    if (allowedRoles.length && !allowedRoles.includes(user.userRol)) {
      window.location.href = '/';
      setIsLoading(false);  // Finaliza la carga
      return;
    }

    setIsAuthenticated(true);  // Usuario autenticado con el rol adecuado
    setIsLoading(false);  // Finaliza la carga
  }, [allowedRoles]);

  if (isLoading) {
    // Mientras se verifica la autenticación, no renderices nada (puedes mostrar un spinner)
    return <div className='w-full h-screen flex items-center justify-center'>
      <img src="/img/spiner.gif" alt="" className='w-36' />
    </div>;
  }

  // Si está autenticado, renderiza el contenido
  return <>{isAuthenticated ? children : null}</>;
};

export default ReqAuth;

