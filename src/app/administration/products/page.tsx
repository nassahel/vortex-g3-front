"use client"
import AddEditProductModal from '@/components/modals/AddEditProductModal';
import { Product } from '@/types/types';
import React, { useEffect, useState } from 'react'
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
// import AddEditProductModal from '../modals/AddEditProductModal';
// import Swal from 'sweetalert2';
// import { sortData } from '../../utils/utils';


const page = () => {
  const [products, setProducts] = useState([])
  const [modal, setModal] = useState(false);
  const [productEdit, setProductEdit] = useState(null)
  const [modalEdit, setModalEdit] = useState(false)
  const [search, setSearch] = useState('')
  const [loading, setLoaing] = useState<boolean>(false);
  const URL = process.env.NEXT_PUBLIC_API_URL

  console.log(products);



  useEffect(() => {
    const fetchActiveProducts = async () => {
      try {
        setLoaing(true)
        const response = await fetch(URL + 'product/all');

        const data = await response.json();
        // console.log(data);

        setProducts(data.data)
        setLoaing(false)
      } catch (error) {
        console.error('No se pudo obtener los datos', error)
      }
    }
    fetchActiveProducts()
  }, [modal])

  const commonSyle = 'flex-center border-e p-2'

  return (
    <section className='relative'>
      {modal && <AddEditProductModal setModal={setModal} />}
      <div className='flex justify-between'>
        <input value={search} onChange={(e) => setSearch(e.target.value)} className='bg-white py-2 px-4 my-2  rounded-md border-2 border-neutral-400 outline-none w-[25rem]' type="search" name="searchProd" placeholder='Buscar productos...' />
        <button onClick={() => setModal(true)} className='bg-white py-2 px-4 my-2  rounded-md border-2 border-neutral-400 hover:border-black duration-200'>Agregar Producto</button>
      </div>


      <div>
        <section className='flex flex-col gap-1'>
          <article className='bg-black text-white  rounded-md flex font-semibold'>
            <div className='border-e w-28 overflow-hidden flex-center'>
              <p>Imagen</p>
            </div>
            <div className='flex w-full'>
              <div className={`${commonSyle} w-3/12`}>
                <p className='capitalize font-semibold'>Nombre</p>
              </div>
              <div className={`${commonSyle} w-6/12`} >
                <p className=' '>Descripción</p>
              </div>
              <div className={`${commonSyle} w-2/12 gap-1 flex-wrap`}>
                <p className="">Categoría</p>
              </div>
              <div className={`${commonSyle} w-1/12 gap-4`}>
                Opciones
              </div>
            </div>
          </article>

          {
            products.length !== 0 ? products.map((item: Product, i) => (
              <article key={i} className='bg-white overflow-hidden rounded-md flex'>
                <div className='h-20 w-28 '>
                  <img src={item.images} alt={item.name} className='h-full w-full object-cover' />
                </div>
                <div className='flex w-full'>
                  <div className={`${commonSyle} w-3/12`}>
                    <p className='capitalize font-semibold'>{item.name}</p>
                  </div>
                  <div className={`${commonSyle} w-6/12`} >
                    <p className=' '>{item.description}</p>
                  </div>
                  <div className={`${commonSyle} w-2/12 gap-1 flex-wrap`}>
                    {
                      item.categories.map((item: string, i) => (
                        <p key={i} className="border border-neutral-700 text-sm rounded-lg bg-white w-fit px-1">{item}</p>
                      ))
                    }
                  </div>
                  <div className={`${commonSyle} w-1/12 text-xl gap-4`}>
                    <button><FaEdit className='' /></button>
                    <button><RiDeleteBin6Line color='red' className='' /></button>
                  </div>
                </div>
              </article>
            ))
              :
              <p className='mt-6 text-lg'>Cargando...</p>
          }
        </section>
      </div>


    </section>
  )
}

export default page;