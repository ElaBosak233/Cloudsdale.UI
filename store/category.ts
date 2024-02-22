import { defineStore } from "pinia";
import { getCategory } from "@/api/category";
import type { Category } from "@/types/category";

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
