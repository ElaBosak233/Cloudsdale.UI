import { useAuthFetch } from "@/composables/useAuthFetch";
import type { ChallengeResponse } from "@/types/challenge";

export async function getChallenge(query: string): Promise<ChallengeResponse> {
	const { data: res } = await useAuthFetch(`/challenges/?${query}`, {
		method: "GET",
	});
	return res.value as ChallengeResponse;
}

export async function postChallenge(challenge: any) {
	const { data: res } = await useAuthFetch(`/challenges/`, {
		method: "POST",
		body: challenge,
	});
	return res.value;
}

export async function putChallenge(challenge: any) {
	const { data: res } = await useAuthFetch(`/challenges/${challenge?.id}`, {
		method: "PUT",
		body: challenge,
	});
	return res.value;
}

export async function deleteChallenge(id: number) {
	const { data: res } = await useAuthFetch(`/challenges/${id}`, {
		method: "DELETE",
	});
	return res.value;
}
