"use client";
import React, { useEffect, useState } from "react";
import { IoIosSearch, IoMdMenu } from "react-icons/io";
import { CiShoppingCart } from "react-icons/ci";
// import { GoBell } from "react-icons/go";
import Link from "next/link";
import BtnCategory from "./BtnCategory";
import useAppStore from "@/zustand/zustand";
import { IoCloseOutline } from "react-icons/io5";
import { jwtDecode } from "jwt-decode";
import { MdLogout } from "react-icons/md";

type Props = {};

const Navbar = (props: Props) => {
    const items = useAppStore((state: any) => state.items);
    const [offerModal, setOfferModal] = useState(true);
    const [showNav, setShowNav] = useState(false);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const user = jwtDecode(token);
            setUser(user);
        }
    }, []);

    return (
        <>
            <div className="w-full bg-white hidden md:block ">
                {offerModal && (
                    <div className="py-2 px-4 bg-black text-white text-center">
                        <div className="max-w-[80rem] mx-auto text-sm flex items-center justify-center relative ">
                            <p>
                                Registrate y obtené un 20% de descunto en tu
                                primera orden.{" "}
                                <Link className="underline" href="">
                                    Registrate ahora!
                                </Link>{" "}
                            </p>
                            <button
                                onClick={() => setOfferModal(false)}
                                className="absolute right-0 text-xl"
                            >
                                x
                            </button>
                        </div>
                    </div>
                )}
                <div className="flex max-w-[80rem] min-w-[60rem] py-4 mx-auto gap-10 border-b">
                    <Link href="/">
                        <h2 className="text-4xl font-bold">LuxShop</h2>
                    </Link>
                    <div className="flex items-center gap-5">
                        <BtnCategory />
                        {user !== null && user.userRol === "ADMIN" && (
                            <Link href="/administration/products">
                                Administración
                            </Link>
                        )}

                        <Link href="">Favoritos</Link>
                    </div>
                    <div className="flex w-full h-12  items-center pe-2 rounded-full overflow-hidden bg-neutral-100 shadow-inner border">
                        <div className="p-2 rounded-full m-1 duration-300 hover:bg-neutral-200 flex items-center">
                            <button>
                                <IoIosSearch className="text-2xl text-neutral-400" />
                            </button>
                        </div>
                        <input
                            type="search"
                            name=""
                            id=""
                            placeholder="Buscar productos..."
                            className="w-full h-full outline-none px-3 bg-neutral-100"
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <Link href="/carrito" className="relative h-8 w-7 ">
                            {items.length !== 0 && (
                                <p className="absolute top-[7px] left-[14px] text-xs">
                                    {items.length}
                                </p>
                            )}

                            <CiShoppingCart
                                className={`text-3xl transition-all hover:scale-110 duration-150 ${
                                    items.length !== 0
                                        ? "text-black"
                                        : "text-neutral-400"
                                }`}
                            />
                        </Link>
                        {user === null ? (
                            <Link
                                href="/user/login"
                                className="border-b border-transparent transition-all hover:-translate-y-1 duration-200 hover:border-black"
                            >
                                Ingresá
                            </Link>
                        ) : (
                            <div className="flex gap-6">
                                <Link
                                    className="w-fit  font-bold"
                                    href="/profile"
                                >
                                    {user.userName.split(" ")[0]}
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Nav Movil */}
            <nav
                aria-label="Menú principal"
                className={` h-[4rem] md:hidden sticky bg-neutral-800 top-0 w-full z-40 flex text-white items-center justify-between px-4 m-0 p-0`}
            >
                <Link className="font-bold text-3xl" href="#inicio">
                    LuxShop
                </Link>
                <button
                    onClick={() => setShowNav(true)}
                    className="text-4xl text-white"
                >
                    <IoMdMenu />
                </button>
                <div
                    className={`${
                        showNav ? "w-full" : "w-0"
                    } fixed top-0 z-40 bottom-0 left-0 right-0`}
                >
                    <div
                        onClick={() => setShowNav(false)}
                        className={`${
                            showNav ? "fixed" : "hidden"
                        } fixed bg-black/60  animate-appear top-0 bottom-0 left-0 right-0  `}
                    ></div>
                    <div
                        className={`${
                            showNav ? "" : "-translate-x-[17rem]"
                        } duration-300 w-[17rem] bg-neutral-50 z-50 fixed top-0 bottom-0`}
                    >
                        <div
                            onClick={() => setShowNav(false)}
                            className="absolute top-2 right-2 text-black border-2 border-neutral-300 p-1 rounded-md "
                        >
                            <IoCloseOutline />
                        </div>
                        <ul className="text-xl text-black pt-10 ps-4">
                            <li className="m-3">
                                <BtnCategory setShowNav={setShowNav} />
                            </li>
                            <li className="m-3">
                                <Link href="/administration/products">
                                    Administración
                                </Link>
                            </li>
                            <li className="m-3">
                                {" "}
                                <Link href="">Favoritos</Link>
                            </li>
                            <li className="m-3">
                                <Link
                                    href="/carrito"
                                    className="flex w-full justify-between"
                                >
                                    <span>Mi Carrito</span>
                                    {items.length !== 0 && (
                                        <p className="absolute top-0 right-7 text-xs">
                                            {items.length}
                                        </p>
                                    )}
                                    <CiShoppingCart className="text-3xl text-black me-4" />
                                </Link>
                            </li>
                            <li className="m-3">
                                {user === null ? (
                                    <Link
                                        href="/user/login"
                                        className="text-black"
                                    >
                                        Ingresá
                                    </Link>
                                ) : (
                                    <div className="flex gap-6 items-center">
                                        <Link
                                            className=" text-black"
                                            href="/user/login"
                                        >
                                            {user.userName.split(" ")[0]}
                                        </Link>
                                    </div>
                                )}
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Navbar;
