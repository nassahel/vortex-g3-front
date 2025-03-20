"use client";
import AddCategoryModal from "@/components/modals/AddCategoryModal";
import { DeleteModal } from "@/components/modals/DeleteModal";
import React, { useEffect, useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";

interface Categorie {
    id: string;
    name: string;
}

const Page = () => {
    const [categories, setCategories] = useState([]);
    const [modal, setModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const URL = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(URL + "/category/all");
                const data = await response.json();

                setCategories(data.data);
            } catch (error) {
                console.error("No se pudo obtener los datos", error);
            }
        };
        fetchCategories();
    }, [modal, deleteModal]);

    const openModal = (id: string) => {
        setSelectedId(id);
        setDeleteModal(true);
    };


    const filteredCategories =
        search !== ""
            ? categories.filter((categorie: Categorie) =>
                categorie.name
                    .toLowerCase()
                    .trim()
                    .includes(search.toLowerCase().trim())
            )
            : categories;

    return (
        <section className="relative">
            {modal && <AddCategoryModal setModal={setModal} />}
            {deleteModal && (<DeleteModal
                itemId={selectedId}
                elemento="categoria"
                ruta="/category/delete/"

                setDeleteModal={setDeleteModal} />
            )}

            <div className="flex justify-between">
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="bg-white py-2 px-4 my-2 rounded-md border-2 border-neutral-400 outline-none w-[25rem]"
                    type="search"
                    name="searchProd"
                    placeholder="Buscar categorías..."
                />
                <button
                    onClick={() => setModal(true)}
                    className="bg-white text-neutral-800 py-2 px-4 my-2 rounded-md border-2 border-neutral-400 hover:bg-neutral-200 duration-200"
                >
                    Agregar categoría
                </button>
            </div>

            <div>
                <section className="flex flex-col rounded-md overflow-hidden">
                    <article className="bg-gray-800 text-white flex h-12 w-full">
                        <p className="px-4 flex items-center w-full py-2 border-e h-full font-semibold">
                            Nombre
                        </p>
                        <div className="flex  items-center justify-center">
                            <p className="w-48 flex justify-center font-semibold">
                                Borrar
                            </p>
                        </div>
                    </article>

                    {categories.length !== 0 ? (
                        filteredCategories.map((item: Categorie, i) => (
                            <article
                                key={i}
                                className="bg-white flex h-12 border-b w-full"
                            >
                                <p className="px-4 flex items-center w-full py-2 border-e h-full">
                                    {item.name}
                                </p>
                                <div className="flex items-center justify-center">
                                    <button
                                        className="text-red-500 w-48 flex justify-center items-center hover:bg-red-200 h-full rounded-md duration-200"
                                        onClick={() => openModal(item.id)}
                                    >
                                        <RiDeleteBin6Line />
                                    </button>
                                </div>
                            </article>
                        ))
                    ) : (
                        <p className="mt-6 text-lg text-center">Cargando...</p>
                    )}
                </section>
            </div>
        </section>
    );
};

export default Page;
