import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface GameState {
	selectedGameID?: number;
	setSelectedGameID: (selectedGameID?: number) => void;
	refresh: number;
	setRefresh: (refresh: number) => void;
}

export const useGameStore = create<GameState>()(
	persist(
		(set, _get) => ({
			selectedGameID: 0,
			setSelectedGameID: (selectedGameID) => set({ selectedGameID }),
			refresh: 0,
			setRefresh: (refresh) => set({ refresh }),
		}),
		{
			name: "game_storage",
			storage: createJSONStorage(() => sessionStorage),
		}
	)
);
