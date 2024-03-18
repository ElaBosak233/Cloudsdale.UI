export interface Game {
	id: number;
	title: string;
	bio: string;
	description: string;
	public_key: string;
	is_enabled: boolean;
	is_public: boolean;
	password: string;
	member_limit_min: number;
	member_limit_max: number;
	parallel_container_limit: number;
	first_blood_reward_ratio: number;
	second_blood_reward_ratio: number;
	third_blood_reward_ratio: number;
	is_need_write_up: boolean;
	started_at: string;
	ended_at: string;
	created_at: string;
	updated_at: string;
}
