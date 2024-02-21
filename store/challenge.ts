import { useAuthFetch } from "@/composables/useAuthFetch";
import { useSnackBarStore } from "~/store/snackBar";
import { usePodStore } from "~/store/pod";
import { defaultChallenge } from "~/utils";

interface ChallengeEditor {
	dialog: boolean;
	type: "create" | "edit";
	challenge: Challenge;
}

interface ChallengeTable {
	loading: boolean;
	search: string;
	challenges: Array<Challenge>;
	pageCount: number;
	total: number;
	itemsPerPage: number;
	page: number;
	lastParams: any;
}

export interface ChallengeState {
	challenges: Array<Challenge>;
	pages: number;
	current_page: number;
	last_filters: string;

	challengeTable: ChallengeTable;
	challengeEditor: ChallengeEditor;
}

export const useChallengeStore = defineStore("challenge", {
	state: (): ChallengeState => ({
		challenges: [],
		pages: 1,
		current_page: 1,
		last_filters: "",
		challengeTable: {
			loading: false,
			search: "",
			challenges: [],
			pageCount: 1,
			total: 0,
			itemsPerPage: 10,
			page: 1,
			lastParams: {},
		},
		challengeEditor: {
			dialog: false,
			type: "create",
			challenge: defaultChallenge,
		},
	}),
	actions: {
		$resetChallengeEditor() {
			this.challengeEditor.challenge = useCloneDeep(defaultChallenge);
		},
		async loadChallenges(page?: number, filters?: string) {
			interface Response {
				code: number;
				data: Array<Challenge>;
				pages: number;
			}
			const url = filters
				? `/challenges/?page=${page}&size=15&submission_qty=3&${filters}`
				: `/challenges/?page=${page}&size=15&submission_qty=3`;
			this.last_filters = filters || "";
			const { data: res } = await useAuthFetch(url, {
				method: "GET",
			});
			const resObj = res.value as Response;
			if (resObj?.code === 200) {
				this.challenges = resObj.data ? resObj.data : [];
				this.pages = resObj.pages;
				this.current_page = page || 1;
			}
			const instanceStore = usePodStore();
			instanceStore.loadExistPods();
		},
		async saveChallenge() {
			const snackBarStore = useSnackBarStore();
			interface Response {
				code: number;
				msg: string;
			}
			const { data: res } = await useAuthFetch(`/challenges/`, {
				method: this.challengeEditor.type === "create" ? "POST" : "PUT",
				body: this.challengeEditor.challenge,
			});
			const resObj = res.value as Response;
			if (resObj.code === 200) {
				const text =
					this.challengeEditor.type === "create"
						? "题目创建成功"
						: "题目更新成功";
				snackBarStore.showSnackbar(text, "success");
				this.challengeEditor.dialog = false;
			} else {
				const text =
					this.challengeEditor.type === "create"
						? "题目创建失败"
						: "题目更新失败";
				snackBarStore.showSnackbar(`${text}\n` + resObj?.msg, "error");
				const obj = useCloneDeep(this.challengeEditor.challenge);
				this.$resetChallengeEditor();
				this.challengeEditor.challenge = obj;
			}
			await this.loadChallengeTable({
				page: this.challengeTable.page,
				itemsPerPage: this.challengeTable.itemsPerPage,
				sortBy: [],
			});
		},
		async loadChallengeTable({ page, itemsPerPage, sortBy }: any) {
			this.challengeTable.lastParams = { page, itemsPerPage, sortBy };
			this.challengeTable.loading = true;
			interface Response {
				code: number;
				data: Array<any>;
				pages: number;
				total: number;
			}
			let url = "";
			if (sortBy.length > 0) {
				url = `/challenges/?is_detailed=1&sort_by=${sortBy[0]?.key}&sort_by=${sortBy[0]?.order}&page=${page}&size=${itemsPerPage}`;
			} else {
				url = `/challenges/?is_detailed=1&page=${page}&size=${itemsPerPage}`;
			}
			if (this.challengeTable.search) {
				url += `&title=${this.challengeTable.search}`;
			}
			const { data: res } = await useAuthFetch(url, {
				method: "GET",
			});
			const resObj = res.value as Response;
			if (resObj?.code === 200) {
				this.challengeTable.challenges = resObj.data ? resObj.data : [];
				this.challengeTable.pageCount = resObj.pages;
				this.challengeTable.total = resObj.total;
			}
			this.challengeTable.loading = false;
		},
	},
});
