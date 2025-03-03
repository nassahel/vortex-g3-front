"use client";
import HeroSection from "@/components/HeroSection";
import ProductCard from "@/components/cards/ProductCard";
import Navbar from "@/components/Navbar";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { IoIosArrowForward, IoMdClose } from "react-icons/io";
import { GiSettingsKnobs } from "react-icons/gi";
import Pagination from "@/components/Pagination";

const page = () => {
    const [products, setProducts] = useState<any>();
    const URL = process.env.NEXT_PUBLIC_API_URL;
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const currentMin = searchParams.get("min");
    const currentMax = searchParams.get("max");
    const [categories, setCategories] = useState<any[]>([]);
    const [min, setMin] = useState<number>(Number(currentMin) || 0);
    const [max, setMax] = useState<number>(Number(currentMax) || 0);
    const [pagination, setPagination] = useState<any>({
        currentPage: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
    });
    const [filters, setFilters] = useState<any>({
        min: Number(currentMin) || 0,
        max: Number(currentMax) || 0,
    });

    const handleChangePage = (page: number) => {
        setPagination((prev: any) => ({
            ...prev,
            currentPage: page,
        }));
    };

    const handleClearFilter = () => {
        router.push(`/category?id=${id}`);
        setMin(0);
        setMax(0);
        setFilters({ min: 0, max: 0 });
    };

    useEffect(() => {
        const fetchProductsByCategory = async () => {
            if (!id) return;
            try {
                let url =
                    URL +
                    `product/all?categoryId=${id}&page=${pagination.currentPage}`;
                if (filters.min > 0) url += `&minPrice=${filters.min}`;
                if (filters.max > 0) url += `&maxPrice=${filters.max}`;

                const response = await fetch(url);
                const data = await response.json();
                setProducts(data.data);
                setPagination({
                    currentPage: data.meta.currentPage,
                    totalPages: data.meta.totalPages,
                    hasNextPage: data.meta.hasNextPage,
                    hasPreviousPage: data.meta.hasPreviousPage,
                });
            } catch (error) {
                console.error("No se pudo obtener los datos", error);
                setProducts([]);
            }
        };
        fetchProductsByCategory();
    }, [id, filters, pagination.currentPage]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${URL}category/all`);
                const data = await response.json();
                // console.log("Categorías obtenidas:", data);
                setCategories(Array.isArray(data.data) ? data.data : []);
            } catch (error) {
                console.error("No se pudo obtener los datos", error);
                setCategories([]);
            }
        };
        fetchCategories();
    }, []);

    const handleFilter = () => {
        let url = `/category?id=${id}`;
        if (min > 0) url += `&min=${min}`;
        if (max > 0) url += `&max=${max}`;
        router.push(url);
        setFilters({ min, max });
    };

    return (
        <div>
            <Navbar />
            <main className="mt-24">
                <div className="max-w-[1300px] mx-auto flex md:flex-row justify-between py-12 gap-6">
                    <div className="w-1/5 relative">
                        <div className="rounded-lg p-4 space-y-4 border sticky top-36">
                            <p className="text-black text-lg font-semibold flex items-center justify-between gap-2">
                                Filtros
                                <GiSettingsKnobs className="text-gray-400" />
                            </p>
                            <hr />
                            <div className="space-y-2">
                                {categories?.map((item: any, i: number) => (
                                    <Link
                                        href={`/category?id=${item.id}`}
                                        key={i}
                                        className="flex items-center justify-between gap-2 text-gray-400 transition-all hover:text-black hover:translate-x-1 duration-200"
                                    >
                                        <p className="text-sm">{item.name}</p>
                                        <IoIosArrowForward />
                                    </Link>
                                ))}
                            </div>
                            <hr />
                            <div className="space-y-2">
                                <p className="text-black text-lg font-semibold">
                                    Precio
                                </p>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Mínimo"
                                        className="w-1/2 border rounded-lg p-2"
                                        value={min || ""}
                                        onChange={(e) =>
                                            setMin(Number(e.target.value))
                                        }
                                    />
                                    <input
                                        type="text"
                                        placeholder="Máximo"
                                        className="w-1/2 border rounded-lg p-2"
                                        value={max || ""}
                                        onChange={(e) =>
                                            setMax(Number(e.target.value))
                                        }
                                    />
                                </div>
                                <button
                                    onClick={handleFilter}
                                    className="bg-black text-white px-4 py-2 rounded-lg w-full transition-colors hover:bg-gray-800 duration-200"
                                >
                                    Aplicar
                                </button>
                            </div>
                            <hr />
                            <div>
                                <button
                                    onClick={handleClearFilter}
                                    className="bg-red-200 text-red-800 px-4 py-2 rounded-lg w-full transition-colors hover:bg-red-500 hover:text-white duration-200 flex items-center gap-2 justify-center"
                                >
                                    <IoMdClose />
                                    Limpiar filtros
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="w-4/5 md:min-h-[700px] flex flex-col justify-between">
                        <div>
                            <h2 className="text-black text-3xl capitalize font-semibold">
                                {
                                    categories.find(
                                        (item: any) => item.id === id
                                    )?.name
                                }
                            </h2>

                            <div className="flex flex-wrap w-full gap-8 pt-10 pb-10">
                                {products?.length === 0 ? (
                                    <div className="italic">Cargando...</div>
                                ) : (
                                    products?.map((item: any, i: number) => (
                                        <ProductCard key={i} item={item} />
                                    ))
                                )}
                            </div>
                        </div>
                        <div>
                            <hr />
                            <Pagination
                                pagination={pagination}
                                handleChangePage={handleChangePage}
                            />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default page;
