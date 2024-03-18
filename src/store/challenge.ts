import { create } from "zustand";

interface ChallengeState {
	refresh: number;
	setRefresh: (refresh: number) => void;
}

export const useChallengeStore = create<ChallengeState>()((set, _get) => ({
	refresh: 0,
	setRefresh: (refresh) => set({ refresh }),
}));
