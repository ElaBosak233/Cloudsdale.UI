import {
	GameChallengeCreateRequest,
	GameChallengeFindRequest,
	GameChallengeUpdateRequest,
	GameFindRequest,
	GameUpdateRequest,
} from "@/types/game";
import { useAuth } from "@/utils/axios";

export function useGameApi() {
	const auth = useAuth();

	const getGames = (request: GameFindRequest) => {
		return auth.get("/games/", { params: request });
	};

	const getGameByID = (id: number) => {
		return auth.get(`/games/${id}`);
	};

	const updateGame = (request: GameUpdateRequest) => {
		return auth.put(`/games/${request?.id}`, request);
	};

	const getGameChallenges = (request: GameChallengeFindRequest) => {
		return auth.get(`/games/${request?.game_id}/challenges`, {
			params: request,
		});
	};

	const createGameChallenge = (request: GameChallengeCreateRequest) => {
		return auth.post(`/games/${request?.game_id}/challenges`, request);
	};

	const updateGameChallenge = (request: GameChallengeUpdateRequest) => {
		return auth.put(
			`/games/${request?.game_id}/challenges/${request?.challenge_id}`,
			request
		);
	};

	const deleteGameChallenge = (request: GameChallengeUpdateRequest) => {
		return auth.delete(
			`/games/${request?.game_id}/challenges/${request?.challenge_id}`
		);
	};

	return {
		getGames,
		getGameByID,
		getGameChallenges,
		updateGame,
		updateGameChallenge,
		createGameChallenge,
		deleteGameChallenge,
	};
}
