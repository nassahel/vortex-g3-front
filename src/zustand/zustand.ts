import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { userDataSlice } from './userDataSlice';




const useAppStore = create()(
    persist(
        (set) => ({
            ...userDataSlice(set),
        }),
        {
            name: 'user-session-store',
        }
    )

)

export default useAppStore

