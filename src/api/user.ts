import {
	UserCreateRequest,
	UserDeleteRequest,
	UserFindRequest,
	UserUpdateRequest,
} from "@/types/user";
import { api, useAuth } from "@/utils/axios";

export function login(username: string, password: string) {
	return api.post("/users/login", {
		username,
		password,
	});
}

export function useUserApi() {
	const auth = useAuth();

	const getUsers = (request: UserFindRequest) => {
		return auth.get("/users/", { params: request });
	};

	const getUserByID = (id: number) => {
		return auth.get(`/users/${id}`);
	};

	const updateUser = (request: UserUpdateRequest) => {
		return auth.put(`/users/${request?.id}`, request);
	};

	const createUser = (request: UserCreateRequest) => {
		return auth.post(`/users/`, request);
	};

	const deleteUser = (request: UserDeleteRequest) => {
		return auth.delete(`/users/${request?.id}`);
	};

	return {
		getUsers,
		getUserByID,
		updateUser,
		createUser,
		deleteUser,
	};
}
