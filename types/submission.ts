import type { Challenge } from "./challenge";
import type { Team } from "./team";
import type { User } from "./user";

export interface Submission {
	id: number;
	flag: string;
	status: number;
	user_id: number;
	challenge_id: number;
	team_id: number;
	game_id: number;
	pts: number;
	created_at: number;
	updated_at: number;
	user: User;
	challenge: Challenge;
	team: Team;
}

export interface SubmissionCreateRequest {
	flag: string;
	challenge_id: number;
	team_id: number | null;
	game_id: number | null;
}

export interface SubmissionCreateResponse {
	code: number;
	msg: string;
	status: number;
}
