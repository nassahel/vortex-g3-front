"use client"
import CategoryItem from '@/app/administration/categories/categoryTree';
import Link from 'next/link'
import { useEffect, useState } from 'react';
import { IoIosArrowDown } from "react-icons/io";

export interface Category{
    id: string,
    name: string,
    subcategories?: Category[]
}

type Props = {}

const BtnCategory = (props: Props) => {
    const [modal, setModal] = useState<boolean>(false)
    const [categories, setCategories] = useState<Category[]>([])
    const URL = `${process.env.NEXT_PUBLIC_API_URL}category/`

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${URL}all`);
                const data = await response.json();
                console.log("Categorías obtenidas:", data);
                setCategories(Array.isArray(data.data) ? data.data : [])
            } catch (error) {
                console.error('No se pudo obtener los datos', error)
                setCategories([]);
            }
        }
        fetchCategories()
    }, [])

    const toggleModal = () => {
        setModal(prev => !prev);
    }

    return (
        <div className='relative'>
            <Link 
                href="" 
                onMouseEnter={() =>setModal(true) } 
                onClick={(e) => e.stopPropagation()}
                className='flex items-center gap-1'
            >
                <span>Categorías</span> 
                <div className='pt-1'>
                    <IoIosArrowDown className='text-xs text-neutral-500' />
                </div>  
            </Link>
            {modal && (
                <div 
                  onMouseEnter={() => setModal(true)} 
                  onMouseLeave={() => setModal(false)} 
                  className="absolute mt-10"
                >
                    <div className='ms-[4.9rem] trinagle'></div>
                     <div className='bg-zinc-800 text-white rounded-md py-5  pr-5 -mt-5 left-1/2 transform -translate-x-1/2 absolute'>
                        {categories?.map(category => (
                            <CategoryItem key={category.id} category={category} />
                        ))}
                    </div> 
                </div>
            )}
        </div>

    )
}

export default BtnCategory