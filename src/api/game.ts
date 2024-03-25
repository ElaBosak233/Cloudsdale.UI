import {
	GameChallengeCreateRequest,
	GameChallengeFindRequest,
	GameChallengeUpdateRequest,
	GameDeleteRequest,
	GameFindRequest,
	GameTeamCreateRequest,
	GameTeamDeleteRequest,
	GameTeamFindRequest,
	GameTeamUpdateRequest,
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

	const deleteGame = (request: GameDeleteRequest) => {
		return auth.delete(`/games/${request?.id}`);
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

	const getGameTeams = (request: GameTeamFindRequest) => {
		return auth.get(`/games/${request?.game_id}/teams`, {
			params: request,
		});
	};

	const getGameTeamByID = (request: GameTeamFindRequest) => {
		return auth.get(`/games/${request?.game_id}/teams/${request?.team_id}`);
	};

	const createGameTeam = (request: GameTeamCreateRequest) => {
		return auth.post(`/games/${request?.game_id}/teams`, request);
	};

	const updateGameTeam = (request: GameTeamUpdateRequest) => {
		return auth.put(
			`/games/${request?.game_id}/teams/${request?.team_id}`,
			request
		);
	};

	const deleteGameTeam = (request: GameTeamDeleteRequest) => {
		return auth.delete(
			`/games/${request?.game_id}/teams/${request?.team_id}`
		);
	};

	return {
		getGames,
		getGameByID,
		getGameChallenges,
		updateGame,
		deleteGame,
		updateGameChallenge,
		createGameChallenge,
		deleteGameChallenge,
		getGameTeams,
		getGameTeamByID,
		createGameTeam,
		updateGameTeam,
		deleteGameTeam,
	};
}
