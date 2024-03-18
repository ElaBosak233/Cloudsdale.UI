import { Port } from "@/types/port";
import { Env } from "@/types/env";

export interface Image {
	id: number;
	challenge_id: number;
	name: string;
	cpu_limit: number;
	memory_limit: number;
	description: string;
	created_at: string;
	ports: Array<Port>;
	envs: Array<Env>;
}
