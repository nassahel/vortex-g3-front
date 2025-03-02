import { FormuData } from '@/types/types';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';

interface Props {
    setModal: (value: boolean) => void;
}

const AddEditProductModal: React.FC<Props> = ({ setModal }) => {
    const [categories, setCategories] = useState([])
    const [formData, setFormData] = useState<FormuData>({
        name: '',
        description: '',
        images: [],
        price: '',
        stock: 0,
        categories: [],
    })
    const url = process.env.NEXT_PUBLIC_API_URL
    console.log(formData);


    const createProduct = async () => {
        const formDataToSend = new FormData();

        // Agregar los campos de texto
        formDataToSend.append('name', formData.name);
        formDataToSend.append('description', formData.description);
        formDataToSend.append('price', formData.price);
        formDataToSend.append('stock', String(formData.stock));

        // Agregar categorías (puedes enviar como un string JSON o como array, depende de cómo lo espera el backend)
        formDataToSend.append('categories', JSON.stringify(formData.categories));  // Ajusta si tu DTO espera algo diferente

        // Agregar archivos (imágenes)
        for (const image of formData.images) {
            formDataToSend.append('images', image);  // El backend espera 'images'
        }

        try {
            const response = await fetch(url + 'product/create-product', {
                method: 'POST',
                body: formDataToSend, // No mandes headers Content-Type, fetch lo asigna solo.
            });

            const data = await response.json();
            if (response.ok) {
                setFormData({
                    name: '',
                    description: '',
                    images: [],
                    price: '',
                    categories: [],
                    stock: 0
                });
                setModal(false);
                toast.success('Producto subido!')
            } else {
                console.error('Error:', data);
                toast.error('No se pudo crear el producto!')
            }
        } catch (error) {
            console.error(error);
            toast.error('No se pudo crear el producto!')
        }
    };

    const closeModal = () => {
        setModal(false)
    }

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(url + 'category/all');
                const data = await response.json();


                setCategories(data.data)
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
            <article className=' bg-white  w-11/12 h-[36rem] max-w-[30rem] rounded-md relative shadow py-6 px-10 z-50 flex flex-col items-center scale-up '>
                <h2 className='mb-6 '>Agregar Producto</h2>
                <div className='flex flex-col h-full w-full'>
                    <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} maxLength={50} className={inputStyle} type="text" name="nombre" placeholder='Nombre' />
                    <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} maxLength={120} className={`resize-none h-[5.5rem] ${inputStyle}`} name="description" placeholder='Descripción'></textarea>
                    <input
                        type="file"
                        multiple
                        onChange={(e) => {
                            const files = e.target.files ? Array.from(e.target.files) : [];
                            setFormData({ ...formData, images: files });
                        }}
                    />
                    <input value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} maxLength={6} max={100000} className="border-b bg-neutral-100 px-2 py-1 outline-none" type="string" name="price" placeholder='Precio' />
                    <p className='text-xs mb-6 ms-2'>Escribir los centavos con punto. Ej: 120.33</p>
                    <div className='grid grid-cols-3 mb-4'>
                        {
                            categories.map((item: { name: string, id: string }) => (
                                <div key={item.name} className='flex items-center gap-1 capitalize'>
                                    <input
                                        className='cursor-pointer'
                                        type="checkbox"
                                        id={item.name}
                                        value={item.id}
                                        checked={formData.categories.includes(item.id)}
                                        onChange={(e) => {
                                            const { value, checked } = e.target;

                                            setFormData((prev) => {
                                                const updatedCategories = checked
                                                    ? [...prev.categories, value]
                                                    : prev.categories.filter(cat => cat !== value);

                                                return { ...prev, categories: updatedCategories };
                                            });
                                        }}
                                    />
                                    <label className='cursor-pointer' htmlFor={item.name}>{item.name}</label>
                                </div>
                            ))

                        }
                    </div>

                    <label htmlFor="stock">Stock</label>
                    <input value={formData.stock} onChange={(e) => setFormData({
                        ...formData, stock: Number(e.target.value) // Convierte a número directamente si es un valor numérico
                    })} maxLength={6} max={100000} min={0} className="border-b bg-neutral-100 px-2 py-1 outline-none mb-6" type="number" name="stock" placeholder='Stock' />

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