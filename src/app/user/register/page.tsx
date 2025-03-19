"use client"
import Link from 'next/link';
import React, { useState } from 'react'
import toast from 'react-hot-toast';




const Page = () => {
  const [proccess, setProccess] = useState<boolean>(false);
  const URL = process.env.NEXT_PUBLIC_API_URL
  const [errors, setErrors] = useState([]);


  const sendData = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget;
    const formData = new FormData(form)
    const name = formData.get('name');
    const email = formData.get('email')
    const password = formData.get('password');
    const repeatPassword = formData.get('rePassword');



    toast.promise((async () => {
      try {
        setProccess(true);
        const response = await fetch(`${URL}auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password, repeatPassword }),
        });

        const responseData = await response.json();

        if (!response.ok) {
          setProccess(false);

          if (responseData.errorMessages) {
            setErrors(responseData.errorMessages);
          } else if (responseData.message) {
            setErrors([responseData.message]);
          }

          // Lanzamos el error para que toast lo detecte
          throw new Error(responseData.message || 'No se pudo registrar usuario.');
        }

        form.reset();
        setProccess(false);
        window.location.href = '/user/login';
        return responseData;

      } catch (error) {
        throw error; // Esto es necesario para que toast capture el error
      }
    })(), {
      loading: 'Guardando...',
      success: 'Usuario registrado!',
      error: (error) => error.message || 'No se pudo registrar usuario.'
    });
  }




  const inputStyle: string = 'border rounded-lg py-2 px-4 outline-blue-600 mb-4';
  const labelStyle: string = ''

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4">
      <form
        onSubmit={sendData}
        className="flex flex-col bg-white px-6 py-6 w-full max-w-[25rem] border rounded-lg"
      >
        <h2 className="text-center text-4xl font-semibold mb-4">Registrarse</h2>

        <label className={labelStyle} htmlFor="name">Nombre</label>
        <input className={inputStyle} type="text" name="name" id="name" />

        <label className={labelStyle} htmlFor="email">Email</label>
        <input className={inputStyle} type="text" name="email" id="email" />

        <label className={labelStyle} htmlFor="password">Contraseña</label>
        <input className={inputStyle} type="text" name="password" id="password" />

        <label className={labelStyle} htmlFor="rePassword">Repetir contraseña</label>
        <input className={inputStyle} type="text" name="rePassword" id="rePassword" />

        <button
          disabled={proccess}
          type="submit"
          className="bg-neutral-500 hover:bg-neutral-700 duration-300 text-white text-lg font-semibold py-2 rounded-lg"
        >
          {proccess ? 'Registrando...' : 'Aceptar'}
        </button>
        {
          errors.map((error, i) => (
            <p className='text-sm text-center text-red-600' key={i}>{error}</p>
          ))
        }
      </form>

      <div className="text-center mt-4">
        <p>Ya tenés cuenta? <Link href="/user/login" className="font-bold">Iniciar sesión</Link></p>
      </div>
    </div>
  );

}

export default Page