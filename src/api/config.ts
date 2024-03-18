import { api } from "@/utils/axios";

export function getPltCfg() {
	return api.get("/configs/");
}
