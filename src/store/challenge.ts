import { create } from "zustand";

interface ChallengeState {
	refresh: number;
	setRefresh: (refresh: number) => void;
}

export const useChallengeStore = create<ChallengeState>()((set) => ({
	refresh: 0,
	setRefresh: (refresh) => set({ refresh }),
}));
