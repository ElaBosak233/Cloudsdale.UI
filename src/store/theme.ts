import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface ThemeState {
	mode: string;
	toggleMode: (mode: string) => void;
}

export const useThemeStore = create<ThemeState>()(
	persist(
		(set, _get) => ({
			mode: "light",
			toggleMode: (mode: string) =>
				set({
					mode: mode,
				}),
		}),
		{
			name: "theme_storage",
			storage: createJSONStorage(() => localStorage),
		}
	)
);
