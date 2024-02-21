export interface Pod {
	id: number;
	challenge_id: number;
	instances: Array<any>;
	status: string;
	removed_at: number;
}

export interface PodResponse {
	code: number;
	data: Array<Pod>;
}

export interface PodCreateResponse {
	id: number;
	code: number;
	msg: string;
	instances: Array<any>;
	removed_at: number;
}

export interface PodCreateRequest {
	challenge_id: number;
}

export interface PodRemoveRequest {
	id: number;
}

export interface PodRenewRequest {
	id: number;
}

export interface PodRenewResponse {
	code: number;
	msg: string;
	removed_at: number;
}
