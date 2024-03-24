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

export interface UserFindRequest {
	name?: string;
	username?: string;
	nickname?: string;
	email?: string;
	group_id?: number;
	page?: number;
	size?: number;
	sort_key?: string;
	sort_order?: string;
}

export interface UserUpdateRequest {
	id: number;
	username?: string;
	nickname?: string;
	email?: string;
	group_id?: number;
	password?: string;
}

export interface UserCreateRequest {
	username?: string;
	nickname?: string;
	email?: string;
	group_id?: number;
	password?: string;
}

export interface UserDeleteRequest {
	id: number;
}

export interface UserLoginRequest {
	username: string;
	password: string;
}
