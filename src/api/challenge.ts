import { ChallengeFindRequest } from "@/types/challenge";
import { auth } from "@/utils/axios";

export function getChallenges(request: ChallengeFindRequest) {
	return auth.get("/challenges/", { params: request });
}
