export interface Game {
	id: number;
	title: string;
	bio: string;
	description: string;
	is_public: boolean;
	member_limit_min: number;
	member_limit_max: number;
	parallel_container_limit: number;
	first_blood_reward_ratio: number;
	second_blood_reward_ratio: number;
	third_blood_reward_ratio: number;
	started_at: any;
	ended_at: any;
}
