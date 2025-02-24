import { FormData } from '@/types/types';
import React, { useEffect, useState } from 'react'

interface Props {
    setModal: (value: boolean) => void;
}

const AddEditProductModal: React.FC<Props> = ({ setModal }) => {
    const [categories, setCategories] = useState([])
    const [formData, setFormData] = useState<FormData>({
        name: '',
        description: '',
        image: '',
        price: '',
        categoryId: '',
    })
    const url = process.env.NEXT_PUBLIC_API_URL


    const createProduct = async () => {
        try {
            const response = await fetch(url + 'products/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    description: formData.description,
                    image: formData.image,
                    price: formData.price ? Number(formData.price) : undefined,
                    categoryId: formData.categoryId,
                })
            })
            const data = await response.json()
            if (response.ok) {
                setFormData({ name: '', description: '', image: '', price: '', categoryId: '', })
                setModal(false)
                return data
            } else {
                console.error('Error:', data);
                return data
            }
        } catch (error) {
            return console.error(error);
        }
    }

    const closeModal = () => {
        setModal(false)
    }

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(url + 'categories/');
                const data = await response.json();
                setCategories(data)
            } catch (error) {
                console.error('No se pudo obtener los datos', error)
            }
        }
        fetchCategories()
    }, [])

    const inputStyle = 'mb-6 border-b bg-neutral-100 px-2 py-1 outline-none';

    return (
        <section className='fixed z-40 top-0 bottom-0 left-0 right-0 flex justify-center items-center'>
            <div onClick={closeModal} className='fixed z-40 top-0 bottom-0 left-0 right-0 flex justify-center items-center bg-black/50 fade-in'></div>
            <article className=' bg-white min-h-4/6 w-11/12 h-[36rem] max-w-[30rem] rounded-md relative shadow py-6 px-10 z-50 flex flex-col items-center scale-up '>
                <h2 className='mb-6 '>Agregar Producto</h2>
                <div className='flex flex-col h-full w-full'>
                    <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} maxLength={50} className={inputStyle} type="text" name="nombre" placeholder='Nombre' />
                    <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} maxLength={120} className={`resize-none h-[5.5rem] ${inputStyle}`} name="description" placeholder='Descripción'></textarea>
                    <input value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} maxLength={150} className={inputStyle} type="text" name="" id="" placeholder='Imagen' />
                    <input value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} maxLength={6} max={100000} className="border-b bg-neutral-100 px-2 py-1 outline-none" type="string" name="price" placeholder='Precio' />
                    <p className='text-xs mb-6 ms-2'>Escribir los centavos con punto. Ej: 120.33</p>
                    <select value={formData.categoryId} onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })} className={inputStyle} name="category" id="category" >
                        <option value="">Categoría</option>
                        {
                            categories.map((item: any, i) => (
                                <option key={i} value={item.id} >{item.name}</option>
                            ))
                        }

                    </select>
                    <div className='flex gap-4'>
                        <button onClick={createProduct} className='bg-neutral-800 mt-auto rounded-sm w-[8rem] mx-auto py-1 text-white hover:bg-neutral-700 duration-200'>Guardar</button>
                        <button onClick={closeModal} className='bg-neutral-600 mt-auto rounded-sm w-[8rem] mx-auto py-1 text-white hover:bg-neutral-500 duration-200'>Cancelar</button>
                    </div>

                </div>
            </article>
        </section >
    )
}

export default AddEditProductModal