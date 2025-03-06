"use client"

import AddEditUserModal from '@/components/modals/AddEditUsersModal';
import React, { useEffect, useState } from 'react'
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";

interface User {
    id: string;
    name: string;
    address: string;
    phone: string;
    rol: string;
    email: string;
    image?: string;
}

const Page = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [modal, setModal] = useState(false);
    const [search, setSearch] = useState('');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const URL = process.env.NEXT_PUBLIC_API_URL;

    const defaultImage = '/img/default-profile.jpg';

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
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const openAddModal = () => {
        setSelectedUser(null);
        setModal(true);
    };

    const openEditModal = (user: User) => {
        setSelectedUser(user);
        setModal(true);
    };

    const deleteUser = async (id: string) => {
        const token = localStorage.getItem('token');
        if (!confirm('¿Seguro que deseas eliminar este usuario?')) return;

        try {
            const response = await fetch(`${URL}users/delete/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                fetchUsers();
            } else {
                console.error('Error al eliminar');
            }
        } catch (error) {
            console.error('Error de red', error);
        }
    };

    const commonStyle = 'py-2 px-3 border-b border-neutral-300';

    return (
        <section className='relative'>
            {modal && (
                <AddEditUserModal
                    setModal={setModal}
                    initialData={selectedUser}
                    refreshUsers={fetchUsers}
                />
            )}

            <div className='flex justify-between'>
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className='bg-white py-2 px-4 my-2 rounded-md border-2 border-neutral-400 outline-none w-[25rem]'
                    type="search"
                    placeholder='Buscar usuarios...'
                />
                <button
                    onClick={openAddModal}
                    className='bg-white py-2 px-4 my-2 rounded-md border-2 border-neutral-400 hover:border-black duration-200'
                >
                    Agregar Usuario
                </button>
            </div>

            <div>
                <section className='flex flex-col gap-1'>
                    <article className='bg-neutral-800 text-white text-center flex rounded-md overflow-hidden'>
                        <div className={`${commonStyle} w-1/12 font-semibold`}>Foto</div>
                        <div className={`${commonStyle} w-2/12 font-semibold`}>Nombre</div>
                        <div className={`${commonStyle} w-3/12 font-semibold`}>Email</div>
                        <div className={`${commonStyle} w-2/12 font-semibold`}>Dirección</div>
                        <div className={`${commonStyle} w-2/12 font-semibold`}>Teléfono</div>
                        <div className={`${commonStyle} w-1/12 font-semibold`}>Rol</div>
                        <div className={`${commonStyle} w-1/12 font-semibold`}>Opciones</div>
                    </article>

                    {users.map((user, i) => (
                        <article key={i} className='bg-white flex'>
                            <div className={`${commonStyle} w-1/12`}>
                                <img src={user.image || defaultImage} className='w-12 h-12 rounded-full' />
                            </div>
                            <div className={`${commonStyle} w-2/12`}>{user.name}</div>
                            <div className={`${commonStyle} w-3/12`}>{user.email}</div>
                            <div className='flex w-1/12 gap-2'>
                                <button onClick={() => openEditModal(user)}><FaEdit /></button>
                                <button onClick={() => deleteUser(user.id)}><RiDeleteBin6Line color='red' /></button>
                            </div>
                        </article>
                    ))}
                </section>
            </div>
        </section>
    );
};

export default Page;
