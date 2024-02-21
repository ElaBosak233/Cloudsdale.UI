import { useAuthFetch } from "@/composables/useAuthFetch";
import type { ChallengeAttachmentInfoResponse } from "@/types/media";

export async function getUserAvatar(id: number): Promise<string> {
	const { data: res } = await useAuthFetch(`/media/users/avatar/${id}`, {
		method: "GET",
	});
	const resObj = res.value as any;
	if (resObj && resObj?.code !== 404) {
		return URL.createObjectURL(resObj);
	} else {
		return "";
	}
}

export async function getChallengeAttachmentInfo(
	id: number
): Promise<ChallengeAttachmentInfoResponse> {
	const { data: res } = await useAuthFetch(
		`/media/challenges/attachments/${id}/info`,
		{
			method: "GET",
		}
	);
	return res.value as ChallengeAttachmentInfoResponse;
}

export async function getChallengeAttachment(id: number) {
	const { data: res } = await useAuthFetch(
		`/media/challenges/attachments/${id}`,
		{
			method: "GET",
		}
	);
	return res.value;
}
