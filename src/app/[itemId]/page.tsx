"use client";
import Navbar from "@/components/Navbar";
import Navigation from "@/components/Navigation";
import ProductImages from "@/components/ProductImages";
import { CartItem, Product } from "@/types/types";
import useAppStore from "@/zustand/zustand";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaPlus, FaMinus } from "react-icons/fa6";

const page = () => {
    const { itemId } = useParams();
    const addItemToChart = useAppStore((state: any) => state.addItem);
    const [product, setProduct] = useState<Product | null>(null);
    const [quantity, setQuantity] = useState<number>(1);

    let chartItem: CartItem = {
        itemId,
        quantity,
        subtotal: product ? product.price * quantity : 0,
    };

    useEffect(() => {
        const fetchItem = async () => {
            // setLoading(true)
            const URL = process.env.NEXT_PUBLIC_API_URL;
            try {
                const response = await fetch(`${URL}product/${itemId}`);
                const data = await response.json();
                // console.log('data', data);

                setProduct(data);
                // setLoading(false)
            } catch (error) {
                console.error("No se pudo obtener el producto", error);
            }
        };
        fetchItem();
    }, []);

    const btnStyle = "px-6 py-2 hover:bg-neutral-200 duration-300";

    const addItem = () => {
        if (quantity < 10) setQuantity((prev) => prev + 1);
    };

    const removeItem = () => {
        if (quantity > 1) setQuantity((prev) => prev - 1);
    };

    const addItemToCart = () => {
        addItemToChart(chartItem);
        toast.success("Producto agregado al carrito!", { duration: 3000 });
    };

    return (
        <section>
            <Navbar />
            <div className="max-w-[80rem] mx-auto pt-[2rem]">
                <Navigation />
                <div className="flex py-6">
                    <main className="w-full px-20  gap-10">
                        <div className="flex mb-10 gap-10">
                            <ProductImages
                                image={
                                    Array.isArray(product?.images) && product.images.length > 0
                                        ? product.images
                                        : [
                                              {
                                                  url: "/img/default-product.webp",
                                                  altText: "default",
                                                  id: "1default",
                                              },
                                          ]
                                }
                            />
                            <div className="w-[50%] flex flex-col gap-6">
                                <div className="flex items-center gap-2">
                                    {product?.categories.map(
                                        (item: any, i: number) => (
                                            <p
                                                className="bg-gray-200 text-gray-800 px-2 py-1 rounded-xl text-xs cursor-default"
                                                key={i}
                                            >
                                                {item?.category?.name}
                                            </p>
                                        )
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <h2 className="text-4xl font-extrabold cursor-default">
                                        {product && product.name.toUpperCase()}
                                    </h2>
                                    <p className="cursor-default">⭐⭐⭐⭐</p>
                                    <p className="text-4xl font-semibold cursor-default">
                                        ${product && product.price}
                                    </p>
                                </div>
                                <hr />
                                <p className="text-xs mt-1 ms-2">
                                    *Máximo 10 unidades por compra
                                </p>
                                <div className="flex items-center gap-2">
                                    <div>
                                        <div className="flex items-center  bg-gray-200 rounded-2xl justify-between overflow-hidden py-1">
                                            <button
                                                onClick={removeItem}
                                                className={btnStyle}
                                            >
                                                <FaMinus className="transition-transform hover:rotate-180 duration-300" />
                                            </button>
                                            <p className="font-semibold">
                                                {quantity}
                                            </p>
                                            <button
                                                onClick={addItem}
                                                className={btnStyle}
                                            >
                                                <FaPlus className="transition-transform hover:rotate-180 duration-300" />
                                            </button>
                                        </div>
                                    </div>
                                    <button
                                        onClick={addItemToCart}
                                        className="bg-black py-2 rounded-2xl text-white font-semibold w-full transition-colors hover:bg-neutral-600"
                                    >
                                        Agregar al carrito
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-2xl font-semibold mb-4 border-b border-neutral-300 pb-2">
                                Detalles del producto
                            </h3>
                            <p>{product?.description}</p>
                        </div>
                    </main>

                    {/* <aside className="w-[25rem] border border-neutral-300 rounded-lg p-4 gap-8 flex flex-col">
                        <div>
                            <p>Tenés 30 dias para devolverlo</p>
                        </div>
                        <div>
                            <p>Cantidad:</p>
                            <div className="flex items-center w-full border border-neutral-300 rounded-lg justify-between overflow-hidden mt-1">
                                <button
                                    onClick={removeItem}
                                    className={btnStyle}
                                >
                                    <FaMinus />
                                </button>
                                <p className="font-semibold">{quantity}</p>
                                <button onClick={addItem} className={btnStyle}>
                                    <FaPlus />
                                </button>
                            </div>
                            <p className="text-xs mt-1 ms-2">
                                *Máximo 10 unidades por compra
                            </p>
                        </div>
                        <button
                            onClick={addItemToCart}
                            className="bg-blue-600 w-full py-2 rounded-md text-white font-semibold"
                        >
                            Agregar al carrito
                        </button>
                    </aside> */}
                </div>
            </div>
        </section>
    );
};

export default page;
