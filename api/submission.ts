import { useAuthFetch } from "@/composables/useAuthFetch";
import type {
	SubmissionCreateRequest,
	SubmissionCreateResponse,
} from "@/types/submission";

export async function createSubmission(
	req: SubmissionCreateRequest
): Promise<SubmissionCreateResponse> {
	const { data: res } = await useAuthFetch(`/submissions/`, {
		method: "POST",
		data: JSON.stringify(req),
	});
	return res.value as SubmissionCreateResponse;
}
