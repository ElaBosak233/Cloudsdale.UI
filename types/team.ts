import type { User } from "@/types/user";

export interface Team {
	id: number;
	name: string;
	description: string;
	captain_id: number;
	is_locked: boolean;
	users: Array<User>;
}
