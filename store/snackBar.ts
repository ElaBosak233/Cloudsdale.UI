export interface SnackBarStoreState {
	enabled: boolean;
	text: string;
	type: "error" | "success" | "warning" | "info" | undefined;
}

export const useSnackBarStore = defineStore("snackbar", {
	state: (): SnackBarStoreState => ({
		enabled: false,
		text: "",
		type: undefined,
	}),
	actions: {
		showSnackbar(
			text: string,
			type: "error" | "success" | "warning" | "info" | undefined
		) {
			this.enabled = true;
			this.text = text;
			this.type = type;
		},
		info(text: string) {
			this.enabled = true;
			this.text = text;
			this.type = "info";
		},
		success(text: string) {
			this.enabled = true;
			this.text = text;
			this.type = "success";
		},
		error(text: string) {
			this.enabled = true;
			this.text = text;
			this.type = "error";
		},
		warning(text: string) {
			this.enabled = true;
			this.text = text;
			this.type = "warning";
		},
	},
});
