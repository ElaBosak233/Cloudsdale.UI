import {
	CategoryCreateRequest,
	CategoryDeleteRequest,
	CategoryUpdateRequest,
} from "@/types/category";
import { auth, useAuth } from "@/utils/axios";

export function getCategories() {
	return auth.get("/categories/");
}

export function createCategory(request: CategoryCreateRequest) {
	return auth.post("/categories/", request);
}

export function updateCategory(request: CategoryUpdateRequest) {
	return auth.put(`/categories/${request.id}`, request);
}

export function deleteCategory(request: CategoryDeleteRequest) {
	return auth.delete(`/categories/${request.id}`);
}

export function useCategoryApi() {
	const auth = useAuth();

	const getCategories = () => {
		return auth.get("/categories/");
	};

	const createCategory = (request: CategoryCreateRequest) => {
		return auth.post("/categories/", request);
	};

	const updateCategory = (request: CategoryUpdateRequest) => {
		return auth.put(`/categories/${request.id}`, request);
	};

	const deleteCategory = (request: CategoryDeleteRequest) => {
		return auth.delete(`/categories/${request.id}`);
	};

	return {
		getCategories,
		createCategory,
		updateCategory,
		deleteCategory,
	};
}
