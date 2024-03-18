import { Image } from "@/types/image";
import { Pod } from "@/types/pod";
import { Nat } from "@/types/nat";

export interface Instance {
	id: number;
	image_id: number;
	image: Image;
	pod_id: number;
	pod: Pod;
	nats: Array<Nat>;
}
