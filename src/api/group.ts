import { GroupFindRequest, GroupUpdateRequest } from "@/types/group";
import { useAuth } from "@/utils/axios";

export function useGroupApi() {
	const auth = useAuth();

	const getGroups = (request?: GroupFindRequest) => {
		return auth.get("/groups/", { params: request });
	};

	const updateGroup = (request: GroupUpdateRequest) => {
		return auth.put(`/groups/${request?.id}`, request);
	};

	return {
		getGroups,
		updateGroup,
	};
}
