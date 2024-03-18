import axios from "axios";
import { useAuthStore } from "@/store/auth";

export const api = axios.create({
	baseURL: import.meta.env.VITE_BASE_API as string,
});

export const auth = axios.create({
	baseURL: import.meta.env.VITE_BASE_API as string,
	headers: {
		Authorization: `${useAuthStore.getState().pgsToken as string}`,
	},
});
