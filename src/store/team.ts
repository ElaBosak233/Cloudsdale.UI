import { create } from "zustand";

interface TeamState {
	refresh: number;
	setRefresh: (refresh: number) => void;
}

export const useTeamStore = create<TeamState>()((set, _get) => ({
	refresh: 0,
	setRefresh: (refresh) => set({ refresh }),
}));
