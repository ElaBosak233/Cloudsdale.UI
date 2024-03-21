import {
	PodCreateRequest,
	PodFindRequest,
	PodRemoveRequest,
} from "@/types/pod";
import { auth, useAuth } from "@/utils/axios";

export function getPods(request: PodFindRequest) {
	return auth.get("/pods/", { params: { ...request } });
}

export function createPod(request: PodCreateRequest) {
	return auth.post("/pods/", { ...request });
}

export function removePod(request: PodRemoveRequest) {
	return auth.delete(`/pods/${request.id}`, { data: { ...request } });
}

export function renewPod(request: PodRemoveRequest) {
	return auth.put(`/pods/${request.id}`, { ...request });
}

export function usePodApi() {
	const auth = useAuth();

	const getPods = (request: PodFindRequest) => {
		return auth.get("/pods/", { params: { ...request } });
	};

	const createPod = (request: PodCreateRequest) => {
		return auth.post("/pods/", { ...request });
	};

	const removePod = (request: PodRemoveRequest) => {
		return auth.delete(`/pods/${request.id}`, { data: { ...request } });
	};

	const renewPod = (request: PodRemoveRequest) => {
		return auth.put(`/pods/${request.id}`, { ...request });
	};

	return {
		getPods,
		createPod,
		removePod,
		renewPod,
	};
}
