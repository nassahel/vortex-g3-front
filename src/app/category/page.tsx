"use client"
import HeroSection from '@/components/HeroSection';
import ProductCard from '@/components/cards/ProductCard';
import Navbar from '@/components/Navbar';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';


const page = () => {
  const [category, setCategory] = useState<any>()
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

  const prods = category?.products || []

  return (
    <div>
      <Navbar />
      <main className='max-w-[75rem] mx-auto mt-20'>
          <h2 className='text-black text-3xl mt-[10rem] capitalize font-semibold'>Categoria: {category?.name}</h2>
      
        <div className="flex flex-wrap w-full gap-8 pt-10 pb-10">
          {prods.length === 0 ? <div className='italic'>Cargando...</div>
            :
            prods.map((item: any, i: number) => (
              <ProductCard key={i} item={item.product} />
            ))
          }
        </div>
      </main>
    </div>
  );
}

export default page





