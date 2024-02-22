import { defineStore } from "pinia";
import { useAuthFetch } from "@/composables/useAuthFetch";

export interface AttachmentState {
	fileName: string;
	fileSize: number;
}

export const useAttachmentStore = defineStore("attachment", {
	state: (): AttachmentState => ({
		fileName: "",
		fileSize: 0,
	}),
	actions: {
		async getAttachmentInfo(challengeId: number) {
			this.$reset();
			interface Response {
				code: number;
				file_name: string;
				file_size: number;
			}
			const { data: res } = await useAuthFetch(
				`/media/challenges/attachments/${challengeId}/info`,
				{
					method: "GET",
				}
			);
			const resObj = res.value as Response;
			if (resObj.code === 200) {
				this.fileName = resObj.file_name;
				this.fileSize = resObj.file_size;
			}
		},
	},
});
