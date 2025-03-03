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
                const response = await fetch(URL + 'category/all');
                const data = await response.json();
                console.log(data);

                setCategories(data.data)
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
                routeDelete='category/delete'
                modalText='Deseas borrar la categoria?'
                setDeleteModal={setDeleteModal} />}

            <div className='flex justify-between'>
                <input value={search} onChange={(e) => setSearch(e.target.value)} className='bg-white py-2 px-4 my-2  rounded-md border-2 border-neutral-400 outline-none w-[25rem]' type="search" name="searchProd" placeholder='Buscar productos...' />
                <button onClick={() => setModal(true)} className='bg-white py-2 px-4 my-2  rounded-md border-2 border-neutral-400 hover:border-black duration-200'>Agregar categoría</button>
            </div>
            <div>
                <section className='flex flex-col gap-1'>
                    <article className='bg-black text-white flex h-10 rounded-md w-full'>
                        <p className='px-4 flex items-center w-full py-1 border-e h-full '>Nombre</p>
                        <div className=' flex text-2xl items-center  justify-center'>
                            <button className='w-20 flex justify-center'><RiDeleteBin6Line /></button>
                        </div>
                    </article>
                    {
                        categories.length !== 0 ? categories.map((item: any, i) => (
                            <article key={i} className='bg-white flex h-10 rounded-md w-full'>
                                <p className='px-4 flex items-center w-full py-1 border-e h-full '>{item.name}</p>
                                <div className=' flex text-2xl items-center  justify-center '>
                                    <button className='text-red-500 w-20 flex justify-center items-center hover:bg-red-200 h-full' onClick={() => openModal(item.id)}><RiDeleteBin6Line /></button>
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