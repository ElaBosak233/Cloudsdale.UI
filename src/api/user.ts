import { api } from "@/utils/axios";

export function login(username: string, password: string) {
	return api.post("/users/login", {
		username,
		password,
	});
}
