import { useAuthFetch } from "@/composables/useAuthFetch";
import type { ChallengeAttachmentInfoResponse } from "@/types/media";
import { apiUrlJoin } from "@/utils/url";

export async function getUserAvatar(id: number): Promise<string> {
	const { data: res } = await useAuthFetch(`/media/users/avatar/${id}/info`, {
		method: "GET",
	});
	const resObj = res.value as any;
	if (resObj && resObj?.code !== 404) {
		return apiUrlJoin(`/media/users/avatar/${id}`);
	} else {
		return "";
	}
}

export async function deleteUserAvatar(id: number) {
	const { data: res } = await useAuthFetch(`/media/users/avatar/${id}`, {
		method: "DELETE",
	});
	return res.value;
}

export async function setUserAvatar(id: number, formData: FormData) {
	const { data: res } = await useAuthFetch(`/media/users/avatar/${id}`, {
		method: "POST",
		data: formData,
	});
	return res.value;
}

export async function getTeamAvatar(id: number): Promise<string> {
	const { data: res } = await useAuthFetch(`/media/teams/avatar/${id}/info`, {
		method: "GET",
	});
	const resObj = res.value as any;
	if (resObj && resObj?.code !== 404) {
		return apiUrlJoin(`/media/teams/avatar/${id}`);
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
