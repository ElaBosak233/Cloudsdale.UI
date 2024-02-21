import { login, verify } from "@/api/user";
import { useSnackBarStore } from "@/store/snackBar";
import type { User } from "@/types/user";

export interface AuthState {
	user: User | null;
	pgsToken: string | null;
}

export const useAuthStore = defineStore("auth", {
	state: (): AuthState => ({
		user: null,
		pgsToken: null,
	}),
	actions: {
		setPgsToken(token: string) {
			this.pgsToken = token;
		},
		async verifyToken() {
			const response = await verify(this.pgsToken as string);
			return response?.code === 200;
		},
		async login(username: string, password: string) {
			const snackBarStore = useSnackBarStore();
			if (!username || !password) {
				snackBarStore.showSnackbar("用户名和密码不能为空", "error");
				return;
			}
			const router = useRouter();
			const response = await login(username, password);
			if (response && response.code === 200) {
				this.setPgsToken(response?.token);
				await this.verifyToken();
				await router.push("/");
			} else {
				snackBarStore.error(
					response ? response.msg : "无法连接到服务器"
				);
			}
		},
		logout() {
			this.pgsToken = null;
			this.user = null;
		},
	},
	persist: {
		storage: localStorage,
	},
});
