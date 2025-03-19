"use client";
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';

const PageContent = () => {
    const searchParams = useSearchParams();
    const token = searchParams.get('t');
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState<string>('');
    const [message, setMessage] = useState<string | null>(null); // Estado para mostrar mensajes
    const [error, setError] = useState<string | null>(null);     // Estado para mostrar errores
    const [isSuccess, setIsSuccess] = useState(false); // Estado para manejar el éxito

    const inputStyle: string = 'border rounded-lg py-2 px-4 outline-blue-600 mb-4';
    const labelStyle: string = '';

    const login = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);  // Limpiar mensaje previo
        setError(null);    // Limpiar error previo

        const URL = process.env.NEXT_PUBLIC_API_URL + 'auth/recovery-password';

        if (password === '') {
            setLoading(false);
            setError('La contraseña no puede estar vacía.');
            return;
        }

        try {
            const response = await fetch(URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: token,
                    newPassword: password,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Error al cambiar la contraseña`);
            }

            setIsSuccess(true);  // Si la contraseña se cambió con éxito, mostramos el mensaje de éxito
        } catch (error) {
            setError(error.message || 'No se pudo cambiar la contraseña.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="w-full max-w-md">
                {isSuccess ? (
                    // Mostrar mensaje de éxito y botón para ir al login
                    <div className="bg-white p-6 rounded-lg shadow-md text-center">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">¡Contraseña cambiada con éxito!</h2>
                        <p className="text-gray-600 mb-6">Tu contraseña ha sido cambiada correctamente. Puedes ir a iniciar sesión ahora.</p>
                        <Link href="/user/login" passHref>
                            <button className="bg-gray-800 hover:bg-gray-900 text-white font-semibold py-2 px-6 rounded-lg">
                                Ir al login
                            </button>
                        </Link>
                    </div>
                ) : (
                    // Mostrar formulario si no ha sido exitoso
                    <form onSubmit={login} className='bg-white p-6 rounded-lg shadow-md'>
                        <h2 className='text-center text-2xl font-semibold mb-4 text-gray-800'>Recuperar contraseña</h2>

                        {message && <p className="text-green-600 font-semibold mb-4">{message}</p>}
                        {error && <p className="text-red-600 font-semibold mb-4">{error}</p>}

                        <div className='flex flex-col mb-4'>
                            <label className={labelStyle} htmlFor="pass">Nueva contraseña</label>
                            <input
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={inputStyle}
                                type="password"
                                name="pass"
                                id="pass"
                                placeholder="Introduce tu nueva contraseña"
                            />
                        </div>

                        <button
                            type='submit'
                            className='bg-gray-600 hover:bg-gray-700 text-white text-lg font-semibold py-2 rounded-lg w-full'
                            disabled={loading}
                        >
                            {loading ? 'Enviando...' : 'Enviar'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

const Page = () => {
    return (
        <Suspense fallback={<div>Cargando...</div>}>
            <PageContent />
        </Suspense>
    );
};

export default Page;