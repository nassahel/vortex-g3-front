import { jwtDecode } from 'jwt-decode';
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { userDataSlice } from './userDataSlice';
import { purchaseSlice } from './purchaseSlice';




const useAppStore = create()(
    persist(
        (set) => ({
            ...userDataSlice(set),
            ...purchaseSlice(set),
        }),
        {
            name: 'user-session-store',
        }
    )

)

export default useAppStore

