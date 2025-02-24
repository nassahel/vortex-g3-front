"use client"
import AddCategoryModal from '@/components/modals/AddCategoryModal';
import AddEditProductModal from '@/components/modals/AddEditProductModal';
import DeleteModal from '@/components/modals/DeleteModal';
import React, { useEffect, useState } from 'react'
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
// import AddEditProductModal from '../modals/AddEditProductModal';
// import Swal from 'sweetalert2';
// import { sortData } from '../../utils/utils';


const page = () => {
    const [categories, setCategories] = useState([])
    const [modal, setModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false)
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const [productEdit, setProductEdit] = useState(null)
    const [modalEdit, setModalEdit] = useState(false)
    const [search, setSearch] = useState('')
    const URL = process.env.NEXT_PUBLIC_API_URL

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(URL + 'categories');
                const data = await response.json();
                setCategories(data)
            } catch (error) {
                console.error('No se pudo obtener los datos', error)
            }
        }
        fetchCategories()
    }, [modal, deleteModal])

    const claseUlt = 'border h-full flex items-center justify-center w-1/3'



    const openModal = (id: string) => {
        setSelectedId(id)
        setDeleteModal(true)
    }



    return (
        <section className='relative'>
            {modal && <AddCategoryModal setModal={setModal} />}
            {deleteModal && <DeleteModal
                itemId={selectedId}
                routeDelete='categories'
                modalText='Deseas borrar la categoria?'
                setDeleteModal={setDeleteModal} />}

            <div className='flex justify-between'>
                <input value={search} onChange={(e) => setSearch(e.target.value)} className='bg-white py-2 px-4 my-2  rounded-md border-2 border-neutral-400 outline-none w-[25rem]' type="search" name="searchProd" placeholder='Buscar productos...' />
                <button onClick={() => setModal(true)} className='bg-white py-2 px-4 my-2  rounded-md border-2 border-neutral-400 hover:border-black duration-200'>Agregar categoría</button>
            </div>
            <div>
                <section className='flex flex-col gap-1'>
                    <article className='bg-neutral-800 text-white text-center flex rounded-sm'>

                        <div className='flex grow justify-evenly items-center'>
                            <div className='flex h-full w-3/4'>
                                <p className=' text-center  h-full flex items-center justify-center w-1/3 border py-1'>Nombre</p>
                                <p className=' text-center  h-full flex items-center justify-center w-2/3 border py-1'>Descripción</p>
                            </div>

                            <div className='w-20 flex text-2xl items-center justify-center gap-2'>
                                <FaEdit />
                                <RiDeleteBin6Line />
                            </div>
                        </div>
                    </article>
                    {
                        categories.length !== 0 ? categories.map((item: any, i) => (
                            <article key={i} className='bg-white flex h-8 rounded-sm w-full'>
                                <div className='flex grow h-full'>
                                    <p className=' text-center w-[10rem] py-1 border-e h-full flex items-center justify-center '>{item.name}</p>
                                    <p className=' text-center border-e h-full grow px-4 py-1 flex items-center  '>{item.description}</p>
                                </div>
                                <div className=' flex text-2xl items-center  justify-center gap-2 px-2'>
                                    <button ><FaEdit /></button>
                                    <button className='text-red-500' onClick={() => openModal(item.id)}><RiDeleteBin6Line /></button>
                                </div>
                            </article>
                        ))
                            :
                            <p className='mt-6 text-lg'>Cargando...</p>
                    }
                </section>
            </div>


        </section>
    )
}

export default page;