"use client";
import Link from "next/link";
import { useState } from "react";

interface FormData {
    email: string;
    password: string;
}

const page = () => {
    const [loading, setLoading] = useState(false);
    const [errorType, setErrorType] = useState([]);
    const [formData, setFormData] = useState<FormData>({
        email: "",
        password: "",
    });

    const inputStyle: string =
        "border rounded-lg py-2 px-4 outline-blue-600 mb-4";
    const labelStyle: string = "";

    const login = async (e: React.FormEvent<HTMLFormElement>) => {
        setLoading(true);
        e.preventDefault();
        const URL = process.env.NEXT_PUBLIC_API_URL + "auth/login";

        if (formData.email === "" || formData.password === "") {
            setLoading(false);
            // return setErrorType("datosIncompletos");
        }

        try {
            const response = await fetch(URL, {
                method: "POST",
                body: JSON.stringify(formData),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const res = await response.json()
            console.log(res);

            if (!response.ok) {

                if (res.errorMessages) {
                    setErrorType(res.errorMessages)
                }
                if (res.message)
                    setErrorType([res.message])
                return
            }
            
            setLoading(false);
            localStorage.setItem("token", res.token);
            window.location.href = "/";
        } catch (error) {
            setLoading(false);
            console.log("Error al enviar los datos:", error);
        }
    };

    return (
        <div className="px-2 sm:px-4 min-h-screen flex items-center justify-center">
            <div>
                <form
                    onSubmit={login}
                    className="flex flex-col bg-white px-6 py-6 w-full min-w-80 max-w-[28rem] border rounded-lg"
                >
                    <h2 className="text-center text-4xl font-semibold mb-4">
                        Iniciar sesión
                    </h2>

                    <label className={labelStyle} htmlFor="email">
                        Email
                    </label>
                    <input
                        value={formData.email}
                        onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                        }
                        className={inputStyle}
                        type="text"
                        name="email"
                        id="email"
                    />

                    <label className={labelStyle} htmlFor="password">
                        Contraseña
                    </label>
                    <input
                        value={formData.password}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                password: e.target.value,
                            })
                        }
                        className={inputStyle}
                        type="text"
                        name="password"
                        id="password"
                    />

                    <button
                        type="submit"
                        className="bg-neutral-500 mb-2 hover:bg-neutral-700 duration-300 text-white text-lg font-semibold py-2 rounded-lg"
                    >
                        {loading ? "Ingresando..." : "Ingresar"}
                    </button>
                    {errorType.map((error, i) => (
                        <p className="text-red-600 p-0 text-sm leading-4 text-center" key={i}>{error}</p>
                    ))}
                </form>

                <div className="text-center mt-4">
                    <p>
                        No tenés cuenta?{" "}
                        <Link href="/user/register" className="font-semibold">
                            Registrarse
                        </Link>
                    </p>
                    <Link
                        className="text-sm font-semibold"
                        href="/user/request-recovery-password"
                    >
                        Olvidé mi contraseña
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default page;
