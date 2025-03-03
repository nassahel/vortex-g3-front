"use client"
import ReqAuth from "@/utils/ReqAuth";
import Link from "next/link";
import { MdExitToApp } from "react-icons/md";

interface Menu {
    title: string;
    link: string;
}


export default function UserLayout({ children }: { children: React.ReactNode }) {
    // const [btnActive, setBtnActive] = useState<string>('')

    // const styleBlack = (title: string) => ` ${btnActive === title ? 'bg-neutral-700' : 'bg-neutral-800'} border-neutral-600 hover:bg-neutral-700 duration-300`
    const styleBlack = (title: string) => ` border-neutral-400 hover:bg-neutral-200 duration-300`

    const menu: Menu[] = [
        { title: 'Productos', link: 'products', },
        { title: 'Usuarios', link: 'users', },
        { title: 'Categorias', link: 'categories', },
    ]


    return (
        <ReqAuth allowedRoles={['ADMIN']}>
            <div>
                <section className='lg:hidden bg-neutral-200 h-screen flex text-center text-neutral-600  flex-col items-center justify-center px-4'>
                    <img src="/img/pclogo.png" alt="logo PC" className='w-1/3' />
                    <p>Esta pagina solo puede verse desde una pc</p>
                    <p>Por favor conectese desde una Pc para usar el modo administrador</p>
                    <Link href="/" className='bg-neutral-700 px-2 py-1 text-neutral-300 hover:bg-neutral-600 rounded-sm mt-4'>Volver al inicio</Link>
                </section>

                <section className='min-h-screen hidden lg:flex flex-col text-neutral-700'>
                    <header className='bg-black h-[4rem] border-b border-neutral-200 flex items-center   '>
                        <Link href="/" className={` px-3 `}>
                            <p className="font-bold text-3xl text-neutral-100">LuxShop</p>
                        </Link>
                        <section className='flex items-center justify-center grow'>
                            <h2 className="font-semibold text-neutral-100 ">Administración</h2>
                        </section>
                    </header>
                    <section className='flex grow bg-neutral-300'>
                        <aside className=' border-e-8 border-neutral-400 w-60 flex flex-col justify-between  '>
                            <div>
                                <Link href="/" className={`flex items-center justify-center gap-2 border-b-2  py-2 ${styleBlack} `}>
                                    <MdExitToApp />
                                    <span>Salir</span>
                                </Link>
                                <ul className='flex flex-col text-center'>
                                    {
                                        menu.map((item, i) => (
                                            <Link href={item.link} key={i} className={`${styleBlack(item.title)} border-b-2 py-2`} >{item.title}</Link>
                                        ))
                                    }
                                </ul>
                            </div>

                            <div className='text-center py-3'>
                                <p>Version 1.0.0</p>
                            </div>
                        </aside>
                        <main className='w-8/12 p-6 mx-auto '>
                            {children}
                        </main>
                    </section>
                </section>
            </div>
        </ReqAuth>
    );
}