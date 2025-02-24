import { Product } from '@/types/types';
import Image from 'next/image';
import React from 'react'
import { PiHeartStraightThin, PiHeartStraightFill } from "react-icons/pi";

interface Props {
    item: Product
}

const ProductCard = ({ item }: Props) => {
    const { description, image, isFavorite, name, price } = item


    return (
        <div className=' border rounded-md w-[17rem] h-[30rem] group cursor-pointer bg-white shadow-sm hover:shadow-lg duration-200 mx-auto '>
            <figure className='h-[60%] border-b relative  duration-400 p-2'>
                <div className={`${isFavorite ? 'inline' : 'hidden group-hover:inline'} absolute top-2 right-2 rounded-full p-1 bg-white text-xl text-blue-800 `}>
                    {
                        isFavorite ? <PiHeartStraightFill /> : <PiHeartStraightThin />
                    }
                </div>
                <Image width={637} height={582}  src="/img/default-product.webp" alt={name} className='h-full mx-auto object-cover' />
            </figure>
            <div className='h-[40%] p-4'>
                <p className='font-semibold'>{name}</p>
                <p className='text-sm mb-6'>{description}</p>
                <p className='text-xl font-semibold'>${price}</p>
            </div>

        </div>
    )
}

export default ProductCard