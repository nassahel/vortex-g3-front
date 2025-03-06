"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { IoTrashOutline } from "react-icons/io5";
import { CartItem } from "@/types/types";
import BtnCategory from "@/components/BtnCategory";
import { IoIosSearch } from "react-icons/io";
import { CiShoppingCart } from "react-icons/ci";
import Navbar from "@/components/Navbar";
import { jwtDecode } from "jwt-decode";


const USERS_API = `${process.env.NEXT_PUBLIC_API_URL}users/get-all-active`;
const CART_API = `${process.env.NEXT_PUBLIC_API_URL}cart/active`;
const PRODUCTS_API = `${process.env.NEXT_PUBLIC_API_URL}product`;

    const CartPage = () => {
        const router = useRouter();
        const [cart, setCart] = useState<CartItem[]>([]);
        const [user, setUser] = useState<{ userRol: string; id: string } | null>(null);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState(false);
        const [promoCode, setPromoCode] = useState("");
    
    
        useEffect(() => {
          const token = localStorage.getItem("token");
      
          if (token) {
              try {
                  const decodedUser = jwtDecode<{ userRol: string; userId: string }>(token);
                  if (!decodedUser.userId) throw new Error("Token inválido: No tiene userId");
      
                  setUser({ id: decodedUser.userId, userRol: decodedUser.userRol }); // 🔥 Ajuste aquí
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
                    console.log("🔍 No hay token en localStorage, carrito vacío.");
                    setCart([]); // No hay usuario, carrito vacío
                    return;
                }
    
                const decodedUser = jwtDecode<{ userRol: string; userId: string }>(token);
                console.log("🔍 Usuario decodificado:", decodedUser);
    
                if (!decodedUser.userId) {
                    console.log("🚨 Usuario sin userId en el token, deteniendo.");
                    return;
                }
    
                const response = await fetch(`${CART_API}/${decodedUser.userId}`, {
                    headers: { "Authorization": `Bearer ${token}` },
                });
    
                console.log("🔍 Respuesta de la API de carrito:", response);
    
                if (!response.ok) {
                    console.error("❌ Error en la API:", response.status, response.statusText);
                    throw new Error("Error al obtener el carrito");
                }
    
                const data = await response.json();
                console.log("✅ Datos obtenidos del carrito:", data);
    
                if (!data.data || !data.data.items) {
                    console.warn("⚠️ No hay items en el carrito.");
                    setCart([]);
                } else {
                    setCart(data.data.items);
                }
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
      const currentItem = cart.find(item => item.id === productId || item.productId === productId);
      if (!currentItem) return;
  
      const newQuantity = currentItem.quantity + delta;
      if (newQuantity < 1) return handleRemoveItem(productId);
  
      if (user?.id) {
          // 🔥 Si el usuario está logueado, actualizar en el backend
          try {
              const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}cart/item/${user.id}`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ productId, quantity: newQuantity }),
              });
  
              if (!response.ok) throw new Error("Error al actualizar el carrito");
          } catch (error) {
              console.error("Error al actualizar carrito:", error);
          }
      } else {
          // 🔥 Si el usuario NO está logueado, actualizar `localStorage`
          const updatedCart = cart.map(item => 
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

        console.log("Eliminando producto del carrito, productId:", productId);

        setCart(cart.filter(item => item.id !== productId && item.productId !== productId));

        const url = `${process.env.NEXT_PUBLIC_API_URL}cart/item/${user.id}/${productId}`;
        console.log("🔍 Enviando petición DELETE a:", url);

        try {
            const response = await fetch(url, {
                method: "DELETE",
            });

            const responseData = await response.json();
            console.log("Respuesta del servidor (producto eliminado):", responseData);

            if (!response.ok) {
                console.error("Error en la API al eliminar producto:", responseData);
                throw new Error("Error al eliminar producto del carrito");
            }

        } catch (error) {
            console.error("Error en `fetch` (eliminar producto):", error);
        }
    };


    const handleCheckout = () => {
        if (!user) {
            router.push("/user/login"); // Redirigir a login si no está logueado
        } else {
            router.push("/checkout");
        }
    };
  
    const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const discount = subtotal * 0.1; // 10% de descuento
    const deliveryFee = 15;
    const total = subtotal - discount + deliveryFee;


    return (
        <>
          <Navbar/>
    
          <div className="max-w-7xl mx-auto px-4 lg:mt-8">
            <h3 className="font-sans mb-5 text-gray-500 text-sm sm:text-base mt-5">Home {">"} Cart</h3>
    
            <h1 className="text-2xl sm:text-3xl font-sans font-black mb-6">YOUR CART</h1>
    
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Lista de productos */}
              <div className="md:col-span-2 bg-white p-4 sm:p-6 rounded-lg border">
                {cart.length > 0 ? (
                  cart.map(item => (
                    <div key={item.id} className="flex flex-col sm:flex-row items-center gap-4 border-b py-4">
                      <img src={item.image} alt={item.name} className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md" />
                      
                      <div className="flex-1 text-center sm:text-left">
                        <h2 className="text-lg font-semibold">{item.name}</h2>
                        <p className="text-sm text-gray-500">Size: {item.size}</p>
                        <p className="text-sm text-gray-500">Color: {item.color}</p>
                        <p className="text-lg font-semibold mt-2">${item.price}</p>
                      </div>
    
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => {
                            const productId = item.productId || item.id;
                            handleQuantityChange(productId, -1);
                          }} 
                          className="px-3 py-1 border rounded-full w-8 h-8 flex items-center justify-center"
                        >
                          −
                        </button>
    
                        <span className="w-8 text-center">{item.quantity}</span>
    
                        <button 
                          onClick={() => {
                            const productId = item.productId || item.id;
                            handleQuantityChange(productId, 1);
                          }}                               
                          className="px-3 py-1 border rounded-full w-8 h-8 flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
    
                      <button 
                        onClick={() => handleRemoveItem(item.productId || item.id)}
                        className="text-red-500 text-xl ml-4"
                      >
                        🗑️
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center sm:text-left">Your cart is empty.</p>
                )}
              </div>
    
              {/* Resumen del pedido */}
              <div className="bg-white p-4 sm:p-6 rounded-lg border w-full md:w-[350px] h-fit mx-auto">
                <h2 className="text-lg sm:text-xl font-bold mb-4 text-center sm:text-left">Order Summary</h2>
    
                <div className="flex justify-between text-base sm:text-lg">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base sm:text-lg text-red-500">
                  <span>Discount (-10%)</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base sm:text-lg">
                  <span>Delivery Fee</span>
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
                  <button className="bg-black text-white px-4 py-2 rounded-full w-full sm:w-auto">Apply</button>
                </div>
    
                {/* Botón de checkout */}
                <Link href="/checkout">
                  <button 
                    className="w-full bg-black text-white text-lg font-bold py-3 rounded-full mt-4 flex items-center justify-center gap-2"
                    onClick={handleCheckout}
                  >
                    Go to Checkout →
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </>
    );
    
};

export default CartPage;

function fetchCart(): any {
    throw new Error("Function not implemented.");
}
