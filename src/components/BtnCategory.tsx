"use client"
import CategoryItem from '@/app/administration/categories/categoryTree';
import Link from 'next/link'
import { useEffect, useState } from 'react';
import { IoIosArrowDown } from "react-icons/io";

export interface Category {
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
            {/* Botón de categorías */}
            <button 
                onMouseEnter={!isMobile ? () => setModal(true) : undefined} 
                onMouseLeave={!isMobile ? () => setModal(false) : undefined} 
                onClick={isMobile ? toggleModal : undefined} 
                className='flex items-center gap-1 relative z-30' 
            >
                <span>Categorías</span> 
                <div className='pt-1'>
                    <IoIosArrowDown className='text-xs text-neutral-500' />
                </div>  
            </button>

            {/* Menú desplegable */}
            {modal && (
                <div 
                    onMouseEnter={!isMobile ? () => setModal(true) : undefined} 
                    onMouseLeave={!isMobile ? () => setModal(false) : undefined} 
                    
                >
                    <div className={`${isMobile ? "" : "ms-[4.9rem] trinagle"}`}></div>
                    <div className={`rounded-md m-3 py-3 ${isMobile ? "bg-white text-black shadow-md" : "bg-zinc-800 text-white"}`}>
                        <ul>
                            {categories.map((item, i) => (
                                <li key={i} 
                                    className={`w-full h-12 flex items-center justify-center cursor-pointer text-center 
                                        ${isMobile ? "text-black bg-white border-gray-200 hover:bg-gray-200 duration-200" : "hover:bg-neutral-600 duration-200"}
                                    `}
                                >
                                    <Link href={`/category?id=${item.id}`} className='w-full'>
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BtnCategory;
