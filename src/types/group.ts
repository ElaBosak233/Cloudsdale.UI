import { User } from "@/types/user";

export interface Group {
	id: number;
	name: string;
	display_name: string;
	description: string;
	users: Array<User>;
}
