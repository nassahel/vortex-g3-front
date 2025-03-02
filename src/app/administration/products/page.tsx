"use client"
import AddEditProductModal from '@/components/modals/AddEditProductModal';
import { Product } from '@/types/types';
import React, { useEffect, useState } from 'react'
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
// import AddEditProductModal from '../modals/AddEditProductModal';
// import Swal from 'sweetalert2';
// import { sortData } from '../../utils/utils';


const page = () => {
    const [products, setProducts] = useState([])
    const [modal, setModal] = useState(false);
    const [productEdit, setProductEdit] = useState(null)
    const [modalEdit, setModalEdit] = useState(false)
    const [search, setSearch] = useState('')
    const [loading, setLoaing] = useState<boolean>(false);
    const URL = process.env.NEXT_PUBLIC_API_URL

    console.log(products);



    useEffect(() => {
        const fetchActiveProducts = async () => {
            try {
                setLoaing(true)
                const response = await fetch(URL + 'product/all');

                const data = await response.json();
                // console.log(data);

                setProducts(data.data)
                setLoaing(false)
            } catch (error) {
                console.error('No se pudo obtener los datos', error)
            }
        }
        fetchActiveProducts()
    }, [modal])

    const claseUlt = 'border h-full flex items-center justify-center w-1/3'

    return (
        <section className='relative'>
            {modal && <AddEditProductModal setModal={setModal} />}
            <div className='flex justify-between'>
                <input value={search} onChange={(e) => setSearch(e.target.value)} className='bg-white py-2 px-4 my-2  rounded-md border-2 border-neutral-400 outline-none w-[25rem]' type="search" name="searchProd" placeholder='Buscar productos...' />
                <button onClick={() => setModal(true)} className='bg-white py-2 px-4 my-2  rounded-md border-2 border-neutral-400 hover:border-black duration-200'>Agregar Producto</button>
            </div>
            <div>


                <section className='flex flex-col gap-1'>
                    <article className='bg-neutral-800 text-white text-center flex rounded-sm'>
                        <div className=' w-28 overflow-hidden border py-1'>
                            <p>Imagen</p>
                        </div>
                        <div className='flex grow justify-evenly items-center'>
                            <div className='flex h-full w-3/4'>
                                <p className=' text-center  h-full flex items-center justify-center w-1/3 border py-1'>Nombre</p>
                                <p className=' text-center  h-full flex items-center justify-center w-2/3 border py-1'>Descripción</p>
                            </div>
                            <div className='flex h-full w-1/4'>
                                <p className={claseUlt}>Categoría</p>
                                <p className={claseUlt + 'w-20'}>Precio</p>
                            </div>
                            <div className='w-20 flex text-2xl items-center justify-center gap-2'>
                                <FaEdit />
                                <RiDeleteBin6Line />
                            </div>
                        </div>
                    </article>

                    {
                        products.length !== 0 ? products.map((item: Product, i) => (
                            <article key={i} className='bg-white flex rounded-sm'>
                                <div className='h-20 w-28 overflow-hidden p-2'>
                                    <img src={item.images} alt={item.name} className='h-full object-cover' />
                                </div>
                                <div className='flex grow justify-evenly items-center'>
                                    <div className='flex h-full w-3/4'>
                                        <p className=' text-center border h-full flex items-center justify-center w-1/3'>{item.name}</p>
                                        <p className=' text-center border h-full flex items-center justify-center w-2/3'>{item.description}</p>
                                    </div>
                                    <div className='flex flex-col gap-1 h-full w-1/4'>
                                        {
                                            item.categories.map((item: string, i) => (
                                                <p key={i} className="border border-neutral-700 rounded-lg bg-white w-fit px-1">{item}</p>
                                            ))
                                        }
                                    <p className={claseUlt + 'w-20'}>${item.price}</p>
                                    </div>
                                    <div className='w-20 flex  text-2xl items-center justify-center px-2 gap-4'>
                                        <button><FaEdit className='' /></button>
                                        <button><RiDeleteBin6Line color='red' className='' /></button>
                                    </div>
                                </div>
                            </article>
                        ))
                            :
                            <p className='mt-6 text-lg'>No hay productos.</p>
                    }
                </section>
            </div>


        </section>
    )
}

export default page;