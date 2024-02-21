import { defineStore } from "pinia";
import { getUserAvatar } from "@/api/media";

export interface MediaState {
	userAvatarBlobs: Record<number, string>;
}

export const useMediaStore = defineStore("media", {
	state: (): MediaState => ({
		userAvatarBlobs: {},
	}),
	actions: {
		async getUserAvatar(id: number) {
			if (!this.userAvatarBlobs[id]) {
				this.userAvatarBlobs[id] = await getUserAvatar(id);
			}
		},
	},
});
