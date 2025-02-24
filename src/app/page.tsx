"use client"
import HeroSection from "@/components/HeroSection";
import ProductCard from "@/components/cards/ProductCard";
import Navbar from "@/components/Navbar";
import { Product } from "@/types/types";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from 'react';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

export default function Home() {
  const [page, setPage] = useState(1)
  const [products, setProducts] = useState<any>({})
  const [loading, setLoading] = useState(true)



  useEffect(() => {
    const fetchActiveProducts = async () => {
      setLoading(true)
      const URL = process.env.NEXT_PUBLIC_API_URL
      try {
        const response = await fetch(`${URL}products/active?limit=8&page=${page}`);
        const data = await response.json();
        setProducts(data)
        setLoading(false)
      } catch (error) {
        console.error('No se pudo obtener los datos', error)
      }
    }
    fetchActiveProducts()
  }, [page])


  console.log(products);
  // console.log(itemSelected);


  const nextPage = () => {
    if (page < products.cantPages) {
      setPage((prev) => prev + 1)
    }
  }
  const backPage = () => {
    if (page > 1) {
      setPage((prev) => prev - 1)
    }
  }

  // console.log('pagina', page);


  return (
    <div>
      <Navbar />
      <HeroSection />
      <main className="max-w-[75rem] mx-auto pt-20 pb-10">
        {loading ?
          <div className="w-full"><img src="/img/loading.gif" alt="Loader" className="w-[15rem] mx-auto my-20" /> </div>
          :
          <div className="flex flex-wrap mx-auto  gap-4 ">
            {
              products.data.map((item: Product, i: number) => (
                <Link href={'/' + item.id} key={i}><ProductCard item={item} /></Link>
                // <button onClick={() => selectItem(item)} key={i}><ItemCard item={item} /></button>
              ))
            }
          </div>
        }
      </main>
      {
        !loading && <div className="flex items-center gap-4 w-full justify-center my-10">
          <button onClick={backPage} className="flex items-center gap-2 border border-neutral-500 px-1"><IoIosArrowBack /> <p>Anterior</p> </button>
          <p>{page}</p>
          <button onClick={nextPage} className="flex items-center gap-2 border border-neutral-500 px-1"> <p>Siguiente</p> <IoIosArrowForward /></button>
        </div>
      }
    </div>
  );
}
