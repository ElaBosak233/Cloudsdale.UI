import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface TeamState {
	selectedTeamID?: number;
	setSelectedTeamID: (selectedTeamID?: number) => void;
	refresh: number;
	setRefresh: (refresh: number) => void;
}

export const useTeamStore = create<TeamState>()(
	persist(
		(set) => ({
			selectedTeamID: 0,
			setSelectedTeamID: (selectedTeamID) => set({ selectedTeamID }),
			refresh: 0,
			setRefresh: (refresh) => set({ refresh }),
		}),
		{
			name: "team_storage",
			storage: createJSONStorage(() => sessionStorage),
		}
	)
);
