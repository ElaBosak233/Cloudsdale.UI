import { useAuthFetch } from "@/composables/useAuthFetch";
import type { CategoryResponse } from "@/types/category";

export async function getCategory(): Promise<CategoryResponse> {
	const { data: res } = await useAuthFetch(`/categories/`, {
		method: "GET",
	});
	return res.value as CategoryResponse;
}
