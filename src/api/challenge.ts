import {
	ChallengeFindRequest,
	ChallengeUpdateRequest,
} from "@/types/challenge";
import {
	FlagCreateRequest,
	FlagDeleteRequest,
	FlagUpdateRequest,
} from "@/types/flag";
import {
	ImageCreateRequest,
	ImageDeleteRequest,
	ImageUpdateRequest,
} from "@/types/image";
import { useAuth } from "@/utils/axios";

export function useChallengeApi() {
	const auth = useAuth();

	const getChallenges = (request: ChallengeFindRequest) => {
		return auth.get("/challenges/", { params: request });
	};

	const updateChallenge = (request: ChallengeUpdateRequest) => {
		return auth.put(`/challenges/${request.id}`, request);
	};

	const updateChallengeFlag = (request: FlagUpdateRequest) => {
		return auth.put(
			`/challenges/${request.challenge_id}/flags/${request.id}`,
			request
		);
	};

	const createChallengeFlag = (request: FlagCreateRequest) => {
		return auth.post(`/challenges/${request.challenge_id}/flags`, request);
	};

	const deleteChallengeFlag = (request: FlagDeleteRequest) => {
		return auth.delete(
			`/challenges/${request.challenge_id}/flags/${request.id}`
		);
	};

	const createChallengeImage = (request: ImageCreateRequest) => {
		return auth.post(`/challenges/${request.challenge_id}/images`, request);
	};

	const deleteChallengeImage = (request: ImageDeleteRequest) => {
		return auth.delete(
			`/challenges/${request.challenge_id}/images/${request.id}`
		);
	};

	const updateChallengeImage = (request: ImageUpdateRequest) => {
		return auth.put(
			`/challenges/${request.challenge_id}/images/${request.id}`,
			request
		);
	};

	return {
		getChallenges,
		updateChallenge,
		updateChallengeFlag,
		createChallengeFlag,
		deleteChallengeFlag,
		createChallengeImage,
		deleteChallengeImage,
		updateChallengeImage,
	};
}
