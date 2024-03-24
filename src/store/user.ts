import { create } from "zustand";

interface UserState {
	refresh: number;
	setRefresh: (refresh: number) => void;
}

export const useUserStore = create<UserState>()((set, _get) => ({
	refresh: 0,
	setRefresh: (refresh) => set({ refresh }),
}));
