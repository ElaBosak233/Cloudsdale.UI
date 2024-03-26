import { Pod } from "@/types/pod";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface PodState {
	existPods?: Record<number, Pod>;
	addExistPod: (challenge_id: number, pod: Pod) => void;
	setExistPods: (existPods: Record<number, Pod>) => void;
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
		}),
		{
			name: "pod_storage",
			storage: createJSONStorage(() => localStorage),
		}
	)
);
