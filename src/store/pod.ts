import { Pod } from "@/types/pod";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface PodState {
	existPods?: Record<number, Pod>;
	addExistPod: (challenge_id: number, pod: Pod) => void;
	setExistPods: (existPods: Record<number, Pod>) => void;
	removeExistPod: (challenge_id: number) => void;
}

export const usePodStore = create<PodState>()(
	persist(
		(set) => ({
			setExistPods: (existPods) => set({ existPods }),
			addExistPod: (challenge_id, pod) =>
				set((state) => ({
					existPods: {
						...state.existPods,
						[challenge_id]: pod,
					},
				})),
			removeExistPod: (challenge_id) => {
				set((state) => {
					const existPods = { ...state.existPods };
					delete existPods[challenge_id];
					return { existPods };
				});
			},
		}),
		{
			name: "pod_storage",
			storage: createJSONStorage(() => localStorage),
		}
	)
);
