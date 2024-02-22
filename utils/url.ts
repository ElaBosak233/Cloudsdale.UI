import { useConfigStore } from "@/store/config";

export function apiUrlJoin(s: string) {
	const configStore = useConfigStore();
	return `${configStore.apiUrl}${s}`;
}
