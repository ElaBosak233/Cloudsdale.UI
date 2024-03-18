import { User } from "@/types/user";

export interface Team {
	id: number;
	name: string;
	description: string;
	captain_id: number;
	captain: User;
	is_locked: boolean;
	created_at: string;
	updated_at: string;
	users: Array<User>;
}
