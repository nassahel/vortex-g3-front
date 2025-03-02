import Image from 'next/image';
import React from 'react'

type Props = {
  fontSize?: string;
  maxWidth?: string;
}

const HeroSection = ({


}: Props) => {
  return (
    <section className='h-screen bg-neutral-200 flex flex-col justify-end w-full'>
      <div className='w-[80rem] flex items-center mx-auto '>
        <div className='lg:w-1/2 flex flex-col justify-center'>
          <h1 className='lg:text-7xl font-extrabold'>ENCUENTRA LA ROPA QUE COMBINE CON TU ESTILO</h1>
          <h3 className='text-lg mt-6'>Explore nuestra variada gama de prendas meticulosamente elaboradas, diseñadas para resaltar su individualidad y satisfacer su sentido del estilo.</h3>
          <button className='bg-black rounded-full py-4 px-12 hover:bg-neutral-800 duration-200 mt-8 text-white w-fit'>Explorar categorías</button>
          <div className='flex justify-center mt-10 mb-20'>
            <div>
              <p className='text-5xl font-semibold'>200+</p>
              <p>Marcas internacionales.</p>
            </div>
            <div className='border-x  border-neutral-300 px-6 mx-6'>
              <p className='text-5xl font-semibold'>2.000+</p>
              <p>Prendas de alta calidad.</p>
            </div>
            <div>
              <p className='text-5xl font-semibold'>30.000+</p>
              <p>Clientes conformes.</p>
            </div>
          </div>
        </div>
        <div className='w-1/2 h-full flex items-end justify-end'>
          <Image width={643} height={643} src="/img/moda.png" alt='Moda' className='w-full' />
        </div>

      </div>
      <div className='h-[8rem] bg-black  py-5 px-8'>
        <div className='flex items-center justify-between gap-6 max-w-[100rem] mx-auto'>
          <Image width={1000} height={563} src="/img/timberland.png" alt='Moda' className='invert w-40  ' />
          <Image width={1024} height={544} src="/img/north_face.png" alt='Moda' className='invert w-40 ' />
          <Image width={1000} height={307} src="/img/element.png" alt='Moda' className='invert w-40 ' />
          <Image width={1000} height={250} src="/img/adidas.png" alt='Moda' className='invert w-40  ' />
          <Image width={1000} height={356} src="/img/nike.png" alt='Moda' className='invert w-40  ' />
          <Image width={1000} height={424} src="/img/cocoshao.png" alt='Moda' className='invert w-40  ' />
        </div>


      </div>

    </section>
  )
}

export default HeroSection