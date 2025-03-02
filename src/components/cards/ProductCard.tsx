import { MostBoughtProduct } from '@/types/types';
import Image from 'next/image';
import React from 'react'
import { PiHeartStraightThin, PiHeartStraightFill } from "react-icons/pi";

interface Props {
    item: MostBoughtProduct
}

const ProductCard = ({ item }: Props) => {
    const { description, image, quantity, name, price } = item


    return (
        <div className=' rounded-3xl w-[17rem] h-[30rem] group cursor-pointer bg-white hover:shadow-lg duration-200 mx-auto '>
            <figure className='h-[60%] border-b relative rounded-3xl overflow-hidden  duration-400'>
                {/* <div className={`${isFavorite ? 'inline' : 'hidden group-hover:inline'} absolute top-2 right-2 rounded-full p-1 bg-white text-xl text-blue-800 `}>
                    {
                        isFavorite ? <PiHeartStraightFill /> : <PiHeartStraightThin />
                    }
                </div> */}
                <Image width={637} height={582} src="/img/default-product.webp" alt={name} className='h-full mx-auto object-cover' />
            </figure>
            <div className='h-[40%] px-4 mt-2'>
                <p className='font-semibold text-lg'>{name}</p>
                <div>
                    {
                        item.quantity > 10 ? '⭐⭐⭐⭐⭐' :
                            item.quantity > 5 ? '⭐⭐⭐⭐' :
                                item.quantity > 3 ? '⭐⭐⭐' :
                                    '⭐'
                    }
                </div>
                <p className='text-2xl font-semibold'>${price}</p>
            </div>

        </div>
    )
}

export default ProductCard