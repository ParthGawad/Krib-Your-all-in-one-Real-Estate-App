import { create } from "zustand"
// Imports the create factory function from the zustand library, which is used to initialize a custom hook representing your global store.

interface UserStore {
    isAdmin: boolean,
    setIsAdmin: (value: boolean) => void,
}

// Defines a Zustand store named useUserStore to manage global user-related state, specifically the isAdmin flag. 
// It re-renders only when the isAdmin value changes.
const useUserStore = create<UserStore>((set) => ({
    isAdmin: false,
    setIsAdmin: (value: boolean) => set({ isAdmin: value }),
}));

export default useUserStore;