export interface Flag {
	id: number;
	type: string;
	banned: boolean;
	value: string;
	env: string;
	challenge_id: number;
}
