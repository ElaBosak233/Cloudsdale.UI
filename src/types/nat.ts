import { Instance } from "@/types/instance";

export interface Nat {
	id: number;
	instance_id: number;
	instance: Instance;
	src_port: number;
	dst_port: number;
	proxy: string;
	entry: string;
}
