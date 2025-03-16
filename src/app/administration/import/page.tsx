"use client";
import { useState } from "react";
import Navigation from "@/components/Navigation";

const ImportProductsPage = () => {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>("");
    const URL = process.env.NEXT_PUBLIC_API_URL;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        setError("");

        if (!selectedFile) return;

        // Validar extensión del archivo
        const fileExtension = selectedFile.name.split(".").pop()?.toLowerCase();
        if (fileExtension !== "xlsx") {
            setError("Solo se permiten archivos Excel (.xlsx)");
            e.target.value = "";
            return;
        }

        setFile(selectedFile);
    };

    console.log(error);
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        setLoading(true);
        setError("");
        const token = localStorage.getItem("token");

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch(`${URL}product/upload-products`, {
                method: "POST",
                headers: {
                    Authorization: "Bearer " + token,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Error al importar productos");
            }

            const data = await response.json();
            console.log(data);
            alert(`${data.cantidad} productos importados correctamente`);
            setFile(null);
        } catch (error) {
            setError(
                "Error al importar los productos. Por favor, intente nuevamente."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="">
            <Navigation />
            {/* Encabezado */}
            <div className="my-8">
                <h1 className="text-2xl font-semibold text-gray-900">
                    Importar Productos
                </h1>
                <p className="mt-2 text-sm text-gray-600">
                    Selecciona un archivo Excel (.xlsx) con la lista de
                    productos a importar
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 flex flex-col">
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-700 border-dashed rounded-lg min-h-[200px]">
                    <div className="space-y-1 text-center flex flex-col justify-center items-center">
                        <div className="flex text-gray-400">
                            <label className="relative cursor-pointer rounded-md font-medium text-black hover:text-gray-800 hover:underline">
                                <span>Subir archivo</span>
                                <input
                                    type="file"
                                    className="sr-only"
                                    onChange={handleFileChange}
                                    multiple
                                    accept=".xlsx"
                                />
                            </label>
                            <p className="pl-1">o arrastra y suelta</p>
                        </div>
                        <p className="text-xs text-gray-400">.xlsx hasta 5MB</p>
                    </div>
                </div>
                {file && (
                    <div className="mt-4 w-full bg-gray-100 p-4 rounded-lg">
                        <p className="mb-2">Archivos seleccionados:</p>
                        <ul className="space-y-2">
                            {file && (
                                <li
                                    key={file.name}
                                    className="flex items-center gap-2"
                                >
                                    {file.name}
                                </li>
                            )}
                        </ul>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading || file === null}
                    className="bg-black hover:bg-gray-800 w-auto self-center px-4 py-2 rounded-md text-white disabled:opacity-50"
                >
                    {loading ? <>Cargando...</> : "Subir Documentos"}
                </button>
            </form>

            {/* Descargar plantilla */}
            <div className="mt-6 text-center">
                <a
                    href="/templates/import-products.xlsx"
                    download
                    className="text-sm text-gray-600 hover:text-black transition-colors duration-200 underline"
                >
                    Descargar plantilla de ejemplo
                </a>
            </div>
        </div>
    );
};

export default ImportProductsPage;
