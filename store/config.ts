import { getPltCfg } from "@/api/config";

interface PltCfg {
	site: {
		title: string;
		description: string;
	};
	user: {
		allow_registration: boolean;
	};
	container: {
		parallel_limit: number;
		request_limit: number;
	};
}

export interface ConfigState {
	apiUrl: string;
	pltCfg: PltCfg;
}

export const useConfigStore = defineStore("config", {
	state: (): ConfigState => ({
		apiUrl: useRuntimeConfig().public.apiUrl as string,
		pltCfg: {
			site: {
				title: "Cloudsdale",
				description: "Hack for fun not for profit",
			},
			container: {
				parallel_limit: 1,
				request_limit: 30,
			},
			user: {
				allow_registration: true,
			},
		},
	}),
	actions: {
		async loadGlobalConfig() {
			const response = await getPltCfg();
			if (response?.code === 200) {
				this.pltCfg = response?.data;
			}
		},
	},
});
