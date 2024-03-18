import { Team } from "@/types/team";
import { Group } from "@/types/group";

export interface User {
	id: number;
	username: string;
	nickname: string;
	email: string;
	group_id: number;
	group: Group;
	teams: Array<Team>;
	created_at: string;
	updated_at: string;
}
