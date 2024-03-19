import { Category } from "@/types/category";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface CategoryState {
	categories: Array<Category>;
	setCategories: (categories: Array<Category>) => void;
}

export const useCategoryStore = create<CategoryState>()(
	persist(
		(set, _get) => ({
			categories: [],
			setCategories: (categories) => set({ categories }),
		}),
		{
			name: "category_storage",
			storage: createJSONStorage(() => localStorage),
		}
	)
);
