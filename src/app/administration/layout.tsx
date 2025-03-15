"use client";
import ReqAuth from "@/utils/ReqAuth";
import Link from "next/link";
import { MdExitToApp } from "react-icons/md";

interface Menu {
    title: string;
    link: string;
}

export default function UserLayout({ children }: { children: React.ReactNode }) {
    const menu: Menu[] = [
        { title: "Productos", link: "products" },
        { title: "Usuarios", link: "users" },
        { title: "Categorías", link: "categories" },
    ];

    return (
        <ReqAuth allowedRoles={["ADMIN"]}>
            <div className="min-h-screen bg-gray-100">
                <section className="lg:hidden bg-gray-200 h-screen flex flex-col items-center justify-center text-center text-gray-700 px-4">
                    <img src="/img/pclogo.png" alt="logo PC" className="w-1/3 mb-4" />
                    <p>Esta página solo puede verse desde una PC.</p>
                    <p>Por favor, conéctese desde un ordenador para usar el modo administrador.</p>
                    <Link href="/" className="bg-gray-800 px-4 py-2 text-white hover:bg-gray-700 rounded-md mt-4">
                        Volver al inicio
                    </Link>
                </section>

                <section className="hidden lg:flex flex-col min-h-screen">

                    <header className="bg-gray-900 text-white h-16 flex items-center px-6 shadow-md">
                        <Link href="/" className="text-2xl font-bold">LuxShop</Link>
                        <section className="flex-grow text-center">
                            <h2 className="text-lg font-semibold">Administración</h2>
                        </section>
                    </header>

                    <section className="flex flex-grow">
                        <aside className="w-64 bg-gray-800 text-gray-200 flex flex-col justify-between shadow-lg">
                            <div>
                                <Link href="/" className="flex items-center justify-center gap-2 py-3 text-gray-300 hover:bg-gray-700 transition">
                                    <MdExitToApp />
                                    <span>Salir</span>
                                </Link>

                                <ul className="flex flex-col">
                                    {menu.map((item, i) => (
                                        <Link
                                            href={item.link}
                                            key={i}
                                            className="py-3 text-center hover:bg-gray-700 transition"
                                        >
                                            {item.title}
                                        </Link>
                                    ))}
                                </ul>
                            </div>

                            <div className="text-center py-4 text-gray-400 text-sm">
                                <p>Versión 1.0.0</p>
                            </div>
                        </aside>

                        <main className="flex-grow p-6 bg-white shadow-inner">
                            {children}
                        </main>
                    </section>
                </section>
            </div>
        </ReqAuth>
    );
}
