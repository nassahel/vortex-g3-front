"use client"
import React, { useState } from 'react'
import toast from 'react-hot-toast';

interface Props {
    setModal: (value: boolean) => void;
    // setModalEdit: () => void;
    // productEdit: boolean;
    // modalEdit: boolean;
}

interface FormData {
    name: string;
}

// const AddEditProductModal: React.FC<Props> = ({ setModal, productEdit, modalEdit, setModalEdit }) => {
const AddCategoryModal: React.FC<Props> = ({ setModal }) => {
    const [formData, setFormData] = useState<FormData>({
        name: '',
    })

    const createCategory = async () => {
        const url = `${process.env.NEXT_PUBLIC_API_URL}category/new`
        const method = 'POST'
        // const token = localStorage.getItem('token');
        // if (!token) return console.log('No se pudo obtener el token');
        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,        //para creat la categoria en nest solo usamos name
                })
            })
            const data = await response.json()
            if (response.ok) {
                setFormData({ name: '' })
                setModal(false)
                toast.success(data.message);
                return data
            } else {
                console.error('Error:', data);
                return data
            }
        } catch (error) {
            toast.error('No se pudo crear categoria')
            return console.error(error);
        }
    }

    const closeModal = () => {
        setModal(false)
    }

    const inputStyle = 'mb-6 border-b bg-neutral-100 px-2 py-1 outline-none';

    return (
        <section className='fixed z-40 top-0 bottom-0 left-0 right-0 flex justify-center items-center'>
            <div 
                onClick={closeModal} 
                className='fixed z-40 top-0 bottom-0 left-0 right-0 flex justify-center items-center bg-black/50 fade-in'
            ></div>
            <article className=' bg-white min-h-4/6 w-11/12  max-w-[30rem] rounded-md relative shadow py-6 px-10 z-50 flex flex-col items-center scale-up'>
                <h2 className='mb-6 '>
                    Agregar Categoría
                </h2>
                <div className='flex flex-col h-full w-full'>
                    <input 
                        value={formData.name} 
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                        maxLength={50} 
                        className={inputStyle} 
                        type="text" 
                        name="nombre" 
                        placeholder='Nombre' 
                    />
                    <div className='flex gap-4'>
                        <button 
                            onClick={createCategory} 
                            className='bg-neutral-800 mt-auto rounded-sm w-[8rem] mx-auto py-1 text-white hover:bg-neutral-700 duration-200'
                        >
                            Guardar
                        </button>
                        <button 
                            onClick={closeModal} 
                            className='bg-neutral-600 mt-auto rounded-sm w-[8rem] mx-auto py-1 text-white hover:bg-neutral-500 duration-200'
                        >
                            Cancelar
                        </button>
                    </div>

                </div>
            </article>
        </section>
    )
}

export default AddCategoryModal