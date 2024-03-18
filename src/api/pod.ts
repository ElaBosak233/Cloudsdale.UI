import { auth } from "@/utils/axios";

export function getPods() {
	return auth.get("/pods/");
}
