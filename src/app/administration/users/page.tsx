"use client"
import AddEditProductModal from '@/components/modals/AddEditProductModal';
import { Product } from '@/content/products';
import React, { useEffect, useState } from 'react'
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
// import AddEditProductModal from '../modals/AddEditProductModal';
// import Swal from 'sweetalert2';
// import { sortData } from '../../utils/utils';

interface User {
    name: string;
    address: string;
    phone: string;
    rol: string;
    email: string;
    image: string
}

const page = () => {
    const [users, setUsers] = useState([])
    const [modal, setModal] = useState(false);
    const [productEdit, setProductEdit] = useState(null)
    const [modalEdit, setModalEdit] = useState(false)
    const [search, setSearch] = useState('')
    const URL = process.env.NEXT_PUBLIC_API_URL

    console.log(users);


    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(URL + 'users/');
                const data = await response.json();
                setUsers(data)
            } catch (error) {
                console.error('No se pudo obtener los datos', error)
            }
        }
        fetchUsers()
    }, [modal])

    const claseUlt = ' text-center  grow border-e py-1 w-[10rem] flex items-center px-2'
    const defaultImage = '/img/default-profile.jpg'

    return (
        <section className='relative'>
            {modal && <AddEditProductModal setModal={setModal} />}
            <div className='flex justify-between'>
                <input value={search} onChange={(e) => setSearch(e.target.value)} className='bg-white py-2 px-4 my-2  rounded-md border-2 border-neutral-400 outline-none w-[25rem]' type="search" name="searchProd" placeholder='Buscar productos...' />
                <button onClick={() => setModal(true)} className='bg-white py-2 px-4 my-2  rounded-md border-2 border-neutral-400 hover:border-black duration-200'>Agregar Producto</button>
            </div>
            <div>
                <section className='flex flex-col gap-1'>
                    <article className='bg-neutral-800 text-white text-center flex rounded-sm overflow-hidden'>
                        <p className='w-10'></p>
                        <p className={claseUlt}>Nombre</p>
                        <p className={claseUlt}>Email</p>
                        <p className={claseUlt}>Direccion</p>
                        <p className={claseUlt}>Telefono</p>
                        <p className={claseUlt}>Rol</p>
                        <div className='w-20 flex text-2xl items-center justify-center gap-2 px-2'>
                            <FaEdit />
                            <RiDeleteBin6Line />
                        </div>
                    </article>
                    {
                        users.length !== 0 ? users.map((item: User, i) => (
                            // resultMenus.map((menu, i) => (
                            <article key={i} className='bg-white flex rounded-sm'>
                                <img src={item.image === '' ? defaultImage : item.image} alt={item.name} className='h-full object-cover w-10' />
                                <p className={claseUlt}>{item.name}</p>
                                <p className={claseUlt}>{item.email}</p>
                                <p className={claseUlt}>{item.address}</p>
                                <p className={claseUlt}>{item.phone}</p>
                                <p className={claseUlt}>{item.rol}</p>
                                <div className='w-20 flex text-2xl items-center justify-around gap-4 px-2'>
                                    <button><FaEdit className='' /></button>
                                    <button><RiDeleteBin6Line color='red' className='' /></button>
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