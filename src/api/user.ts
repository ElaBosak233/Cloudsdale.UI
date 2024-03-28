import {
	UserCreateRequest,
	UserDeleteRequest,
	UserFindRequest,
	UserUpdateRequest,
} from "@/types/user";
import { useApi, useAuth } from "@/utils/axios";

export function useUserApi() {
	const api = useApi();
	const auth = useAuth();

	const login = (username: string, password: string) => {
		return api.post("/users/login", {
			username,
			password,
		});
	};

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
		login,
		getUsers,
		getUserByID,
		updateUser,
		createUser,
		deleteUser,
	};
}
