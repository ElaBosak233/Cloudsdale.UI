import { useAuthFetch } from "@/composables/useAuthFetch";
import type {
	PodCreateRequest,
	PodRemoveRequest,
	PodRenewRequest,
	PodResponse,
} from "@/types/pod";

export async function getPod(query: string): Promise<PodResponse> {
	const { data: res } = await useAuthFetch(`/pods/?${query}`, {
		method: "GET",
	});
	return res.value as PodResponse;
}

export async function createPod(req: PodCreateRequest) {
	const { loading: pending, data } = await useAuthFetch("/pods/", {
		method: "POST",
		data: JSON.stringify(req),
	});
	return { pending, data };
}

export async function removePod(req: PodRemoveRequest) {
	const { loading: pending, data } = await useAuthFetch("/pods/", {
		method: "DELETE",
		data: JSON.stringify(req),
	});
	return { pending, data };
}

export async function renewPod(req: PodRenewRequest) {
	const { loading: pending, data } = await useAuthFetch("/pods/renew", {
		method: "PUT",
		data: JSON.stringify(req),
	});
	return { pending, data };
}
