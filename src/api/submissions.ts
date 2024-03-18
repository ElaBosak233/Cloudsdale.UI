import { SubmissionCreateRequest } from "@/types/submission";
import { auth } from "@/utils/axios";

export function createSubmission(request: SubmissionCreateRequest) {
	return auth.post("/submissions/", { ...request });
}
