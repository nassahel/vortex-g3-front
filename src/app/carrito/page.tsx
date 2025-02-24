"use client"
import CartItemCard from '@/components/cards/CartItemCard'
import Navbar from '@/components/Navbar'
import { CartItem as CartItem } from '@/types/types'
import useAppStore from '@/zustand/zustand'
import React, { useEffect } from 'react'

const page = () => {
    const items = useAppStore((state: any) => state.items)


    // console.log(items);




    return (
        <div className='bg-neutral-100'>
            <Navbar />
            <div className='flex gap-6 max-w-[75rem] items-start  mx-auto py-4 my-10 '>
                <main className='w-full border  rounded-lg bg-white shadow-lg overflow-hidden'>
                    <div className='p-4 font-semibold text-lg'>
                        <p>Productos</p>
                    </div>
                    {
                        items.map((item: CartItem, i: number) => (
                            <CartItemCard key={i} item={item} />
                        ))
                    }
                </main>
                <aside className='border shadow-lg rounded-lg w-[30rem] bg-white'>
                    <div>
                        <h2 className='text-center py-3 font-semibold'>Resumen de compra</h2>
                    </div>
                    <div className='p-4 text-center'>
                        <p>$123300</p>
                    <button className='blue-btn w-full h-11 mt-6'>Terminar compra</button>
                    </div>
                    
                </aside>
            </div>

        </div>
    )
}

export default page