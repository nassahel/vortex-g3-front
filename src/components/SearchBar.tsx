"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { IoSearchOutline } from "react-icons/io5";
import Image from "next/image";
import Link from "next/link";

interface Product {
    id: string;
    name: string;
    price: number;
    images: { url: string }[];
}

const SearchBar = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(
        searchParams.get("search") || ""
    );
    const [suggestions, setSuggestions] = useState<Product[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const searchContainerRef = useRef<HTMLDivElement>(null);
    const URL = process.env.NEXT_PUBLIC_API_URL;

    // Cerrar sugerencias al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                searchContainerRef.current &&
                !searchContainerRef.current.contains(event.target as Node)
            ) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Búsqueda con debounce
    useEffect(() => {
        const debounceTimeout = setTimeout(async () => {
            if (searchTerm.trim().length >= 2) {
                setIsLoading(true);
                try {
                    const response = await fetch(
                        `${URL}product/all?name=${encodeURIComponent(
                            searchTerm.trim()
                        )}`
                    );
                    const data = await response.json();
                    setSuggestions(data.data || []);
                    setShowSuggestions(true);
                } catch (error) {
                    console.error("Error al buscar sugerencias:", error);
                    setSuggestions([]);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        }, 300); // Espera 300ms después de que el usuario deje de escribir

        return () => clearTimeout(debounceTimeout);
    }, [searchTerm]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
            setShowSuggestions(false);
        }
    };

    return (
        <div ref={searchContainerRef} className="w-full max-w-xl relative">
            <form onSubmit={handleSearch} className="relative">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() =>
                        searchTerm.trim().length >= 2 &&
                        setShowSuggestions(true)
                    }
                    placeholder="Buscar productos..."
                    className="w-full px-4 py-2 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:border-black transition-colors"
                />
                <button
                    type="submit"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                >
                    <IoSearchOutline size={20} />
                </button>
            </form>

            {/* Panel de sugerencias */}
            {showSuggestions && (
                <div className="absolute w-full mt-1 bg-white border rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
                    {isLoading ? (
                        <div className="p-4 text-center text-gray-500">
                            Buscando...
                        </div>
                    ) : suggestions.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                            No se encontraron productos
                        </div>
                    ) : (
                        suggestions.map((product) => (
                            <Link
                                href={`/${product.id}`}
                                key={product.id}
                                className="flex items-center gap-4 p-3 hover:bg-gray-50 transition-colors cursor-pointer"
                                onClick={() => setShowSuggestions(false)}
                            >
                                <div className="w-12 h-12 relative">
                                    <Image
                                        src={
                                            product.images?.[0]?.url ||
                                            "/img/default-product.webp"
                                        }
                                        alt={product.name}
                                        fill
                                        className="object-cover rounded"
                                    />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">
                                        {product.name}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        ${product.price.toLocaleString()}
                                    </p>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchBar;
