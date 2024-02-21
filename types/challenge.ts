import type { Category } from "./category";
import type { Submission } from "./submission";

export interface Challenge {
	id: number;
	title: string;
	description: string;
	is_dynamic: boolean;
	is_practicable: boolean;
	has_attachment: boolean;
	practice_pts: number;
	difficulty: number;
	category: Category;
	flag: string;
	flag_env: string;
	flag_fmt: string;
	image: string;
	exposed_port: number;
	cpu_limit: number;
	memory_limit: number;
	duration: number;
	created_at: number;
	updated_at: number;
	submissions: Array<Submission>;
	is_solved: boolean;
	pts: number;
}

export interface ChallengeResponse {
	code: number;
	msg: string;
	pages: number;
	data: Array<Challenge>;
}
