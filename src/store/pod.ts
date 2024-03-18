import { Pod } from "@/types/pod";
import { create } from "zustand";

interface ExistPod {
	challenge_id?: number;
	pod: Pod;
}

interface PodState {
	existPods?: Array<ExistPod>;
	setExistPods: (existPods: Array<ExistPod>) => void;
}

export const usePodStore = create<PodState>()((set, _get) => ({
	setExistPods: (existPods) => set({ existPods }),
}));
