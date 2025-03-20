import { Categorie, Image} from '@/types/types';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface Props {
    setModal: (value: boolean) => void;
    isEditing: boolean;
    product?: Product | null;
}


interface Product {
      id?: string;
      images?: Image[];
      name?: string;
      price?: number;
      stock?: number;
      description?: string;
      categories?: string[];
    }


const AddEditProductModal: React.FC<Props> = ({ setModal, isEditing, product }) => {
    const [categories, setCategories] = useState<Categorie[]>([]);
    const [formData, setFormData] = useState<Product>({
        id: product?.id || '',
        images: product?.images || [],
        name: isEditing && product ? product.name : '',
        price: isEditing && product ? product.price : 0,
        description: isEditing && product ? product.description : '',
        stock: isEditing && product ? product.stock : 0,
        categories: isEditing && product ? product.categories : [],
    });

    const url = process.env.NEXT_PUBLIC_API_URL || '';

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        if (isEditing && product && categories.length > 0) {
            const selectedCategoryIds = categories
                .filter(cat => product.categories.includes(cat.name))
                .map(cat => cat.id);

            setFormData(prev => ({
                ...prev,
                name: product.name,
                description: product.description,
                price: product.price,
                stock: product.stock,
                categories: selectedCategoryIds,
            }));
        }
    }, [isEditing, product, categories]);

    const fetchCategories = async () => {
        try {
            const response = await fetch(`${url}/category/all`);
            const data = await response.json();
            setCategories(data.data);
        } catch (error) {
            console.error('Error cargando categorías', error);
        }
    };

    const handleSubmit = async () => {
        const token = localStorage.getItem('token');

        if (!token) {
            toast.error('No tienes una sesión activa.');
            return;
        }

        const productData = {
            name: formData.name,
            description: formData.description,
            price: formData.price,
            stock: formData.stock,
            categories: formData.categories,
        };

        const endpoint = isEditing && product?.id
            ? `${url}/product/update/${product.id}`
            : `${url}/product/create-product`;

        const method = isEditing ? 'PATCH' : 'POST';

        try {
            const response = await fetch(endpoint, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(productData),
            });

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
        <section className="fixed z-40 top-0 bottom-0 left-0 right-0 flex justify-center items-center">
            <div onClick={() => setModal(false)} className="fixed z-40 top-0 bottom-0 left-0 right-0 bg-black/50"></div>
            <article className="bg-white w-11/12 max-w-[30rem] rounded-md relative shadow py-6 px-10 z-50">
                <h2 className="mb-6 text-center font-bold">{isEditing ? 'Editar Producto' : 'Agregar Producto'}</h2>
                <label htmlFor="" className='font-semibold'>Nombre</label>
                <input name="name"  value={formData.name} onChange={handleChange} className="mb-4 border px-2 py-1 w-full" placeholder="Nombre" />
                <label htmlFor="" className='font-semibold'>Descripción</label>
                <textarea name="description" value={formData.description} onChange={handleChange} className="mb-4 border px-2 py-1 w-full" placeholder="Descripción" />
                <label htmlFor="" className='font-semibold'>Precio</label>
                <input name="price" value={formData.price} onChange={handleChange} className="mb-4 border px-2 py-1 w-full" placeholder="Precio" />
                <label htmlFor="" className='font-semibold'>Stock</label>
                <input type="number" name="stock" value={formData.stock} onChange={handleChange} className="mb-4 border px-2 py-1 w-full" placeholder="Stock" />
                <label htmlFor="" className='font-semibold'>Categorías</label>
                <div className="grid grid-cols-3 gap-2 mb-4">
                    {categories.map(cat => (
                        <label key={cat.id} className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={formData.categories.includes(cat.id)}
                                onChange={e => handleCategoryChange(cat.id, e.target.checked)}
                            />
                            {cat.name}
                        </label>
                    ))}
                </div>

                <div className="flex justify-end gap-2">
                    <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded">
                        {isEditing ? 'Actualizar' : 'Guardar'}
                    </button>
                    <button onClick={() => setModal(false)} className="bg-gray-500 text-white px-4 py-2 rounded">
                        Cancelar
                    </button>
                </div>
            </article>
        </section>
    );
};

export default AddEditProductModal;
