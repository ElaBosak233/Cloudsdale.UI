import { Category } from "@/types/category";
import { Flag } from "@/types/flag";
import { Hint } from "@/types/hint";
import { Submission } from "@/types/submission";

export interface Challenge {
	id?: number;
	title?: string;
	description?: string;
	category_id?: number;
	category?: Category;
	has_attachment?: boolean;
	attachment_url?: string;
	is_practicable?: boolean;
	is_dynamic?: boolean;
	difficulty?: number;
	practice_pts?: number;
	pts?: number;
	duration?: number;
	flags?: Array<Flag>;
	hints?: Array<Hint>;
	solved?: Submission;
	submissions?: Array<Submission>;
	is_enabled?: boolean;
	min_pts?: number;
	max_pts?: number;
}

export interface ChallengeFindRequest {
	id?: number;
	title?: string;
	description?: string;
	category_id?: number;
	has_attachment?: boolean;
	is_practicable?: boolean;
	is_dynamic?: boolean;
	is_detailed?: boolean;
	difficulty?: number;
	page?: number;
	size?: number;
	submission_qty?: number;
	sort_key?: string;
	sort_order?: string;
}

export interface ChallengeUpdateRequest {
	id?: number;
	title?: string;
	description?: string;
	category_id?: number;
	has_attachment?: boolean;
	attachment_url?: string;
	is_practicable?: boolean;
	is_dynamic?: boolean;
	difficulty?: number;
	practice_pts?: number;
	duration?: number;
}

export interface ChallengeCreateRequest {
	title?: string;
	description?: string;
	category_id?: number;
	has_attachment?: boolean;
	is_practicable?: boolean;
	is_dynamic?: boolean;
	difficulty?: number;
	practice_pts?: number;
	duration?: number;
}

export interface ChallengeDeleteRequest {
	id?: number;
}
