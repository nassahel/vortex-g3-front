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
      const fetchUser = async () => {
        try {
          const response = await fetch(USERS_API);
          if (!response.ok) throw new Error("Error al obtener usuarios activos");
  
          const data = await response.json();
          const usersList = data.data || [];

          if (!data || !Array.isArray(usersList) || usersList.length === 0) {
            throw new Error("No hay usuarios activos");
          }
  
          const activeUser = usersList[0]; // Suponiendo que el primer usuario es el activo
          setUser(activeUser);

        } catch (err) {
            throw new Error("No hay usuario logueado, se usará localStorage para el carrito.");
        }
      };
  
      fetchUser();
    }, []);
  
    useEffect(() => {
        const fetchCart = async () => {
            try {
                setLoading(true);

                if (user) {
                    // Si el usuario está logueado, cargar el carrito desde la API
                    const response = await fetch(`${CART_API}/${user.id}`);
                    if (!response.ok) throw new Error("Error al obtener el carrito");

                    const data = await response.json();

                    const cartItems = data.data.items;

                    // Obtener detalles de cada producto
                    const productsPromises = cartItems.map(async (item: any) => {
                        const productRes = await fetch(`${PRODUCTS_API}/${item.productId}`);
                        const productData = await productRes.json();

                        return {
                            id: item.productId,
                            name: productData.name,
                            image: productData.image || "/img/default-product.jpg",
                            size: productData.size || "N/A",
                            color: productData.color || "N/A",
                            price: parseFloat(item.price),
                            quantity: item.quantity,
                        };
                    });

                    const products = await Promise.all(productsPromises);
                    setCart(products);
                } else {
                    // Si el usuario NO está logueado, cargar carrito desde localStorage
                    const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
                    setCart(localCart);
                }
            } catch (err) {
                console.error("Error al obtener el carrito", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchCart();
    }, [user]);

    // Función para agregar un producto al carrito
    const addToCart = (product: CartItem) => {
        let updatedCart;

        if (user) {
            // Si el usuario está logueado, enviar el producto al backend
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/item/${product.id}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId: product.id, quantity: 1 }),
            }).then(() => fetchCart());
        } else {
            // Si el usuario NO está logueado, actualizar `localStorage`
            updatedCart = [...cart, product];
            localStorage.setItem("cart", JSON.stringify(updatedCart));
            setCart(updatedCart);
        }
    };
  
    const handleQuantityChange = async (productId: string, delta: number) => {
    
        if (!user || !user.id) {
            console.error("Usuario no autenticado.");
            return;
        }

        if (!productId) {
            console.error("Error: productId es `undefined` o vacío.");
            return;
        }
        const currentItem = cart.find(item => item.id === productId || item.productId === productId);

        if (!currentItem) {
            console.error("Error: Producto no encontrado en el carrito.");
            return;
        }
        
        const newQuantity = currentItem.quantity + delta;

        if (newQuantity < 1) {
            return handleRemoveItem(productId);
        }

        setCart(cart.map(item => 
            item.id === productId || item.productId === productId 
                ? { ...item, quantity: newQuantity } 
                : item
        ));

        const url = `${process.env.NEXT_PUBLIC_API_URL}cart/item/${user.id}`;
    
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId, quantity: newQuantity }),
            });
    
            const responseData = await response.json();
    
            if (!response.ok) {
                console.error("Error en la API:", responseData);
            }
    
        } catch (error) {
            console.error("Error en `fetch`:", error);
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
      <h3 className="font-sans mb-5 text-gray-500"> Home {">"} Cart</h3>

      <h1 className="text-3xl font-sans font-black mb-6">YOUR CART</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de productos */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg border">
          {cart.length > 0 ? (
              cart.map(item => {
                return (
                    <div key={item.id} className="flex items-center gap-4 border-b py-4">
                        <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-md" />
                        <div className="flex-1">
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
                                className="px-3 py-1 border rounded-lg"
                            >
                                −
                            </button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <button 
                                onClick={() => {
                                    const productId = item.productId || item.id; // 🔥 Usa `id` si `productId` es `undefined`
                                    handleQuantityChange(productId, 1);
                                }}                               
                                className="px-3 py-1 border rounded-lg"
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
                );
            })
        ) : (
          <p className="text-gray-500">Your cart is empty.</p>
        )}
            
        </div>

        {/* Resumen del pedido */}
        <div className="bg-white p-6 rounded-lg border">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          <div className="flex justify-between text-lg">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg text-red-500">
            <span>Discount (-10%)</span>
            <span>-${discount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg">
            <span>Delivery Fee</span>
            <span>${deliveryFee.toFixed(2)}</span>
          </div>
          <hr className="my-4" />
          <div className="flex justify-between text-xl font-bold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

          {/* Código de descuento */}
          <div className="mt-4 flex items-center gap-2">
            <input
              type="text"
              placeholder="Add promo code"
              className="w-full border px-3 py-2 rounded-lg"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
            />
            <button className="bg-black text-white px-4 py-2 rounded-lg">Apply</button>
          </div>

          {/* Botón de checkout */}
          <Link href="/checkout">
            <button 
                className="w-full bg-black text-white text-lg font-bold py-3 rounded-lg mt-4 flex items-center justify-center gap-2"
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
