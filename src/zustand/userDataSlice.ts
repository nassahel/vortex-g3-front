import { jwtDecode } from "jwt-decode";

interface UserState {
    token: string;
    name: string;
    rol: string;
    id: string;
    setToken: (token: string) => void;
    logout: () => void;
}

interface Decoded {
    userName: string;
    userId: string;
    userRol: string;
}


export const userDataSlice = (set: any): UserState => ({
    token: '',
    name: '',
    rol: '',
    id: '',
    setToken: (token: string) => {

        try {
            const decoded: Decoded = jwtDecode(token);
    
            set({
                token,
                name: decoded.userName,
                id: decoded.userId,
                rol: decoded.userRol
            })
        } catch (error) {
            console.error('Error al decodificar el token:', error);
        }
    },
    logout: () =>
        set({
            token: '',
            name: '',
            id: '',
            rol: '',
        }),

})