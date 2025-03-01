"use client"
import HeroSection from '@/components/HeroSection';
import ProductCard from '@/components/cards/ProductCard';
import Navbar from '@/components/Navbar';
import { Category } from '@/types/types';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';


const page = () => {
  const [category, setCategory] = useState<Category>()
  const URL = process.env.NEXT_PUBLIC_API_URL
  const searchParams = useSearchParams();
  const id = searchParams.get('id')

  console.log(category);



  useEffect(() => {
    const fetchProductsByCategory = async () => {
      if (!id) return
      try {
        const response = await fetch(URL + `category/${id}`);
        const data = await response.json();
        setCategory(data)
      } catch (error) {
        console.error('No se pudo obtener los datos', error)
      }
    }
    fetchProductsByCategory()
  }, [id])

  const prods = category?.product || []

  return (
    <div>
      <Navbar />
      <main className='max-w-[75rem] mx-auto'>
        <div className='flex gap-6 py-4'>
          <figure className='w-[70%] mx-auto'>
            <img src={`/img/${category?.name.toLocaleLowerCase()}.webp`} alt="" className='w-full' />
          </figure>
          <HeroSection fontSize='text-md' maxWidth='max-w-[25rem]' />
        </div>

        <div className="flex flex-wrap w-full   gap-4 pt-20 pb-10">
          {prods.length === 0 ? <div className='italic'>No hay productos de esta categoria :(</div>
            :
            prods.map((item, i) => (
              <ProductCard key={i} item={item} />
            ))
          }
        </div>
      </main>
    </div>
  );
}

export default page





