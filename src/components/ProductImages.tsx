"use client"
import React, { useState } from 'react'

type ImageType = {
    id: string;
    url: string;
    altText: string | null;
};

type Props = {
    image: ImageType[] | []
}

const ProductImages = ({ image = [] }: Props) => {
    const [selectedImg, setSelectedImg] = useState(0)

    return (
        <div className='flex gap-2'>
            <div className='flex flex-col gap-2'>
                {image.map((item, i) => (
                    <button key={i} onClick={() => setSelectedImg(i)}>
                        <img src={item.url} alt={item.altText ?? ''} className='h-20 w-20 object-cover' />
                    </button>
                ))}
            </div>
            <div className='h-[30rem] w-[30rem]'>
                {image[selectedImg] && (
                    <img src={image[selectedImg]?.url} alt={image[selectedImg]?.altText ?? ''} className='object-cover h-full w-full' />
                )}
            </div>
        </div>
    )
}

export default ProductImages
