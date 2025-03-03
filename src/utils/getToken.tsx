import { jwtDecode } from "jwt-decode";

export const getToken = () => {
    return localStorage.getItem('token');
}


export const getUserInfo = () => {
    const token = localStorage.getItem('token');
    if (!token) {
        return null;
    }

    try {
        return jwtDecode(token);
    } catch (error) {
        console.error("Error al decodificar el token:", error);
        return null;
    }
}