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


const BtnCategory = () => {
    const [modal, setModal] = useState<boolean>(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isMobile, setIsMobile] = useState<boolean>(false);

    const URL = `${process.env.NEXT_PUBLIC_API_URL}category/`;

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${URL}all`);
                const data = await response.json();
                setCategories(Array.isArray(data.data) ? data.data : []);
            } catch (error) {
                console.error('No se pudo obtener los datos', error);
                setCategories([]);
            }
        };

        fetchCategories();
        // Detectar si es un dispositivo móvil
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);
    
    const toggleModal = () => {
        setModal(prev => !prev);
    };

    return (
      <div className='relative'>
            <Link href="" 
                onMouseEnter={!isMobile ? () => setModal(true) : undefined} 
                onMouseLeave={!isMobile ? () => setModal(false) : undefined} 
                onClick={isMobile ? toggleModal : undefined} 
                className='flex items-center gap-1'>
                    <span>Categorías</span> 
                <div className='pt-1'><IoIosArrowDown className='text-xs text-neutral-500 mt-3' /></div>  
            </Link>
            {
                modal && <div 
                onMouseEnter={() => setModal(true)} onMouseLeave={() => setModal(false)} className='cursor-pointer z-20 top-0 left-0 absolute pt-5'>
                    <div className='ms-[4.9rem] mt-3 trinagle'></div>
                    <div className=' bg-zinc-800  text-white  rounded-md py-5 '>
                        <ul>
                            {
                                categories.map((item: any, i) => (
                                    <li key={i} className='w-[10rem] h-8 flex items-center  hover:bg-neutral-600 duration-200 cursor-pointer'>
                                        <Link href={`/category?id=${item.id}`} className=' w-full px-8 ' >
                                            {item.name}
                                        </Link>
                                    </li>
                                ))
                            }
                        </ul>

                    </div>
                </div>

            }
        </div>

    )
}

export default BtnCategory