export const checkoutService = async (userId: string, payMethod: string) => {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/cart/checkout/${userId}?payMethod=${payMethod}`,
            {
                method: "POST",
            }
        );
        if (res.ok) {
            const data = await res.json();
            return data;
        }
        throw new Error("Error al realizar el pago");
    } catch (error) {
        console.error(error);
        throw error;
    }
};
