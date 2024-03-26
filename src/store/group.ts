import { Group } from "@/types/group";
import { create } from "zustand";

interface GroupState {
	groups?: Array<Group>;
	setGroups: (groups: Array<Group>) => void;
	refresh: number;
	setRefresh: (refresh: number) => void;
}

export const useGroupStore = create<GroupState>()((set) => ({
	setGroups: (groups) => set({ groups }),
	refresh: 0,
	setRefresh: (refresh) => set({ refresh }),
}));
