import { create } from "zustand";
import type { User, UserRole } from "@/types/user.types";
import { MOCK_USERS } from "@/data/mockUsers";

interface AuthState {
    currentUser: User | null;

    setCurrentUser: (user: User) => void;
    loginAs: (role: UserRole) => void;
    logout: () => void;

    isAdmin: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    currentUser: null,

    setCurrentUser: (user) => set({ currentUser: user }),

    loginAs: (role) => {
        const user = MOCK_USERS.find((u) => u.role === role) || null;
        set({ currentUser: user });
    },

    logout: () => set({ currentUser: null }),

    isAdmin: () => get().currentUser?.role === "ADMIN",
}));
