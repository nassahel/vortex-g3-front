import React, { useState } from 'react'
import toast from 'react-hot-toast';

interface Props {
    setDeleteModal: (value: boolean) => void;
    modalText: string;
    routeDelete: string;
    itemId: string | null
}


const DeleteModal: React.FC<Props> = ({ setDeleteModal, modalText, routeDelete, itemId }) => {
    const deleteProduct = async () => {
        const url = `${process.env.NEXT_PUBLIC_API_URL}${routeDelete}/${itemId}`
        const method = 'DELETE'
        const token = localStorage.getItem('token');
        if (!token) return console.log('No se pudo obtener el token');
        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
            })
            const data = await response.json()
            if (response.ok) {
                setDeleteModal(false)
                toast.success(data.message)
                return data
            } else {
                console.error('Error:', data);
                toast.error('No se pudo borrar el elemento')
                return data
            }
        } catch (error) {
            return console.error(error);
        }
    }


    const inputStyle = 'mb-6 border-b bg-neutral-100 px-2 py-1 outline-none';

    return (
        <section className='fixed z-40 top-0 bottom-0 left-0 right-0 flex justify-center items-center'>
            <div onClick={() => setDeleteModal(false)} className='fixed z-40 top-0 bottom-0 left-0 right-0 flex justify-center items-center bg-black/50 fade-in'></div>
            <article className=' bg-white min-h-4/6 rounded-md relative shadow py-6 px-10 z-50 flex flex-col items-center scale-up'>
                <p className='mb-10 text-lg font-semibold'>{modalText}</p>
                <div className='flex gap-10'>
                    <button onClick={deleteProduct} className='bg-blue-600 mt-auto rounded-lg w-[8rem] mx-auto py-1 text-white hover:bg-blue-500 duration-200'>Aceptar</button>
                    <button onClick={() => setDeleteModal(false)} className='bg-neutral-600 mt-auto rounded-lg w-[8rem] mx-auto py-1 text-white hover:bg-neutral-500 duration-200'>Cancelar</button>
                </div>
            </article>
        </section>
    )
}

export default DeleteModal