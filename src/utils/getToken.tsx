import { jwtDecode } from "jwt-decode";

export const getAndVerifyToken = () => {
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "/";
        return null;
    }

    try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp < currentTime) {
            localStorage.removeItem("token");
            window.location.href = "/";
            return null;
        }

        return { user: decoded, token };
    } catch (error) {
        console.error("Error al decodificar el token:", error);
        window.location.href = "/";
        return null;
    }
};
