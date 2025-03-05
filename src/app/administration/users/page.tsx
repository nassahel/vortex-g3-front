"use client"
import AddEditProductModal from '@/components/modals/AddEditProductModal';
import React, { useEffect, useState } from 'react'
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";

interface User {
    name: string;
    address: string;
    phone: string;
    rol: string;
    email: string;
    image?: string;  // Ahora puede ser opcional
}

const Page = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [modal, setModal] = useState(false);
    const [search, setSearch] = useState('');
    const URL = process.env.NEXT_PUBLIC_API_URL;

    const defaultImage = '/img/default-profile.jpg';

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${URL}users/admin/all`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                setUsers(data.data);
            } catch (error) {
                console.error('No se pudo obtener los datos', error);
            }
        }
        fetchUsers();
    }, [modal]);

    const commonStyle = 'py-2 px-3 border-b border-neutral-300';

    return (
        <section className='relative'>
            {modal && <AddEditProductModal setModal={setModal} />}
            <div className='flex justify-between'>
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className='bg-white py-2 px-4 my-2 rounded-md border-2 border-neutral-400 outline-none w-[25rem]'
                    type="search"
                    placeholder='Buscar usuarios...'
                />
                <button
                    onClick={() => setModal(true)}
                    className='bg-white py-2 px-4 my-2 rounded-md border-2 border-neutral-400 hover:border-black duration-200'
                >
                    Agregar Usuario
                </button>
            </div>

            <div>
                <section className='flex flex-col gap-1'>
                    {/* Encabezado */}
                    <article className='bg-neutral-800 text-white text-center flex rounded-md overflow-hidden'>
                        <div className={`${commonStyle} w-1/12 font-semibold`}>Foto</div>
                        <div className={`${commonStyle} w-2/12 font-semibold`}>Nombre</div>
                        <div className={`${commonStyle} w-3/12 font-semibold`}>Email</div>
                        <div className={`${commonStyle} w-2/12 font-semibold`}>Dirección</div>
                        <div className={`${commonStyle} w-2/12 font-semibold`}>Teléfono</div>
                        <div className={`${commonStyle} w-1/12 font-semibold`}>Rol</div>
                        <div className={`${commonStyle} w-1/12 font-semibold`}>
                            Opciones
                        </div>
                    </article>

                    {/* Lista de usuarios */}
                    {users.length !== 0 ? (
                        users.map((item, i) => (
                            <article
                                key={i}
                                className='bg-white rounded-md border border-neutral-300 overflow-hidden flex flex-col'
                            >
                                {/* Datos principales en fila */}
                                <div className='flex'>
                                    <div className={`${commonStyle} w-1/12 flex items-center`}>
                                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-blue-500 shadow-md">
                                            <img
                                                src={item.image || defaultImage}
                                                alt={`Foto de ${item.name}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </div>
                                    <div className={`${commonStyle} w-2/12 flex items-center`}>
                                        <p className='truncate'>{item.name}</p>
                                    </div>
                                    <div className={`${commonStyle} w-3/12 flex items-center`}>
                                        <p className='truncate'>{item.email}</p>
                                    </div>
                                    <div className={`${commonStyle} w-2/12 flex items-center`}>
                                        <p className='truncate'>{item.address}</p>
                                    </div>
                                    <div className={`${commonStyle} w-2/12 flex items-center`}>
                                        <p className='truncate'>{item.phone}</p>
                                    </div>
                                    <div className={`${commonStyle} w-1/12 flex items-center`}>
                                        <p className='truncate'>{item.rol}</p>
                                    </div>
                                    <div className={`${commonStyle} w-1/12 flex items-center text-xl gap-4`}>
                                        <button><FaEdit /></button>
                                        <button><RiDeleteBin6Line color='red' /></button>
                                    </div>
                                </div>
                            </article>
                        ))
                    ) : (
                        <p className='mt-6 text-lg'>Cargando...</p>
                    )}
                </section>
            </div>
        </section>
    );
}

export default Page;
