"use client";

import AddEditProductModal from "@/components/modals/AddEditProductModal";
import { DeleteModal } from "@/components/modals/DeleteModal";
import { Product } from "@/types/types";
import React, { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";

const page = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [modal, setModal] = useState(false);
    const [productEdit, setProductEdit] = useState<Product | null>(null);
    const [modalEdit, setModalEdit] = useState(false);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState<boolean>(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const URL = process.env.NEXT_PUBLIC_API_URL;

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
    }, [deleteModal]);

    console.log(products);

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

                if (response.ok) {
                } else {
                    console.error("Error al subir la imagen", result.message);
                }
            } catch (error) {
                console.error("Error de conexión", error);
            }
        };

        input.click(); // Abrir el selector de archivos
    };

    const commonStyle = "flex-center border-e p-2";

    return (
        <section className="relative">
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
                    modalText="¿Estás seguro de que deseas borrar este producto?"
                    itemId={productEdit?.id || ""}
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

            <div>
                <section className="flex flex-col gap-1">
                    {/* Encabezado */}
                    <article className="bg-neutral-800 text-white rounded-md flex font-semibold">
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
                        products.map((item: Product, i) => (
                            <article
                                key={i}
                                className="bg-white overflow-hidden rounded-md border border-neutral-200 flex flex-col"
                            >
                                <div className="flex">
                                    <div className="flex w-full">
                                        <div
                                            className={`${commonStyle} w-2/12`}
                                        >
                                            <p className="capitalize font-semibold">
                                                {item.name}
                                            </p>
                                        </div>
                                        <div
                                            className={`${commonStyle} w-6/12`}
                                        >
                                            <p>{item.description}</p>
                                        </div>
                                        <div
                                            className={`${commonStyle} w-1/12`}
                                        >
                                            <p>${item.price}</p>
                                        </div>
                                        <div
                                            className={`${commonStyle} w-2/12 gap-1 flex-wrap`}
                                        >
                                            {item.categories.map(
                                                (cat: any, i) => (
                                                    <p
                                                        key={i}
                                                        className="border border-neutral-700 text-sm rounded-lg bg-white w-fit px-1"
                                                    >
                                                        {cat}
                                                    </p>
                                                )
                                            )}
                                        </div>
                                        <div
                                            className={`${commonStyle} w-1/12 text-xl gap-4`}
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
                                </div>
                                <div className="flex items-center gap-2 flex-wrap px-4 py-2 bg-gray-50 border-t border-neutral-200">
                                    {item.images.map((img, idx) => (
                                        <div
                                            key={idx}
                                            className={`w-16 h-16 rounded overflow-hidden border ${
                                                idx === 0
                                                    ? "border-2 border-blue-500 shadow-md"
                                                    : "border-neutral-300"
                                            }`}
                                        >
                                            {/* Asegúrate de usar 'img.url' para acceder a la URL de la imagen */}
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
            </div>
        </section>
    );
};

export default page;
