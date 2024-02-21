import type { Group } from "./group";
import type { Team } from "./team";

export interface User {
	id: number;
	username: string;
	nickname: string;
	email: string;
	group_id: number;
	group: Group | undefined;
	password: string;
	teams: Array<Team>;
	created_at: number;
	updated_at: number;
}
