"use client";
import AddEditProductModal from "@/components/modals/AddEditProductModal";
import { DeleteModal } from "@/components/modals/DeleteModal";
import React, { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";

interface Product {
    id: string
    categories: string[];
    description: string;
    images: Image[];
    name: string;
    price: number;
    stock: number;
}

interface Image {
    url: string;
}

const page = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [modal, setModal] = useState(false);
    const [productEdit, setProductEdit] = useState<Product | null>(null);
    const [modalEdit, setModalEdit] = useState(false);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState<boolean>(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const URL = process.env.NEXT_PUBLIC_API_URL;
    const [refresh, setRefresh] = useState<number>(0)

    useEffect(() => {
        const fetchActiveProducts = async () => {
            try {
                setLoading(true);
                const response = await fetch(URL + "product/all");
                const data = await response.json();
                setProducts(data.data);
                setLoading(false);
            } catch (error) {
                console.error("No se pudo obtener los datos", error);
            }
        };
        fetchActiveProducts();
    }, [deleteModal, refresh]);



    const handleAddImage = async (productId: string) => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";

        input.onchange = async (e: any) => {
            const file = e.target.files[0];
            if (!file) return;

            const formData = new FormData();
            formData.append("image", file);

            try {
                const response = await fetch(
                    `${URL}images/upload-image/${productId}`,
                    {
                        method: "POST",
                        body: formData,
                    }
                );

                const result = await response.json();
                setRefresh(Math.random())

                if (response.ok) {
                } else {
                    console.error("Error al subir la imagen", result.message);
                }
            } catch (error) {
                console.error("Error de conexión", error);
            }
        };
        input.click();
    };

    const commonStyle = " p-3";


    const filteredProducts = search !== '' ? products.filter(product => (product.name.toLowerCase().trim().includes(search.toLowerCase().trim()))) : products;


    return (
        <section className="relative">
            {modal && (
                <AddEditProductModal
                    setModal={setModal}
                    user={productEdit}
                    isEditing={modalEdit}
                />
            )}
            {deleteModal && (
                <DeleteModal
                    setDeleteModal={setDeleteModal}
                    elemento="producto"
                    nombre={productEdit?.name}
                    itemId={productEdit?.id || ""}
                    ruta="product/delete/"
                />
            )}
            <div className="flex justify-between">
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="bg-white py-2 px-4 my-2 rounded-md border-2 border-neutral-400 outline-none w-[25rem]"
                    type="search"
                    placeholder="Buscar productos..."
                />
                <button
                    onClick={() => {
                        setModal(true);
                        setModalEdit(false);
                    }}
                    className="bg-white py-2 px-4 my-2 rounded-md border-2 border-neutral-400 hover:border-black duration-200"
                >
                    Agregar Producto
                </button>
            </div>

            <div >
                <section className="flex flex-col rounded-md overflow-hidden">
                    {/* Encabezado */}
                    <article className="bg-gray-800 text-white flex font-semibold">
                        <div className="flex w-full">
                            <div className={`${commonStyle} w-2/12`}>
                                <p className="capitalize">Nombre</p>
                            </div>
                            <div className={`${commonStyle} w-6/12`}>
                                <p>Descripción</p>
                            </div>
                            <div className={`${commonStyle} w-1/12`}>
                                <p>Precio</p>
                            </div>
                            <div className={`${commonStyle} w-2/12`}>
                                <p>Categoría</p>
                            </div>
                            <div className={`${commonStyle} w-1/12`}>
                                Opciones
                            </div>
                        </div>
                    </article>

                    {/* Productos */}
                    {loading ? (
                        <p className="mt-6 text-lg">Cargando...</p>
                    ) : (
                        filteredProducts.map((item: Product, i) => (
                            <article
                                key={i}
                                className="bg-white overflow-hidden border-t border-gray-400 flex flex-col">
                                <div className="flex">
                                    <div className="flex w-full">
                                        <div className={`${commonStyle} w-2/12`}>
                                            <p className="capitalize font-semibold">                                                {item.name}</p>
                                        </div>
                                        <div className={`${commonStyle} w-6/12`}>
                                            <p>{item.description}</p></div>
                                        <div className={`${commonStyle} w-1/12`}>
                                            <p>${item.price}</p>
                                        </div>
                                        <div className={`${commonStyle} w-2/12 flex-wrap flex items-start`}>
                                            {item.categories.map(
                                                (cat: any, i) => (
                                                    <p key={i} className="border border-neutral-700 text-xs rounded-lg bg-white w-fit m-1 px-1">{cat}</p>
                                                )
                                            )}
                                        </div>
                                        <div className={`${commonStyle} w-1/12 text-xl flex gap-4`}>
                                            <button
                                                onClick={() => {
                                                    setProductEdit(item);
                                                    setModal(true);
                                                    setModalEdit(true);
                                                }}>
                                                <FaEdit />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setProductEdit(item);
                                                    setDeleteModal(true);
                                                }}>
                                                <RiDeleteBin6Line color="red" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 flex-wrap px-4 py-2 bg-gray-50">
                                    {item.images.map((img, idx) => (
                                        <div
                                            key={idx}
                                            className={`w-16 h-16 rounded overflow-hidden border ${idx === 0
                                                ? "border-2 border-blue-500 shadow-md"
                                                : "border-neutral-300"
                                                }`}>
                                            <img
                                                src={img.url}
                                                alt={`Producto ${idx + 1}`}
                                                className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                    <button className="w-16 h-16 flex items-center justify-center border border-neutral-400 rounded hover:bg-neutral-100" onClick={() => handleAddImage(item.id)}>+</button>
                                </div>
                            </article>
                        ))
                    )}
                </section>
            </div>
        </section>
    );
};

export default page;
