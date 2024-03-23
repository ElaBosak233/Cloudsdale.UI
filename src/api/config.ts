import { ConfigUpdateRequest } from "@/types/config";
import { api, useAuth } from "@/utils/axios";

export function getPltCfg() {
	return api.get("/configs/");
}

export function useConfigApi() {
	const auth = useAuth();

	const getPltCfg = () => {
		return auth.get("/configs/");
	};

	const updatePltCfg = (request: ConfigUpdateRequest) => {
		return auth.put("/configs/", request);
	};

	return {
		getPltCfg,
		updatePltCfg,
	};
}
