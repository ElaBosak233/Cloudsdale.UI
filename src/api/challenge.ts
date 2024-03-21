import {
	ChallengeFindRequest,
	ChallengeUpdateRequest,
} from "@/types/challenge";
import { auth, useAuth } from "@/utils/axios";

export function getChallenges(request: ChallengeFindRequest) {
	return auth.get("/challenges/", { params: request });
}

export function updateChallenge(request: ChallengeUpdateRequest) {
	return auth.put(`/challenges/${request.id}`, request);
}

export function useChallengeApi() {
	const auth = useAuth();

	const getChallenges = (request: ChallengeFindRequest) => {
		return auth.get("/challenges/", { params: request });
	};

	const updateChallenge = (request: ChallengeUpdateRequest) => {
		return auth.put(`/challenges/${request.id}`, request);
	};

	return {
		getChallenges,
		updateChallenge,
	};
}
