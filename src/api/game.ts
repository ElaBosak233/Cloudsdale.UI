import { GameChallengeFindRequest, GameFindRequest } from "@/types/game";
import { useAuth } from "@/utils/axios";

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
