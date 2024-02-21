import { useApiFetch } from "@/composables/useApiFetch";
import type { User } from "@/types/user";
import type { Response } from "@/types/utils";

interface LoginResponse {
	code: number;
	msg: string;
	token: string;
	data: User;
}

export async function login(
	username: string,
	password: string
): Promise<LoginResponse> {
	const { data: res, error: err } = await useApiFetch("/users/login", {
		method: "POST",
		data: JSON.stringify({ username, password }),
	});
	return (res.value as LoginResponse) || (err.value?.data as LoginResponse);
}

export async function verify(token: string): Promise<Response> {
	const { data: res, error: err } = await useApiFetch(
		`/users/token/${token}`,
		{
			method: "GET",
		}
	);
	return res.value || err.value?.data;
}
