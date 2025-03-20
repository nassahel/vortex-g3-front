"use client";
import HeroSection from "@/components/HeroSection";
import ProductCard from "@/components/cards/ProductCard";
import Navbar from "@/components/Navbar";
import { MostBoughtProduct } from "@/types/types";
import { useEffect, useState } from "react";

export default function Home() {
    const [products, setProducts] = useState<MostBoughtProduct[]>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchActiveProducts = async () => {
            setLoading(true);
            const URL = process.env.NEXT_PUBLIC_API_URL;
            try {
                const response = await fetch(
                    `${URL}/product/most-bought-products?limit=4`
                );
                const data = await response.json();
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
    }, []);

    return (
        <div>
            <div>
                <Navbar />
            </div>
            <div className="">
                <HeroSection />
            </div>
            <main className="max-w-[75rem] mx-auto pt-20 pb-10 px-4">
                {loading ? (
                    <div className="w-full flex justify-center">
                        <img
                            src="/img/loading.gif"
                            alt="Loader"
                            className="w-[12rem] sm:w-[15rem] my-20"
                        />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mx-auto">
                        {products && products.length < 1 ? (
                            <p className="text-center col-span-full">
                                No hay productos para mostrar
                            </p>
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
