"use client";
import HeroSection from "@/components/HeroSection";
import ProductCard from "@/components/cards/ProductCard";
import Navbar from "@/components/Navbar";
import { MostBoughtProduct, Product } from "@/types/types";
import Link from "next/link";
import { useEffect, useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

export default function Home() {
    const [page, setPage] = useState(1);
    const [products, setProducts] = useState<MostBoughtProduct[]>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchActiveProducts = async () => {
            setLoading(true);
            const URL = process.env.NEXT_PUBLIC_API_URL;
            try {
                const response = await fetch(
                    `${URL}product/most-bought-products?limit=4`
                );
                const data = await response.json();
                console.log(data);
                if (data.length > 0) {
                    setProducts(data);
                } else {
                    setProducts([]);
                }
                setLoading(false);
            } catch (error) {
                console.error("No se pudo obtener los datos", error);
            }
        };
        fetchActiveProducts();
    }, [page]);

    console.log(products);

    // console.log(products);
    // console.log(itemSelected);

    // const nextPage = () => {
    //   if (page < products.cantPages) {
    //     setPage((prev) => prev + 1)
    //   }
    // }
    // const backPage = () => {
    //   if (page > 1) {
    //     setPage((prev) => prev - 1)
    //   }
    // }

    // console.log('pagina', page);

    return (
        <div>
            <Navbar />
            <HeroSection />
            <main className="max-w-[75rem] mx-auto pt-20 pb-10">
                {loading ? (
                    <div className="w-full">
                        <img
                            src="/img/loading.gif"
                            alt="Loader"
                            className="w-[15rem] mx-auto my-20"
                        />{" "}
                    </div>
                ) : (
                    <div className="flex flex-wrap mx-auto  gap-4 ">
                        {products && products.length < 1 ? (
                            <p>No hay productos para mostrar</p>
                        ) : (
                            products?.map(
                                (item: MostBoughtProduct, i: number) => (
                                    <ProductCard item={item} key={i} />
                                )
                            )
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
