import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';

type DecodedToken = {
  userId: string;
  userRol: string;
  userName: string;
};

type ReqAuthProps = {
  allowedRoles: string[];
  children: React.ReactNode; 
};

const ReqAuth = ({ allowedRoles = [], children }: ReqAuthProps) => {
  const [isLoading, setIsLoading] = useState(true);  // Estado para controlar la carga
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/';
      setIsLoading(false); 
      return;
    }

    const user = jwtDecode<DecodedToken>(token);

    if (allowedRoles.length && !allowedRoles.includes(user.userRol)) {
      window.location.href = '/';
      setIsLoading(false); 
      return;
    }

    setIsAuthenticated(true); 
    setIsLoading(false);
  }, [allowedRoles]);

  if (isLoading) {
    return <div className='w-full h-screen flex items-center justify-center'>
      <img src="/img/spiner.gif" alt="" className='w-32' />
    </div>;
  }

  return <>{isAuthenticated ? children : null}</>;
};

export default ReqAuth;

