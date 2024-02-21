import { getPod } from "@/api/pod";

export interface PodState {
	existPods: Record<any, Record<string, any>>;
}

export const usePodStore = defineStore("instance", {
	state: (): PodState => ({
		existPods: {},
	}),
	actions: {
		async loadExistPods() {
			const response = await getPod("is_available=1");
			if (response?.code === 200) {
				if (response?.data) {
					response.data.forEach((pod) => {
						if (pod.status === "running") {
							this.existPods[pod.challenge_id] = pod;
						}
					});
				}
			}
		},
	},
});
