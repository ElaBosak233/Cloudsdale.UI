import { useAuthStore } from "~/store/auth";
export default defineNuxtRouteMiddleware(async (to) => {
	const authStore = useAuthStore();
	const verified = await authStore.verifyToken();
	if (
		!["/login", "/"].includes(to.path) &&
		(!authStore.pgsToken || !verified)
	) {
		authStore.logout();
		return navigateTo("/login");
	} else if (to.path === "/login" && authStore.pgsToken && verified) {
		return navigateTo("/");
	}
	if (
		to.path.includes("/admin") &&
		(authStore.user.level > 2 || authStore.user.level === 0)
	) {
		return navigateTo("/");
	}
});
