"use client"
import Link from 'next/link';
import React, { useState } from 'react'
import toast from 'react-hot-toast';

type Props = {}


const page = (props: Props) => {
  const URL = process.env.NEXT_PUBLIC_API_URL


  const sendData = async (e: any) => {
    e.preventDefault()

    const form = e.currentTarget;

    const formData = new FormData(form)
    const name = formData.get('name');
    const email = formData.get('email')
    const address = formData.get('address');
    const phone = formData.get('phone');
    const password = formData.get('password');



    toast.promise((async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, address, phone, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error desconocido');
      }

      const responseData = await response.json();
      form.reset(); // Limpia el formulario
      return responseData;
    })(), {
      loading: 'Guardando...',
      success: 'Usuario registrado!',
      error: 'No se pudo registrar usuario.'
    })

    // try {
    //   const response = await fetch(URL + 'auth', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({ name, email, address, phone, password })
    //   })

    //   if (!response.ok) return toast.error('No se pudo enviar 1'), console.log(response);
    //   const responseData = await response.json();
    //   toast.success(responseData.message)
    //   return console.log(responseData);

    // } catch (error) {
    //   toast.error('no se pudo enviar 2')
    //   console.log(error);

    // }
  }



  const inputStyle: string = 'border rounded-lg py-2 px-4 outline-blue-600 mb-4';
  const labelStyle: string = ''

  return (
    <div>
      <form onSubmit={sendData} action="" className='flex flex-col bg-white px-6 py-6 w-[25rem] border rounded-lg'>
        <h2 className='text-center text-4xl font-semibold mb-4'>Registrarse</h2>
        <label className={labelStyle} htmlFor="name">Nombre</label>
        <input className={inputStyle} type="text" name="name" id="name" />

        <label className={labelStyle} htmlFor="email">Email</label>
        <input className={inputStyle} type="text" name="email" id="email" />

        <label className={labelStyle} htmlFor="address">Dirección</label>
        <input className={inputStyle} type="text" name="address" id="address" />

        <label className={labelStyle} htmlFor="phone">Teléfono</label>
        <input className={inputStyle} type="text" name="phone" id="phone" />

        <label className={labelStyle} htmlFor="password">Contraseña</label>
        <input className={inputStyle} type="text" name="password" id="password" />

        <button type='submit' className='bg-blue-600 text-white text-lg font-semibold py-2 rounded-lg'>Aceptar</button>
      </form>
      <div className='text-center'>
        <p>Ya tenés cuenta? <Link href="/user/login" className='text-blue-600'>Iniciar sesión</Link></p>
      </div>
    </div>
  )
}

export default page