import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface Props {
    setModal: (value: boolean) => void;
    isEditing: boolean;
    product: string;
}

interface FormDataType {
    name: string;
    description: string;
    price: string;
    stock: number;
    categories: string[];
}

const AddEditProductModal: React.FC<Props> = ({ setModal, isEditing, product }) => {
    const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
    const [formData, setFormData] = useState<FormDataType>({
        name: isEditing ? product.name : '',
        description: isEditing ? product.description : '',
        price: isEditing ? product.price : '',
        stock: isEditing ? product.stock : '',
        categories: isEditing ? product.categories : []
    });

    const url = process.env.NEXT_PUBLIC_API_URL;

    // Simulamos cargar un producto si es edición
    // 1. Cargar las categorías cuando se monta el componente
    useEffect(() => {
        fetchCategories();
    }, []);

    // 2. Cuando las categorías ya estén cargadas, inicializamos el formData en modo edición
    useEffect(() => {
        if (isEditing && product && product.categories && categories.length > 0) {
            const selectedCategoryIds = categories
                .filter(cat => product.categories.includes(cat.name)) // Comparar por nombre
                .map(cat => cat.id); // Obtener IDs

            setFormData(prev => ({
                ...prev,
                name: product.name,
                description: product.description,
                price: product.price,
                stock: product.stock,
                categories: selectedCategoryIds
            }));
        }
    }, [isEditing, product, categories]);


    const fetchCategories = async () => {
        try {
            const response = await fetch(`${url}category/all`);
            const data = await response.json();
            setCategories(data.data);
        } catch (error) {
            console.error('Error cargando categorías', error);
        }
    };

    const handleSubmit = async () => {
        const token = localStorage.getItem('token');

        const productData = {
            name: formData.name,
            description: formData.description,
            price: formData.price,
            stock: formData.stock,
            categories: formData.categories
        };

        console.log(productData);


        const endpoint = isEditing
            ? `${url}product/update/${product && product.id}`
            : `${url}product/create-product`;

        const method = isEditing ? 'PATCH' : 'POST';

        try {
            const response = await fetch(endpoint, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(productData)
            });

            console.log('respouesta', response);

            if (response.ok) {
                toast.success(isEditing ? 'Producto actualizado!' : 'Producto creado!');
                setModal(false);
            } else {
                toast.error('Error al guardar el producto');
            }
        } catch (error) {
            console.error('Error al guardar', error);
            toast.error('No se pudo guardar el producto');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCategoryChange = (id: string, checked: boolean) => {
        setFormData(prev => {
            const updatedCategories = checked
                ? [...prev.categories, id]
                : prev.categories.filter(cat => cat !== id);

            return { ...prev, categories: updatedCategories };
        });
    };

    return (
        <section className='fixed z-40 top-0 bottom-0 left-0 right-0 flex justify-center items-center'>
            <div onClick={() => setModal(false)} className='fixed z-40 top-0 bottom-0 left-0 right-0 bg-black/50'></div>
            <article className='bg-white w-11/12 max-w-[30rem] rounded-md relative shadow py-6 px-10 z-50'>
                <h2 className='mb-6'>{isEditing ? 'Editar Producto' : 'Agregar Producto'}</h2>
                <input name="name" value={formData.name} onChange={handleChange} className='mb-4 border px-2 py-1 w-full' placeholder='Nombre' />

                <textarea name="description" value={formData.description} onChange={handleChange} className='mb-4 border px-2 py-1 w-full' placeholder='Descripción' />

                <input name="price" value={formData.price} onChange={handleChange} className='mb-4 border px-2 py-1 w-full' placeholder='Precio' />

                <input type="number" name="stock" value={formData.stock} onChange={handleChange} className='mb-4 border px-2 py-1 w-full' placeholder='Stock' />

                <div className='grid grid-cols-3 gap-2 mb-4'>
                    {categories.map(cat => (
                        <label key={cat.id} className='flex items-center gap-2'>
                            <input
                                type="checkbox"
                                checked={formData.categories.includes(cat.id)}
                                onChange={(e) => handleCategoryChange(cat.id, e.target.checked)}
                            />
                            {cat.name}
                        </label>
                    ))}
                </div>

                <div className='flex justify-end gap-2'>
                    <button onClick={handleSubmit} className='bg-blue-500 text-white px-4 py-2 rounded'>
                        {isEditing ? 'Actualizar' : 'Guardar'}
                    </button>
                    <button onClick={() => setModal(false)} className='bg-gray-500 text-white px-4 py-2 rounded'>
                        Cancelar
                    </button>
                </div>
            </article>
        </section>
    );
};

export default AddEditProductModal;
