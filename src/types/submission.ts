import { Game } from "@/types/game";
import { Team } from "@/types/team";
import { Challenge } from "@/types/challenge";
import { User } from "@/types/user";

export interface Submission {
	id: number;
	flag: string;
	status: number;
	user_id: number;
	user: User;
	challenge_id: number;
	challenge: Challenge;
	team_id: number;
	team: Team;
	game_id: number;
	game: Game;
	pts: number;
	created_at: string;
	updated_at: string;
}

export interface SubmissionCreateRequest {
	flag?: string;
	challenge_id?: number;
	team_id?: number;
	game_id?: number;
}