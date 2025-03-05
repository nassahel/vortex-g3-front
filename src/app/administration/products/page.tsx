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
    <section className="relative">
      {modal && <AddEditProductModal setModal={setModal} />}
      <div className="flex justify-between">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-white py-2 px-4 my-2 rounded-md border-2 border-neutral-400 outline-none w-[25rem]"
          type="search"
          placeholder="Buscar productos..."
        />
        <button
          onClick={() => setModal(true)}
          className="bg-white py-2 px-4 my-2 rounded-md border-2 border-neutral-400 hover:border-black duration-200"
        >
          Agregar Producto
        </button>
      </div>

      <div>
        <section className="flex flex-col gap-1">
          {/* Encabezado */}
          <article className="bg-neutral-800 text-white rounded-md flex font-semibold">
            <div className="flex w-full">
              <div className={`${commonSyle} w-3/12`}>
                <p className="capitalize">Nombre</p>
              </div>
              <div className={`${commonSyle} w-6/12`}>
                <p>Descripción</p>
              </div>
              <div className={`${commonSyle} w-2/12`}>
                <p>Categoría</p>
              </div>
              <div className={`${commonSyle} w-1/12`}>
                Opciones
              </div>
            </div>
          </article>

          {/* Productos */}
          {products.length !== 0 ? (
            products.map((item: Product, i) => (
              <article
                key={i}
                className="bg-white overflow-hidden rounded-md border border-neutral-200 flex flex-col"
              >
                {/* Fila principal (sin columna imagen) */}
                <div className="flex">
                  <div className="flex w-full">
                    <div className={`${commonSyle} w-3/12`}>
                      <p className="capitalize font-semibold">{item.name}</p>
                    </div>
                    <div className={`${commonSyle} w-6/12`}>
                      <p>{item.description}</p>
                    </div>
                    <div className={`${commonSyle} w-2/12 gap-1 flex-wrap`}>
                      {item.categories.map((cat: string, i) => (
                        <p
                          key={i}
                          className="border border-neutral-700 text-sm rounded-lg bg-white w-fit px-1"
                        >
                          {cat}
                        </p>
                      ))}
                    </div>
                    <div className={`${commonSyle} w-1/12 text-xl gap-4`}>
                      <button>
                        <FaEdit />
                      </button>
                      <button>
                        <RiDeleteBin6Line color="red" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Galería de imágenes (todas abajo) */}
                <div className="flex items-center gap-2 flex-wrap px-4 py-2 bg-gray-50 border-t border-neutral-200">
                  {item.images.map((img: string, idx: number) => (
                    <div
                      key={idx}
                      className={`w-16 h-16 rounded overflow-hidden border ${idx === 0
                          ? 'border-2 border-blue-500 shadow-md'
                          : 'border-neutral-300'
                        }`}
                    >
                      <img
                        src={img}
                        alt={`Producto ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}

                  {/* Botón para agregar más imágenes */}
                  <button
                    className="w-16 h-16 flex items-center justify-center border border-neutral-400 rounded hover:bg-neutral-100"
                    onClick={() => handleAddImage(item.id)}
                  >
                    +
                  </button>
                </div>
              </article>
            ))
          ) : (
            <p className="mt-6 text-lg">Cargando...</p>
          )}
        </section>
      </div>
    </section>


  )
}

export default page;