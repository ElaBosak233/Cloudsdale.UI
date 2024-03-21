export interface Game {
	id?: number;
	title?: string;
	bio?: string;
	description?: string;
	public_key?: string;
	is_enabled?: boolean;
	is_public?: boolean;
	password?: string;
	member_limit_min?: number;
	member_limit_max?: number;
	parallel_container_limit?: number;
	first_blood_reward_ratio?: number;
	second_blood_reward_ratio?: number;
	third_blood_reward_ratio?: number;
	is_need_write_up?: boolean;
	started_at?: number;
	ended_at?: number;
	created_at?: number;
	updated_at?: number;
}

export interface GameFindRequest {
	id?: number;
	title?: string;
	is_enabled?: boolean;
	page?: number;
	size?: number;
	sort_key?: string;
	sort_order?: string;
}

export interface GameChallengeFindRequest {
	game_id?: number;
	is_enabled?: boolean;
	team_id?: number;
}

export interface GameCreateRequest {
	title?: string;
	bio?: string;
	description?: string;
	is_enabled?: boolean;
	is_public?: boolean;
	password?: string;
	member_limit_min?: number;
	member_limit_max?: number;
	parallel_container_limit?: number;
	first_blood_reward_ratio?: number;
	second_blood_reward_ratio?: number;
	third_blood_reward_ratio?: number;
	is_need_write_up?: boolean;
	started_at?: number;
	ended_at?: number;
}

export interface GameUpdateRequest {
	id?: number;
	title?: string;
	bio?: string;
	description?: string;
	is_enabled?: boolean;
	is_public?: boolean;
	password?: string;
	member_limit_min?: number;
	member_limit_max?: number;
	parallel_container_limit?: number;
	first_blood_reward_ratio?: number;
	second_blood_reward_ratio?: number;
	third_blood_reward_ratio?: number;
	is_need_write_up?: boolean;
	started_at?: number;
	ended_at?: number;
}