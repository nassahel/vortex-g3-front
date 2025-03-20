"use client"
import { useState } from 'react'
import Link from 'next/link'

const RequestPasswordRecoveryPage = () => {
    const [email, setEmail] = useState<string>('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [isSuccess, setIsSuccess] = useState(false) // Estado para mostrar el mensaje de éxito

    const inputStyle: string = 'border border-gray-300 rounded-lg py-2 px-4 outline-none mb-4 focus:ring-2 focus:ring-gray-600';
    const labelStyle: string = 'text-gray-700 font-semibold mb-2';

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setMessage(null)
        setError(null)

        const URL = process.env.NEXT_PUBLIC_API_URL + '/auth/request-recovery-password'

        if (email.trim() === '') {
            setLoading(false)
            setError('El email no puede estar vacío.')
            return
        }

        try {
            const response = await fetch(URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email })
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || 'No se pudo enviar la solicitud.')
            }

            setIsSuccess(true) // Si la solicitud fue exitosa, mostramos el mensaje de éxito
        } catch (error) {
            setError(error.message || 'Error al enviar la solicitud.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="w-full max-w-md">
                {isSuccess ? (
                    // Mostrar mensaje de éxito y el botón para ir al inicio
                    <div className="bg-white p-6 rounded-lg shadow-md text-center">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">¡Recuperación de contraseña exitosa!</h2>
                        <p className="text-gray-600 mb-6">Te hemos enviado un correo con las instrucciones para recuperar tu contraseña.</p>
                        <Link href="/" passHref>
                            <button className="bg-gray-800 hover:bg-gray-900 text-white font-semibold py-2 px-6 rounded-lg">
                                Volver al inicio
                            </button>
                        </Link>
                    </div>
                ) : (
                    // Mostrar formulario si no ha sido exitoso
                    <form onSubmit={handleSubmit} className='bg-white p-6 rounded-lg shadow-md'>
                        <h2 className='text-center text-2xl font-semibold mb-4 text-gray-800'>Recuperar contraseña</h2>

                        {message && <p className="text-green-600 font-semibold mb-4">{message}</p>}
                        {error && <p className="text-red-600 font-semibold mb-4">{error}</p>}

                        <div className='flex flex-col mb-4'>
                            <label className={labelStyle} htmlFor="email">Correo electrónico</label>
                            <input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={inputStyle}
                                type="email"
                                name="email"
                                id="email"
                                placeholder="Introduce tu email"
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
    )
}

export default RequestPasswordRecoveryPage
