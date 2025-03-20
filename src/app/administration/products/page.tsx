"use client";
import AddEditProductModal from "@/components/modals/AddEditProductModal";
import Link from "next/link";
import { DeleteModal } from "@/components/modals/DeleteModal";
import React, { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { Image } from "@/types/types";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";


interface Product {
    id?: string;
    images?: Image[];
    name?: string;
    price?: number;
    stock?: number;
    description?: string;
    categories?: string[];
}

const Page = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [modal, setModal] = useState(false);
    const [productEdit, setProductEdit] = useState<Product | null>(null);
    const [modalEdit, setModalEdit] = useState(false);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState<boolean>(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const URL = process.env.NEXT_PUBLIC_API_URL;
    const [refresh, setRefresh] = useState<number>(0);
    const [page, setPage] = useState<number>(1)
    const [numberOfPages, setNumberOfPages] = useState(1)



    const nextPage = () => {
        if (page < numberOfPages) {
            setPage(page + 1)
        }
    }

    const prevPage = () => {
        if (page > 1) {
            setPage(page - 1)
        }
    }

    console.log(numberOfPages);


    useEffect(() => {
        const fetchActiveProducts = async () => {
            try {
                setLoading(true);
                const response = await fetch(URL + "/product/all?page=" + page);
                const data = await response.json();
                setProducts(data.data);
                setNumberOfPages(data.meta.totalPages);
                setLoading(false);
            } catch (error) {
                console.error("No se pudo obtener los datos", error);
            }
        };
        fetchActiveProducts();
    }, [deleteModal, refresh, page]);

    const handleAddImage = async (productId: string) => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";

        input.addEventListener("change", async (e: Event) => {
            const target = e.target as HTMLInputElement;
            const file = target.files ? target.files[0] : null;
            if (!file) return;

            const formData = new FormData();
            formData.append("image", file);

            try {
                const response = await fetch(
                    `${URL}/images/upload-image/${productId}`,
                    {
                        method: "POST",
                        body: formData,
                    }
                );
                const result = await response.json();
                setRefresh(Math.random());

                if (response.ok) {
                } else {
                    console.error("Error al subir la imagen", result.message);
                }
            } catch (error) {
                console.error("Error de conexión", error);
            }
        });
        input.click();
    };

    const commonStyle = " p-3";

    const filteredProducts =
        search !== ""
            ? products.filter((product) =>
                product.name
                    .toLowerCase()
                    .trim()
                    .includes(search.toLowerCase().trim())
            )
            : products;

    return (
        <section className="relative px-4">
            {modal && (
                <AddEditProductModal
                    setModal={setModal}
                    product={productEdit}
                    isEditing={modalEdit}
                />
            )}
            {deleteModal && (
                <DeleteModal
                    setDeleteModal={setDeleteModal}
                    elemento="producto"
                    nombre={productEdit?.name}
                    itemId={productEdit?.id || ""}
                    ruta="/product/delete/"
                />
            )}

            <div className="flex flex-col sm:flex-row justify-between gap-4 ">
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="bg-white py-2 px-4 rounded-md border-2 border-neutral-400 outline-none w-full sm:w-[25rem]"
                    type="search"
                    placeholder="Buscar productos..."
                />
                <div className="flex gap-2">
                    <Link
                        href="/administration/import"
                        className="bg-white py-2 px-4 rounded-md border-2 border-neutral-400 hover:border-black duration-200 w-full sm:w-auto"
                    >
                        Importar Productos
                    </Link>
                    <button
                        onClick={() => {
                            setModal(true);
                            setModalEdit(false);
                        }}
                        className="bg-white py-2 px-4 rounded-md border-2 border-neutral-400 hover:border-black duration-200 w-full sm:w-auto"
                    >
                        Agregar Producto
                    </button>
                </div>
            </div>

            <section className="flex flex-col mt-4">
                <article className="bg-gray-800 text-white font-semibold hidden md:flex">
                    <div className="w-full grid grid-cols-2 md:grid-cols-12">
                        <div className={`${commonStyle} md:col-span-2`}>
                            <p className="capitalize">Nombre</p>
                        </div>
                        <div className={`${commonStyle} md:col-span-6`}>
                            <p>Descripción</p>
                        </div>
                        <div className={`${commonStyle} md:col-span-1`}>
                            <p>Precio</p>
                        </div>
                        <div className={`${commonStyle} md:col-span-2`}>
                            <p>Categoría</p>
                        </div>
                        <div className={`${commonStyle} md:col-span-1`}>
                            Opciones
                        </div>
                    </div>
                </article>

                {loading ? (
                    <p className="mt-6 text-lg text-center">Cargando...</p>
                ) : (
                    filteredProducts.map((item: Product, i) => (
                        <article
                            key={i}
                            className="bg-white overflow-hidden rounded-md border border-neutral-200 flex flex-col p-4"
                        >
                            <div className="grid grid-cols-2 md:grid-cols-12 gap-2">
                                <div className={`${commonStyle} md:col-span-2`}>
                                    <p className="capitalize font-semibold">
                                        {item.name}
                                    </p>
                                </div>
                                <div className={`${commonStyle} md:col-span-6`}>
                                    <p>{item.description}</p>
                                </div>
                                <div className={`${commonStyle} md:col-span-1`}>
                                    <p>${item.price}</p>
                                </div>
                                <div className={`${commonStyle} md:col-span-2 flex flex-wrap gap-2`}>
                                    {item.categories.map((cat, i) => (
                                        <p
                                            key={i}
                                            className="text-sm rounded-full bg-gray-900 text-gray-100 px-3 py-1 shadow-md hover:bg-gray-700 transition-all duration-300">
                                            {cat}
                                        </p>
                                    ))}
                                </div>
                                <div
                                    className={`${commonStyle} md:col-span-1 text-xl flex gap-2`}
                                >
                                    <button
                                        onClick={() => {
                                            setProductEdit(item);
                                            setModal(true);
                                            setModalEdit(true);
                                        }}
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        onClick={() => {
                                            setProductEdit(item);
                                            setDeleteModal(true);
                                        }}
                                    >
                                        <RiDeleteBin6Line color="red" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 flex-wrap px-4 py-2 bg-gray-50 border-t border-neutral-200">
                                {item.images.map((img, idx) => (
                                    <div
                                        key={idx}
                                        className={`w-16 h-16 rounded overflow-hidden border ${idx === 0
                                            ? "border-2 border-blue-500 shadow-md"
                                            : "border-neutral-300"
                                            }`}
                                    >
                                        <img
                                            src={img.url}
                                            alt={`Producto ${idx + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ))}
                                <button
                                    className="w-16 h-16 flex items-center justify-center border border-neutral-400 rounded hover:bg-neutral-100"
                                    onClick={() => handleAddImage(item.id)}
                                >
                                    +
                                </button>
                            </div>
                        </article>
                    ))
                )}
            </section>
            <div className="flex gap-4 flex-center mt-10">
                <button onClick={prevPage}><IoIosArrowBack /></button>
                <div>{page}</div>
                <button onClick={nextPage}><IoIosArrowForward /></button>
            </div>
        </section>
    );
};

export default Page;
