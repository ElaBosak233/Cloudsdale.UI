import axios from "axios";
import { useAuthStore } from "@/store/auth";
import { useMemo } from "react";
import { useNavigate } from "react-router";

export const api = axios.create({
	baseURL: import.meta.env.VITE_BASE_API as string,
});

export const useAuth = () => {
	const { pgsToken } = useAuthStore();
	const navigate = useNavigate();

	return useMemo(() => {
		const auth = axios.create({
			baseURL: import.meta.env.VITE_BASE_API as string,
			headers: pgsToken
				? {
						Authorization: `${pgsToken}`,
					}
				: {},
		});

		auth.interceptors.response.use(
			(response) => {
				return response;
			},
			(error) => {
				if (error.response?.status === 401) {
					navigate("/login");
				}
				return Promise.reject(error);
			}
		);

		return auth;
	}, [pgsToken, navigate]);
};
