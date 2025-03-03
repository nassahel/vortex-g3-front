"use client"
import useAppStore from '@/zustand/zustand';
import Link from 'next/link';
import { useState } from 'react'

interface FormData {
  email: string;
  password: string;
}

const page = () => {
  // const logUser = useAppStore((state: any) => state.setToken)
  const [loading, setLoading] = useState(false)
  const [errorType, setErrorType] = useState('')
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: ''
  })

  const inputStyle: string = 'border rounded-lg py-2 px-4 outline-blue-600 mb-4';
  const labelStyle: string = ''

  const login = async (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true)
    e.preventDefault()
    const URL = process.env.NEXT_PUBLIC_API_URL + 'auth/login'

    if (formData.email === '' || formData.password === '') {
      setLoading(false)
      return setErrorType('datosIncompletos')
    }

    try {
      const response = await fetch(URL, {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        console.log(response);
        throw new Error(`Error al obtener datos: ${response.status}`)

      }

      const data = await response.json()
      setLoading(false)
      // console.log(data);
      // localStorage.setItem('token', data.token)
      // logUser(data.token)
      localStorage.setItem('token', data.token);
      window.location.href = '/'
    } catch (error) {
      setLoading(false)
      console.error('Error al enviar los datos:', error);
    }
  }

  return (
    <div>
      <form onSubmit={login} className='flex flex-col bg-white px-6 py-6 w-[25rem] border rounded-lg'>
        <h2 className='text-center text-4xl font-semibold mb-4'>Iniciar sesión</h2>
        <label className={labelStyle} htmlFor="email">Email</label>
        <input value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className={inputStyle} type="text" name="email" id="email" />
        <label className={labelStyle} htmlFor="password">Contraseña</label>
        <input value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className={inputStyle} type="text" name="password" id="password" />
        <button type='submit' className='bg-neutral-500 hover:bg-neutral-700 duration-300 text-white text-lg font-semibold py-2 rounded-lg'>{loading ? 'Ingresando...' : 'Ingresar'}</button>
      </form>
      <div className='text-center'>
        <p>No tenés cuenta? <Link href="/user/register" className='font-semibold'>Registrarse</Link></p>
        <Link className='text-sm font-semibold' href=''>Olvide mi contraseña</Link>
      </div>
    </div>
  )
}

export default page