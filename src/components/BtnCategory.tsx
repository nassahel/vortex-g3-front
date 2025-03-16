
"use client"
import Link from 'next/link'
import { useEffect, useState } from 'react';
import { IoIosArrowDown } from "react-icons/io";

export interface Category {
    id: string,
    name: string,
    subcategories?: Category[]
}

type Props = {
    setShowNav?: (value: boolean) => void
}


const BtnCategory = ({ setShowNav }: Props) => {
    const [modal, setModal] = useState<boolean>(false)
    const [categories, setCategories] = useState<Category[]>([])
    const URL = `${process.env.NEXT_PUBLIC_API_URL}category/`
    const [showCategories, setShowCategories] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${URL}all`);
                const data = await response.json();
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
        <>
            <div className='relative hidden md:block'>
                <Link href="" onMouseEnter={() => setModal(true)} onMouseLeave={() => setModal(false)} className='flex items-center gap-1'><span>Categorías</span> <div className='pt-1'><IoIosArrowDown className='text-xs text-neutral-500' /></div>  </Link>
                {
                    modal && <div onMouseEnter={() => setModal(true)} onMouseLeave={() => setModal(false)} className='cursor-pointer z-20 top-0 left-0 absolute pt-5'>
                        <div className='ms-[4.9rem] trinagle'></div>
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
            <div className='md:hidden'>
                <button className='flex gap-2 items-end' onClick={() => setShowCategories(!showCategories)}>Categorias <IoIosArrowDown className={`${showCategories ? 'rotate-180': ''} duration-200`} /></button>
                <div className={`${showCategories ? 'max-h-[40rem] ' : 'max-h-0 '}duration-500 overflow-hidden`}>
                    {
                        categories.map((item: any, i) => (
                            <button onClick={() => setShowNav && setShowNav(false)} key={i} className=''>
                                <Link href={`/category?id=${item.id}`} className=' w-full px-8 ' >
                                    -  {item.name}
                                </Link>
                            </button>
                        ))
                    }
                </div>
            </div>
        </>

    )
}

export default BtnCategory
