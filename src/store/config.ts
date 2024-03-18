import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface PltCfg {
	site: {
		title: string;
		description: string;
	};
}

interface ConfigState {
	pltCfg: PltCfg;
	setPltCfg: (pltCfg: PltCfg) => void;
}

export const useConfigStore = create<ConfigState>()(
	persist(
		(set, _get) => ({
			pltCfg: {
				site: {
					title: "Cloudsdale",
					description: "Hack for fun not for profit",
				},
			},
			setPltCfg: (pltCfg) => set({ pltCfg }),
		}),
		{
			name: "config_storage",
			storage: createJSONStorage(() => localStorage),
		}
	)
);
