import { auth } from "@/utils/axios";

export function getCategories() {
	return auth.get("/categories/");
}
