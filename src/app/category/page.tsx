"use client";
import ProductCard from "@/components/cards/ProductCard";
import Navbar from "@/components/Navbar";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { IoIosArrowForward, IoMdClose } from "react-icons/io";
import { GiSettingsKnobs } from "react-icons/gi";
import { Categorie, Filters, MostBoughtProduct, PaginationType, Product } from "@/types/types";
import Pagination from "@/components/Pagination";



const CategoryPage = () => {
    const [products, setProducts] = useState<Product[]>();
    const URL = process.env.NEXT_PUBLIC_API_URL;
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const currentMin = searchParams.get("min");
    const currentMax = searchParams.get("max");
    const [categories, setCategories] = useState<Categorie[]>([]);
    const [min, setMin] = useState<number>(Number(currentMin) || 0);
    const [max, setMax] = useState<number>(Number(currentMax) || 0);
    const [showFilters, setShowFilters] = useState(false);
    const [pagination, setPagination] = useState<PaginationType>({
        currentPage: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
    });
    const [filters, setFilters] = useState<Filters>({
        min: Number(currentMin) || 0,
        max: Number(currentMax) || 0,
    });

    const handleChangePage = (page: number) => {
        setPagination((prev: PaginationType) => ({
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
        <Suspense>
            <div>
                <Navbar />
                <main className="">
                    <div className="max-w-[1300px] mx-auto flex flex-col sm:flex-row justify-between py-12 gap-6">                    {/* Botón de filtros en mobile */}
                        <button
                            className="bg-black text-white px-4 py-2 rounded-lg w-full sm:hidden"
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            {showFilters ? "Ocultar Filtros" : "Mostrar Filtros"}
                        </button>

                        {/* Filtros - Se despliega en mobile, siempre visible en desktop */}
                        <div
                            className={`w-full sm:w-1/4 relative transition-all duration-300 ${showFilters ? "block" : "hidden sm:block"
                                }`}
                        >
                            <div className="rounded-lg p-4 space-y-4 border sticky top-6 bg-white shadow-lg sm:shadow-none">
                                <p className="text-black text-lg font-semibold flex items-center justify-between gap-2">
                                    Filtros
                                    <GiSettingsKnobs className="text-gray-400" />
                                </p>
                                <hr />
                                <div className="space-y-2">
                                    {categories?.map((item: Categorie, i: number) => (
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
                                    <p className="text-black text-lg font-semibold">Precio</p>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Mínimo"
                                            className="w-1/2 border rounded-lg p-2"
                                            value={min || ""}
                                            onChange={(e) => setMin(Number(e.target.value))}
                                        />
                                        <input
                                            type="text"
                                            placeholder="Máximo"
                                            className="w-1/2 border rounded-lg p-2"
                                            value={max || ""}
                                            onChange={(e) => setMax(Number(e.target.value))}
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
                                            (item: Categorie) => item.id === id
                                        )?.name
                                    }
                                </h2>

                                <div className="flex flex-wrap w-full gap-8 pt-10 pb-10">
                                    {products?.length === 0 ? (
                                        <div className="italic">Cargando...</div>
                                    ) : (
                                        products?.map((item: MostBoughtProduct, i: number) => (
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
        </Suspense>
    );
};

export default CategoryPage;
