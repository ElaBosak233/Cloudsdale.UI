import { useAuthFetch } from "@/composables/useAuthFetch";
import { getCategory } from "@/api/category";

export interface CategoryState {
	categories: Array<Category>;
}

export const useCategoryStore = defineStore("category", {
	state: (): CategoryState => ({
		categories: [],
	}),
	actions: {
		async loadCategories() {
			const response = await getCategory();
			if (response.code === 200) {
				this.categories = response.data;
			}
		},
	},
});
