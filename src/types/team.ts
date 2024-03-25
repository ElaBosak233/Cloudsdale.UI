import { User } from "@/types/user";

export interface Team {
	id?: number;
	name?: string;
	description?: string;
	captain_id?: number;
	captain?: User;
	is_locked?: boolean;
	created_at?: string;
	updated_at?: string;
	users?: Array<User>;
	is_allowed?: boolean;
	signature?: string;
	pts?: number;
	rank?: number;
	solved?: number;
}

export interface TeamFindRequest {
	id?: number;
	name?: string;
	captain_id?: number;
	page?: number;
	size?: number;
}

export interface TeamUpdateRequest {
	id: number;
	name?: string;
	description?: string;
	captain_id?: number;
	is_locked?: boolean;
}

export interface TeamCreateRequest {
	name: string;
	description: string;
	captain_id: number;
}

export interface TeamDeleteRequest {
	id: number;
}
