"use client";
import React, { useEffect, useState } from "react";
import { IoMdMenu } from "react-icons/io";
import { CiShoppingCart } from "react-icons/ci";
import Link from "next/link";
import BtnCategory from "./BtnCategory";
import { IoCloseOutline } from "react-icons/io5";
import { jwtDecode } from "jwt-decode";
import SearchBar from "./SearchBar";
import { DecodedUser } from "@/types/types";

const Navbar = () => {
    const [offerModal, setOfferModal] = useState(true);
    const [showNav, setShowNav] = useState(false);
    const [user, setUser] = useState<DecodedUser>(null);

    // Función para obtener el usuario desde el localStorage o sessionStorage
    const getUser = () => {
        const token =
            localStorage.getItem("token") || sessionStorage.getItem("token");
        if (token) {
            try {
                const decodedUser = jwtDecode<DecodedUser>(token);
                setUser(decodedUser);
            } catch (error) {
                console.error("Error al decodificar el token:", error);
                setUser(null);
            }
        }
    };

    useEffect(() => {
        getUser(); // Cargar usuario al montar el componente

        // Escuchar cambios en localStorage para mantener sesión en mobile
        const handleStorageChange = () => getUser();
        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    return (
        <>
            {/* Offer Modal para Desktop */}
            {offerModal && (
                <div className="py-2 px-4 bg-black text-white text-center hidden md:block">
                    <div className="max-w-[80rem] mx-auto text-sm flex items-center justify-center relative">
                        <p>
                            Registrate y obtené un 20% de descuento en tu
                            primera orden.{" "}
                            <Link className="underline" href="">
                                Registrate ahora!
                            </Link>
                        </p>
                        <button
                            onClick={() => setOfferModal(false)}
                            className="absolute right-4 text-xl"
                        >
                            ×
                        </button>
                    </div>
                </div>
            )}

            <div className="w-full bg-white hidden md:block">
                <div className="flex max-w-[80rem] min-w-[60rem] py-4 mx-auto gap-10">
                    <Link href="/">
                        <h2 className="text-4xl font-bold">LuxShop</h2>
                    </Link>
                    <div className="flex items-center gap-5">
                        <BtnCategory />
                        {user?.userRol === "ADMIN" && (
                            <Link href="/administration/products">
                                Administración
                            </Link>
                        )}
                        <Link href="">Favoritos</Link>
                    </div>
                    <SearchBar />
                    <div className="flex items-center gap-4">
                        <Link href="/carrito" className="relative h-8 w-7 ">
                            <CiShoppingCart className="text-3xl" />
                        </Link>
                        {user ? (
                            <div className="flex gap-6">
                                <Link
                                    className="w-fit font-bold"
                                    href="/profile"
                                >
                                    {user.userName?.split(" ")[0]}
                                </Link>
                            </div>
                        ) : (
                            <Link
                                href="/user/login"
                                className="border-b border-transparent transition-all hover:-translate-y-1 duration-200 hover:border-black"
                            >
                                Ingresá
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Offer Modal para Mobile */}
            {offerModal && (
                <div className="py-2 px-4 bg-black text-white text-center md:hidden">
                    <div className="max-w-full mx-auto text-sm flex items-center justify-center relative px-4 sm:px-6">
                        <p className="max-w-full text-xs sm:text-sm">
                            Registrate y obtené un 20% de descuento en tu
                            primera orden.{" "}
                            <Link className="underline" href="">
                                Registrate ahora!
                            </Link>
                        </p>
                        <button
                            onClick={() => setOfferModal(false)}
                            className="absolute right-4 text-lg sm:text-xl"
                        >
                            ×
                        </button>
                    </div>
                </div>
            )}

            {/* Nav Movil */}
            <nav
                aria-label="Menú principal"
                className="h-[4rem] md:hidden sticky bg-neutral-800 top-0 w-full z-40 flex text-white items-center justify-between px-4"
            >
                <Link className="font-bold text-3xl" href="/">
                    LuxShop
                </Link>

                <div className="flex items-center gap-4">
                    {/* Botón de Carrito */}
                    <Link href="/carrito" className="relative">
                        <CiShoppingCart className="text-3xl" />
                    </Link>

                    {/* Botón de menú hamburguesa */}
                    <button
                        onClick={() => setShowNav(true)}
                        className="text-4xl text-white"
                    >
                        <IoMdMenu />
                    </button>
                </div>

                <div
                    className={`${showNav ? "w-full" : "w-0"
                        } fixed top-0 z-40 bottom-0 left-0 right-0`}
                >
                    <div
                        onClick={() => setShowNav(false)}
                        className={`${showNav ? "fixed" : "hidden"
                            } fixed bg-black/60 animate-appear top-0 bottom-0 left-0 right-0`}
                    ></div>
                    <div
                        className={`${showNav ? "" : "-translate-x-[17rem]"
                            } duration-300 w-[17rem] bg-neutral-50 z-50 fixed top-0 bottom-0`}
                    >
                        <div
                            onClick={() => setShowNav(false)}
                            className="absolute top-2 right-2 text-black border-2 border-neutral-300 p-1 rounded-md"
                        >
                            <IoCloseOutline />
                        </div>
                        <ul className="text-xl text-black pt-10 ps-4">
                            <li className="m-3">
                                <BtnCategory setShowNav={setShowNav} />
                            </li>
                            <li className="m-3">
                                {user?.userRol === "ADMIN" && (
                                    <Link href="/administration/products">
                                        Administración
                                    </Link>
                                )}
                            </li>
                            <li className="m-3">
                                <Link href="">Favoritos</Link>
                            </li>
                            <li className="m-3">
                                <Link href="/profile" className="text-black">
                                    {user
                                        ? user.userName?.split(" ")[0]
                                        : "Ingresá"}
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Navbar;
