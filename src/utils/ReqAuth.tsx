import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';

type DecodedToken = {
  userId: string;
  userRol: string;
  userName: string;
  exp: number; 
};

type ReqAuthProps = {
  allowedRoles: string[];
  children: React.ReactNode;
};

const ReqAuth = ({ allowedRoles = [], children }: ReqAuthProps) => {
  const [isLoading, setIsLoading] = useState(true); 
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      window.location.href = '/';
      setIsLoading(false);
      return;
    }

    try {
      const user = jwtDecode<DecodedToken>(token);
      const currentTime = Date.now() / 1000; 

      if (user.exp < currentTime) {
        localStorage.removeItem('token');
        window.location.href = '/';
        setIsLoading(false);
        return;
      }

          if (allowedRoles.length && !allowedRoles.includes(user.userRol)) {
        window.location.href = '/';
        setIsLoading(false);
        return;
      }

      setIsAuthenticated(true);
    } catch (error) {
      console.error("Error al decodificar el token:", error);
      window.location.href = '/';
    }

    setIsLoading(false);
  }, [allowedRoles]);

  if (isLoading) {
    return (
      <div className='w-full h-screen flex items-center justify-center'>
        <img src="/img/spiner.gif" alt="" className='w-32' />
      </div>
    );
  }

  return <>{isAuthenticated ? children : null}</>;
};

export default ReqAuth;
