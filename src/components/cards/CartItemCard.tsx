import { CartItem, Product } from '@/types/types'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { FaPlus, FaMinus } from "react-icons/fa6";

type Props = {
  item: CartItem
}

const CartItemCard = ({ item }: Props) => {
  const [prod, setProd] = useState<Product | null>(null)


  useEffect(() => {
    const getProductById = async () => {
      try {
        const URL = process.env.NEXT_PUBLIC_API_URL
        const response = await fetch(`${URL}products/${item.itemId}`)
        const data = await response.json();
        setProd(data);
      } catch (error) {
        console.log(error);
      }
    }
    getProductById()
  }, [])




  


  return (
    <article className='flex items-center border-t border-neutral-300 h-32'>
      <div className='w-32'>
        <img src="/img/default-product.webp" alt={prod?.name} className='w-full' />
      </div>
      <div className='grow flex flex-col gap-3 px-4 py-2'>
        <p>{prod?.name}</p>
        <button className='text-blue-600 text-sm font-semibold me-auto'>Eliminar</button>
      </div>
      <div className='flex justify-between items-center gap-3  me-10 w-32 border border-neutral-400 overflow-hidden rounded-lg'>
        <button className='py-2 px-3 hover:bg-neutral-100 duration-200'><FaMinus /></button>
        <p>{item.quantity}</p>
        <button className='py-2 px-3 hover:bg-neutral-100 duration-200'><FaPlus /></button>
      </div>
      <div className='w-32'>
        <p>${item.subtotal}</p>
      </div>
    </article>
  )
}

export default CartItemCard