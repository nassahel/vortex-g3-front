import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface Props {
    setModal: (value: boolean) => void;
    isEditing: boolean;
    user?: User;
}

interface User {
    id?: string;
    name: string;
    address: string;
    phone: string;
    rol: string;
    email: string;
    image?: string;
}

const AddEditUserModal: React.FC<Props> = ({ setModal, isEditing, user }) => {
    const [formData, setFormData] = useState<User>({
        name: isEditing ? user?.name : '',
        address: isEditing ? user?.address : '',
        phone: isEditing ? user?.phone : '',
        rol: isEditing ? user?.rol : '',
        email: isEditing ? user?.email : '',
        image: isEditing ? user?.image : '',
    });

    const url = process.env.NEXT_PUBLIC_API_URL;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        const token = localStorage.getItem('token');
        const endpoint = isEditing
            ? `${url}users/${user?.id}`
            : `${url}users/`;

        const method = isEditing ? 'PATCH' : 'POST';

        try {
            const response = await fetch(endpoint, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData),
            });

            console.log(response);
            
            if (response.ok) {
                toast.success(isEditing ? 'Usuario actualizado!' : 'Usuario creado!');
                setModal(false);
            } else {
                toast.error('Error al guardar el usuario');
            }
        } catch (error) {
            console.error('Error al guardar el usuario', error);
            toast.error('No se pudo guardar el usuario');
        }
    };

    return (
        <section className='fixed z-50 inset-0 flex justify-center items-center bg-black/50'>
            <div className='bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-lg'>
                <h2 className='text-xl font-bold mb-4'>{isEditing ? 'Editar Usuario' : 'Agregar Usuario'}</h2>

                <input name="name" value={formData.name} onChange={handleChange} placeholder="Nombre" className='w-full border p-2 mb-2' />
                <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" className='w-full border p-2 mb-2' />
                <input name="address" value={formData.address} onChange={handleChange} placeholder="Dirección" className='w-full border p-2 mb-2' />
                <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Teléfono" className='w-full border p-2 mb-2' />
                <input name="rol" value={formData.rol} onChange={handleChange} placeholder="Rol" className='w-full border p-2 mb-2' />
                <input name="image" value={formData.image} onChange={handleChange} placeholder="URL de la imagen" className='w-full border p-2 mb-4' />

                <div className='flex justify-end gap-2'>
                    <button onClick={handleSubmit} className='bg-blue-600 text-white px-4 py-2 rounded'>
                        {isEditing ? 'Actualizar' : 'Guardar'}
                    </button>
                    <button onClick={() => setModal(false)} className='bg-gray-400 text-white px-4 py-2 rounded'>
                        Cancelar
                    </button>
                </div>
            </div>
        </section>
    );
};

export default AddEditUserModal;
