"use client"
import HeroSection from '@/components/HeroSection';
import ProductCard from '@/components/cards/ProductCard';
import Navbar from '@/components/Navbar';
import { Categorie } from '@/types/types';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';


const page = () => {
  const [categorie, setCategorie] = useState<Categorie>()
  const URL = process.env.NEXT_PUBLIC_API_URL
  const searchParams = useSearchParams();
  const id = searchParams.get('id')

  console.log(categorie);



  useEffect(() => {
    const fetchProductsByCategory = async () => {
      if (!id) return
      try {
        const response = await fetch(URL + `categories/${id}`);
        const data = await response.json();
        setCategorie(data)
      } catch (error) {
        console.error('No se pudo obtener los datos', error)
      }
    }
    fetchProductsByCategory()
  }, [id])

  const prods = categorie?.product || []

  return (
    <div>
      <Navbar />
      <main className='max-w-[75rem] mx-auto'>
        <div className='flex gap-6 py-4'>
          <figure className='w-[70%] mx-auto'>
            <img src={`/img/${categorie?.name.toLocaleLowerCase()}.webp`} alt="" className='w-full' />
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





