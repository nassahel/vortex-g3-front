"use client"
import React, { useState } from 'react'
import { IoIosSearch } from "react-icons/io";
import { CiShoppingCart } from "react-icons/ci";
// import { GoBell } from "react-icons/go";
import Link from 'next/link';
import BtnCategory from './BtnCategory';
import useAppStore from '@/zustand/zustand';


type Props = {}

const Navbar = (props: Props) => {
    const items = useAppStore((state: any) => state.items)
    const [offerModal, setOfferModal] = useState(true)


    return (
        <div className=' border-b border-neutral-300 fixed top-0 w-full z-50 bg-white'>
            {
                offerModal && <div className='py-2 px-4 bg-black text-white text-center'>
                    <div className='max-w-[80rem] mx-auto text-sm flex items-center justify-center relative '>
                        <p>Registrate y obtené un 20% de descunto en tu primera orden. <Link className='underline' href="">Registrate ahora!</Link> </p>
                        <button onClick={() => setOfferModal(false)} className='absolute right-0 text-xl'>x</button>
                    </div>
                </div>
            }


            <div className='flex max-w-[80rem] min-w-[60rem] py-4 mx-auto gap-10'>
                <div>
                    <h2 className='text-4xl font-bold'>LuxShop</h2>
                </div>
                <div className='flex items-center justify-end gap-5'>
                    <BtnCategory />
                    <Link href="/administration/products">Administración</Link>
                    <Link href="">Favoritos</Link>
                </div>
                <div className='flex w-full h-12  items-center pe-2 rounded-full overflow-hidden bg-neutral-100 shadow-inner border'>
                    <div className='p-2 rounded-full m-1 duration-300 hover:bg-neutral-200 flex items-center'>
                        <button>
                            <IoIosSearch className='text-2xl text-neutral-400' />
                        </button>
                    </div>
                    <input type="search" name="" id="" placeholder='Buscar productos...' className='w-full h-full outline-none px-3 bg-neutral-100' />
                </div>

                <div className='flex items-center gap-4'>
                    {/* <button>
                        <GoBell className='text-xl' />
                        </button> */}
                    <Link href="/carrito" className='relative h-8 w-7 '>
                        {
                            items.length !== 0 && <p className='absolute top-[7px] left-[14px] text-xs'>{items.length}</p>
                        }

                        <CiShoppingCart className='text-3xl' />
                    </Link>
                    <Link href="/user/login">Ingresá</Link>
                </div>
            </div>

        </div>

    )
}

export default Navbar