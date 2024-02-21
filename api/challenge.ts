import { useAuthFetch } from "@/composables/useAuthFetch";
import type { ChallengeResponse } from "@/types/challenge";

export async function getChallenge(query: string): Promise<ChallengeResponse> {
	const { data: res } = await useAuthFetch(`/challenges/?${query}`, {
		method: "GET",
	});
	return res.value as ChallengeResponse;
}
