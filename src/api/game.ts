import { GameChallengeFindRequest, GameFindRequest } from "@/types/game";
import { auth, useAuth } from "@/utils/axios";

export function getGames(request: GameFindRequest) {
	return auth.get("/games/", { params: request });
}

export function getGameByID(id: number) {
	return auth.get(`/games/${id}`);
}

export function getGameChallenges(request: GameChallengeFindRequest) {
	return auth.get(`/games/${request?.game_id}/challenges`, {
		params: request,
	});
}

export function useGameApi() {
	const auth = useAuth();

	const getGames = (request: GameFindRequest) => {
		return auth.get("/games/", { params: request });
	};

	const getGameByID = (id: number) => {
		return auth.get(`/games/${id}`);
	};

	const getGameChallenges = (request: GameChallengeFindRequest) => {
		return auth.get(`/games/${request?.game_id}/challenges`, {
			params: request,
		});
	};

	return {
		getGames,
		getGameByID,
		getGameChallenges,
	};
}
