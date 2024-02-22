import { defineStore } from "pinia";
import { deleteUserAvatar, getTeamAvatar, getUserAvatar, setUserAvatar } from "@/api/media";

export interface MediaState {
	userAvatarBlobs: Record<number, string>;
	teamAvatarBlobs: Record<number, string>;
}

export const useMediaStore = defineStore("media", {
	state: (): MediaState => ({
		userAvatarBlobs: {},
		teamAvatarBlobs: {},
	}),
	actions: {
		async getUserAvatar(id: number) {
			if (!this.userAvatarBlobs[id]) {
				this.userAvatarBlobs[id] = await getUserAvatar(id);
			}
		},
		async getTeamAvatar(id: number) {
			if (!this.teamAvatarBlobs[id]) {
				this.teamAvatarBlobs[id] = await getTeamAvatar(id);
			}
		},
		async deleteUserAvatar(id: number) {
			const response = await deleteUserAvatar(id);
			if (response.code === 200) {
				this.userAvatarBlobs[id] = "";
				return true;
			}
			return false;
		},
		async setUserAvatar(id: number, file: File) {
			const formData = new FormData();
			formData.append("avatar", file);
			const response = await setUserAvatar(id, formData);
			if (response.code === 200) {
				await this.getUserAvatar(id);
				return true;
			}
			return false;
		},
	},
});
