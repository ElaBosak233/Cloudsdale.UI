interface SubmissionTable {
	loading: boolean;
	search: string;
	submissions: Array<Submission>;
	pageCount: number;
	total: number;
	itemsPerPage: number;
	page: number;
}

export interface SubmissionState {
	submissionTable: SubmissionTable;
}

export const useSubmissionStore = defineStore("submission", {
	state: (): SubmissionState => ({
		submissionTable: {
			loading: false,
			search: "",
			submissions: [],
			pageCount: 1,
			total: 0,
			itemsPerPage: 10,
			page: 1,
		},
	}),
	actions: {},
});
