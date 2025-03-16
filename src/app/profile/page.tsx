"use client";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { DecodedToken } from "@/types/types";
import ReqAuth from "@/utils/ReqAuth";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import Info from "./sections/Info";
import Purchases from "./sections/Purchases";
import { BiLogOut } from "react-icons/bi";
import { LuPencilLine } from "react-icons/lu";


const page = () => {
    const [user, setUser] = useState<any>();
    const [sectionSelected, setSectionSelected] = useState(0);
    const [image, setImage] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [userImage, setUserImage] = useState(null);

    const logout = () => {
        localStorage.removeItem("token");
        window.location.reload();
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
        }
    };

    const handleUploadImage = async () => {
        const token = localStorage.getItem("token");

        if (!image) {
            console.error("No se ha seleccionado ninguna imagen");
            return;
        }

        const formData = new FormData();
        formData.append("file", image);
        formData.append("userId", user.id);

        setLoading(true);

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}profile/upload-image`,
                {
                    method: "POST",
                    body: formData,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const result = await response.json();

            if (response.ok) {
                console.log("Imagen subida con éxito:", result);
                setUserImage(result.data.userImage);
                setImage(null);
            } else {
                console.error("Error al subir la imagen", result.message);
            }
        } catch (error) {
            console.error("Error de conexión", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const getUserData = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                console.error("No se encontró el token en el localStorage");
                return;
            }

            const decodeToken = jwtDecode<DecodedToken>(token);

            try {
                const response = await fetch(
                    process.env.NEXT_PUBLIC_API_URL +
                    "users/" +
                    decodeToken.userId,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error("Error al obtener los datos del usuario");
                }

                const userData = await response.json();
                setUser(userData);
                setUserImage(userData.profile?.profileImage);
            } catch (error: any) {
                console.error("Error:", error.message);
            }
        };

        getUserData();
    }, [userImage]);

    return (
        <ReqAuth allowedRoles={["ADMIN", "USER"]}>
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <main className="pt-[6rem] max-w-[80rem] mx-auto px-6">
                    {/* Header de perfil */}
                    <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
                        <div className="shrink-0 flex flex-col items-center">
                            <img
                                src={userImage || "/img/default-profile.jpg"}
                                alt="Foto de perfil"
                                className="rounded-full w-[12rem] h-[12rem] object-cover border border-gray-300"
                            />

                            <input
                                type="file"
                                id="image-upload"
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                            {image ? (
                                <button
                                    onClick={handleUploadImage}
                                    className="mt-4 inline-block bg-black text-white text-sm font-medium mx-auto px-5 py-2 rounded-lg hover:bg-gray-800 transition"
                                >
                                    {loading ? "Cargando..." : "Subir"}
                                </button>
                            ) : (
                                <button
                                    onClick={() =>
                                        document
                                            .getElementById("image-upload")
                                            ?.click()
                                    }
                                    className="mt-4 bg-black text-white text-sm font-medium mx-auto px-5 py-2 rounded-lg hover:bg-gray-800 transition flex items-center justify-center"
                                >
                                    <LuPencilLine className="mr-2 size-4" />
                                    Editar
                                </button>
                            )}
                        </div>

                        <div className="space-y-3">
                            <h1 className="text-3xl font-bold text-gray-900">
                                Hola, {user && user.name.split(" ")[0]}!
                            </h1>
                            <p className="text-base text-gray-700">
                                En tu perfil podrás encontrar y editar tu
                                información y ver tus compras.
                            </p>

                            <button
                                onClick={logout}
                                className="bg-red-500 text-white text-sm font-medium px-5 py-2 rounded-lg hover:bg-red-600 transition flex items-center justify-center"
                            >
                                <BiLogOut className="mr-2 size-4" />
                                Cerrar sesión
                            </button>
                        </div>
                    </div>

                    {/* Tabs de secciones */}
                    <div className="flex gap-2 border-b border-gray-300">
                        <button
                            onClick={() => setSectionSelected(0)}
                            className={`w-1/2 text-center py-2 text-sm font-medium border-b-2 ${sectionSelected === 0
                                    ? "border-black text-black"
                                    : "border-transparent text-gray-500 hover:text-black"
                                }`}
                        >
                            Mi información
                        </button>
                        <button
                            onClick={() => setSectionSelected(1)}
                            className={`w-1/2 text-center py-2 text-sm font-medium border-b-2 ${sectionSelected === 1
                                    ? "border-black text-black"
                                    : "border-transparent text-gray-500 hover:text-black"
                                }`}
                        >
                            Mis compras
                        </button>
                    </div>

                    {/* Contenido dinámico */}
                    <div className="py-8">
                        {sectionSelected === 0 ? (
                            <Info user={user && user} />
                        ) : (
                            <Purchases purchases={user && user.cart} />
                        )}
                    </div>
                </main>
                <Footer />
            </div>
        </ReqAuth>
    );
};

export default page;
