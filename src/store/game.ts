import { create } from "zustand";

interface GameState {
	refresh: number;
	setRefresh: (refresh: number) => void;
}

export const useGameStore = create<GameState>()((set, _get) => ({
	refresh: 0,
	setRefresh: (refresh) => set({ refresh }),
}));
