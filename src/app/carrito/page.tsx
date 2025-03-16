"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { IoTrashOutline } from "react-icons/io5";
import { CartItem } from "@/types/types";
import BtnCategory from "@/components/BtnCategory";
import { IoIosArrowForward, IoIosSearch } from "react-icons/io";
import { CiShoppingCart } from "react-icons/ci";
import Navbar from "@/components/Navbar";
import { checkoutService } from "@/services/checkout.service";
import { jwtDecode } from "jwt-decode";
import { FaArrowRightLong, FaRegCreditCard } from "react-icons/fa6";
import { SiMercadopago } from "react-icons/si";
import MercadoPago from "@/components/icons/MercadoPago";
import CardPaymentModal from "@/components/modals/CardPaymentModal";

const USERS_API = `${process.env.NEXT_PUBLIC_API_URL}users/get-all-active`;
const CART_API = `${process.env.NEXT_PUBLIC_API_URL}cart/active`;
const PRODUCTS_API = `${process.env.NEXT_PUBLIC_API_URL}product`;

const CartPage = () => {
    const router = useRouter();
    const [cart, setCart] = useState<CartItem[]>([]);
    const [user, setUser] = useState<{ userRol: string; id: string } | null>(
        null
    );
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [promoCode, setPromoCode] = useState("");
    const [method, setMethod] = useState<"mercadopago" | "card">("mercadopago");
    const [isCardPaymentModalOpen, setIsCardPaymentModalOpen] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            try {
                const decodedUser = jwtDecode<{
                    userRol: string;
                    userId: string;
                }>(token);
                if (!decodedUser.userId)
                    throw new Error("Token inválido: No tiene userId");

                setUser({
                    id: decodedUser.userId,
                    userRol: decodedUser.userRol,
                }); // 🔥 Ajuste aquí
            } catch (error) {
                console.error("❌ Error al decodificar el token:", error);
                setUser(null);
            }
        } else {
            setUser(null);
        }
    }, []);

    useEffect(() => {
        const fetchCart = async () => {
            try {
                setLoading(true);
                setError(false);

                const token = localStorage.getItem("token");
                if (!token) {
                    setCart([]); // No hay usuario, carrito vacío
                    return;
                }

                const decodedUser = jwtDecode<{
                    userRol: string;
                    userId: string;
                }>(token);

                if (!decodedUser.userId) {
                    return;
                }

                const response = await fetch(
                    `${CART_API}/${decodedUser.userId}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                if (!response.ok) {
                    console.error(
                        "❌ Error en la API:",
                        response.status,
                        response.statusText
                    );
                    throw new Error("Error al obtener el carrito");
                }

                const data = await response.json();

                const productDetailsPromises = data.data.items.map(
                    async (item: CartItem) => {
                        const productResponse = await fetch(
                            `${PRODUCTS_API}/${item.productId}`
                        );
                        const productData = await productResponse.json();
                        return {
                            ...item,
                            name: productData.name || "Producto sin nombre",
                            image:
                                productData.images?.[0] ||
                                "/img/default-product.jpg",
                            size: "N/A",
                            color: "N/A",
                        };
                    }
                );

                const detailedCart = await Promise.all(productDetailsPromises);
                setCart(detailedCart);
            } catch (err) {
                console.error("🚨 Error al obtener el carrito:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchCart();
    }, [user]);

    const handleQuantityChange = async (productId: string, delta: number) => {
        const currentItem = cart.find(
            (item) => item.id === productId || item.productId === productId
        );
        if (!currentItem) return;

        const newQuantity = currentItem.quantity + delta;
        if (newQuantity < 1) return handleRemoveItem(productId);

        if (user?.id) {
            // 🔥 Si el usuario está logueado, actualizar en el backend
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}cart/item/${user.id}`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            productId,
                            quantity: newQuantity,
                        }),
                    }
                );

                if (!response.ok)
                    throw new Error("Error al actualizar el carrito");
            } catch (error) {
                console.error("Error al actualizar carrito:", error);
            }
        } else {
            // 🔥 Si el usuario NO está logueado, actualizar `localStorage`
            const updatedCart = cart.map((item) =>
                item.id === productId || item.productId === productId
                    ? { ...item, quantity: newQuantity }
                    : item
            );

            localStorage.setItem("cart", JSON.stringify(updatedCart));
            setCart(updatedCart);
        }
    };

    const handleRemoveItem = async (productId: string) => {
        if (!user || !user.id) {
            console.error("Usuario no autenticado.");
            return;
        }
        setCart(
            cart.filter(
                (item) => item.id !== productId && item.productId !== productId
            )
        );

        const url = `${process.env.NEXT_PUBLIC_API_URL}cart/item/${user.id}/${productId}`;

        try {
            const response = await fetch(url, {
                method: "DELETE",
            });

            const responseData = await response.json();

            if (!response.ok) {
                console.error(
                    "Error en la API al eliminar producto:",
                    responseData
                );
                throw new Error("Error al eliminar producto del carrito");
            }
        } catch (error) {
            console.error("Error en `fetch` (eliminar producto):", error);
        }
    };

    const handleCheckout = async () => {
        if (!user) {
            console.error("Usuario no autenticado.");
            return;
        }
        try {
            const res = await checkoutService(user.id, "MercadoPago");
            //redirige a mercado pago mediante el link
            router.replace(res.link);
        } catch (error) {
            console.error("Error al realizar el pago:", error);
        }
    };

    const subtotal = cart.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );
    const discount = subtotal * 0.1; // 10% de descuento
    const deliveryFee = 15;
    const total = subtotal - discount + deliveryFee;

    return (
        <>
            <Navbar />

            <div className="max-w-7xl py-4 mx-auto px-4 lg:mt-8">
                <h1 className="text-2xl sm:text-3xl font-sans font-black mb-6">
                    TU CARRITO
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Lista de productos */}
                    <div className="md:col-span-2 bg-white p-4 sm:p-6 rounded-lg border min-h-[350px]">
                        {cart.length > 0 ? (
                            cart.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex flex-col sm:flex-row items-center gap-4 border-b py-4"
                                >
                                    <img
                                        src={
                                            item?.image ||
                                            "/img/default-product.jpg"
                                        }
                                        alt={item.name || "Producto"}
                                        className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md"
                                    />

                                    <div className="flex-1 text-center sm:text-left">
                                        <h2 className="text-lg font-semibold">
                                            {item.name}
                                        </h2>
                                        <p className="ml-3 text-sm text-gray-500">
                                            Talle: {item.size}
                                        </p>
                                        <p className="ml-3 text-sm text-gray-500">
                                            Color: {item.color}
                                        </p>
                                        <p className="text-lg font-semibold mt-2">
                                            ${item.price}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => {
                                                const productId =
                                                    item.productId || item.id;
                                                handleQuantityChange(
                                                    productId,
                                                    -1
                                                );
                                            }}
                                            className="px-3 py-1 border rounded-full w-8 h-8 flex items-center justify-center"
                                        >
                                            −
                                        </button>

                                        <span className="w-8 text-center">
                                            {item.quantity}
                                        </span>

                                        <button
                                            onClick={() => {
                                                const productId =
                                                    item.productId || item.id;
                                                handleQuantityChange(
                                                    productId,
                                                    1
                                                );
                                            }}
                                            className="px-3 py-1 border rounded-full w-8 h-8 flex items-center justify-center"
                                        >
                                            +
                                        </button>
                                    </div>

                                    <button
                                        onClick={() =>
                                            handleRemoveItem(
                                                item.productId || item.id
                                            )
                                        }
                                        className="text-red-500 text-xl ml-4"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="flex justify-center items-center h-full w-full">
                                <p className="text-gray-500 text-center flex flex-col items-center gap-2">
                                    <CiShoppingCart className="size-12" />
                                    Tu carrito está vacío
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Resumen del pedido */}
                    <div className="col-span-1 bg-white p-4 sm:p-6 rounded-lg border">
                        <h2 className="text-lg sm:text-xl font-bold mb-4 text-center sm:text-left">
                            Detalle del Pedido
                        </h2>

                        <div className="flex justify-between text-base sm:text-lg">
                            <span>Subtotal</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-base sm:text-lg text-red-500">
                            <span>Descuento (-10%)</span>
                            <span>-${discount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-base sm:text-lg">
                            <span>Envío</span>
                            <span>${deliveryFee.toFixed(2)}</span>
                        </div>

                        <hr className="my-4" />

                        <div className="flex justify-between text-lg sm:text-xl font-bold">
                            <span>Total</span>
                            <span>${total.toFixed(2)}</span>
                        </div>

                        {/* Código de descuento */}
                        <div className="mt-4 flex flex-col sm:flex-row items-center gap-2">
                            <input
                                type="text"
                                placeholder="Add promo code"
                                className="w-full border px-4 py-2 rounded-full text-center sm:text-left"
                                value={promoCode}
                                onChange={(e) => setPromoCode(e.target.value)}
                            />
                            <button
                                className="bg-black text-white px-4 py-2 rounded-full w-full sm:w-auto disabled:opacity-50"
                                disabled={cart.length === 0}
                            >
                                Aplicar
                            </button>
                        </div>
                        <div className="flex flex-col gap-2 py-4">
                            <p className="text-lg font-semibold">
                                Método de pago:
                            </p>
                            <div className="flex flex-col md:flex-row gap-4">
                                <label htmlFor="mercadopago">
                                    <input
                                        type="radio"
                                        id="mercadopago"
                                        name="method"
                                        checked={method === "mercadopago"}
                                        onChange={() =>
                                            setMethod("mercadopago")
                                        }
                                        className="mr-1"
                                    />
                                    Mercado Pago
                                </label>
                                <label htmlFor="card">
                                    <input
                                        id="card"
                                        type="radio"
                                        name="method"
                                        checked={method === "card"}
                                        onChange={() => setMethod("card")}
                                        className="mr-1"
                                    />
                                    Tarjeta de crédito
                                </label>
                            </div>
                        </div>
                        {method === "mercadopago" ? (
                            <button
                                className="w-full bg-[#009EE3] hover:bg-[#009EE3]/80 text-white font-semibold py-3 rounded-full mt-4 flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
                                onClick={handleCheckout}
                                disabled={cart.length === 0}
                            >
                                <MercadoPago className="size-5" />
                                Continuar con Mercado Pago
                            </button>
                        ) : (
                            <button
                                className="w-full bg-black hover:bg-black/80 text-white font-semibold py-3 rounded-full mt-4 flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
                                onClick={() => setIsCardPaymentModalOpen(true)}
                                disabled={cart.length === 0}
                            >
                                <FaRegCreditCard />
                                Completar pago con tarjeta
                            </button>
                        )}
                    </div>
                </div>
            </div>
            {isCardPaymentModalOpen && (
                <CardPaymentModal
                    isOpen={isCardPaymentModalOpen}
                    onClose={() => setIsCardPaymentModalOpen(false)}
                    total={subtotal}
                    idUser={user?.id || ""}
                />
            )}
        </>
    );
};

export default CartPage;
