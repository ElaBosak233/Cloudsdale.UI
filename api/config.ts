import { useApiFetch } from "@/composables/useApiFetch";
import type { Response } from "@/types/utils";

export async function getPltCfg(): Promise<Response> {
	const { data: res, error: err } = await useApiFetch("/configs/");
	return (res.value as Response) || (err.value?.data as Response);
}
