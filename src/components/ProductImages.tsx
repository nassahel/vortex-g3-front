"use client"
import React, { useState } from 'react'

type Props = {}


const images = [
    "/img/default-product.webp",
    "/img/default-profile.webp",
    "/img/default-product.webp",
    "/img/default-profile.webp",
]


const ProductImages = (props: Props) => {
    const [selectedImg, setSelectedImg] = useState(0)

    return (
        <div className='flex gap-2'>
            <div className='flex flex-col gap-2'>
                {
                    images.map((item, i) => (
                        <button key={i} onClick={() => setSelectedImg(i)}><img src={item} alt="" className='h-20 w-20 object-cover' /></button>
                    ))
                }

            </div>
            <div className='h-[30rem] w-[30rem]'>
                <img src={images[selectedImg]} alt="" className='object-cover' />
            </div>
        </div>

    )
}

export default ProductImages