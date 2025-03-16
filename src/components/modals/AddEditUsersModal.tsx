import React, { useState } from 'react';
import toast from 'react-hot-toast';

interface Props {
    setModal: (value: boolean) => void;
    isEditing: boolean;
    user?: User | null;
}

interface User {
    id?: string;
    name: string;
    rol: string;
    email: string;
    password?: string;
}

const AddEditUserModal: React.FC<Props> = ({ setModal, isEditing, user }) => {
    const [formData, setFormData] = useState<User>({
        name: isEditing && user?.name || '',
        rol: isEditing && user?.rol || '',
        email: isEditing && user?.email || '',
        password: ''
    });

    const url = process.env.NEXT_PUBLIC_API_URL;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        const token = localStorage.getItem('token');
        const endpoint = isEditing
            ? `${url}users/${user?.id}`
            : `${url}users/`;

        const method = isEditing ? 'PATCH' : 'POST';
        console.log(formData);

        try {
            const response = await fetch(endpoint, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'lang': 'es'
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            console.log(data);

            if (response.ok) {
                toast.success(data.message || 'No se pudo actualizar');
                setModal(false);
            } else {
                toast.error(data.message || 'No se pudo actualizar');
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
                <select value={formData.rol} onChange={handleChange} name="rol" id="rol" className='w-full border p-2 mb-2' >
                    <option value="">Elegir Rol</option>
                    <option value="ADMIN">ADMIN</option>
                    <option value="USER">USER</option>
                </select>
                {
                    !isEditing && <input value={formData.password} onChange={handleChange} type="text" name='password' placeholder='Password' className='w-full border p-2 mb-2' />
                }
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
