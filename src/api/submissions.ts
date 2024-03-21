import { SubmissionCreateRequest } from "@/types/submission";
import { auth, useAuth } from "@/utils/axios";

export function createSubmission(request: SubmissionCreateRequest) {
	return auth.post("/submissions/", { ...request });
}

export function useSubmissionApi() {
	const auth = useAuth();

	const createSubmission = (request: SubmissionCreateRequest) => {
		return auth.post("/submissions/", { ...request });
	};

	return {
		createSubmission,
	};
}
