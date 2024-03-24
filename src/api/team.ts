import {
	TeamCreateRequest,
	TeamDeleteRequest,
	TeamFindRequest,
	TeamUpdateRequest,
} from "@/types/team";
import { useAuth } from "@/utils/axios";

export function useTeamApi() {
	const auth = useAuth();

	const getTeams = (request?: TeamFindRequest) => {
		return auth.get("/teams/", { params: request });
	};

	const createTeam = (request?: TeamCreateRequest) => {
		return auth.post("/teams/", request);
	};

	const updateTeam = (request: TeamUpdateRequest) => {
		return auth.put(`/teams/${request?.id}`, request);
	};

	const deleteTeam = (request: TeamDeleteRequest) => {
		return auth.delete(`/teams/${request?.id}`);
	};

	return {
		getTeams,
		createTeam,
		deleteTeam,
		updateTeam,
	};
}
