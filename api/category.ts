import { useAuthFetch } from "@/composables/useAuthFetch";
import type { CategoryResponse } from "@/types/category";

export async function getCategory(
	query: string = ""
): Promise<CategoryResponse> {
	const { data: res } = await useAuthFetch(`/categories/?${query}`, {
		method: "GET",
	});
	return res.value as CategoryResponse;
}

export async function postCategory(category: Object) {
	const { data: res } = await useAuthFetch(`/categories/`, {
		method: "POST",
		data: category,
	});
	return res.value;
}


export async function putCategory(category: Object) {
	const { data: res } = await useAuthFetch(`/categories/`, {
		method: "PUT",
		data: category,
	});
	return res.value;
}
