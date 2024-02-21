import { useConfigStore } from "~/store/config";
import { useAuthStore } from "~/store/auth";
import { useAuthFetch } from "@/composables/useAuthFetch";
import { useSnackBarStore } from "~/store/snackBar";

interface TeamEditor {
	dialog: boolean;
	type: "create" | "edit";
	team: Team;
}

interface TeamTable {
	loading: boolean;
	search: string;
	teams: Array<Team>;
	pageCount: number;
	total: number;
	itemsPerPage: number;
	page: number;
}

export interface TeamState {
	teams: Array<Team>;
	teams_by_user_id: Array<Team>;
	teamTable: TeamTable;
	teamEditor: TeamEditor;
	teamAvatar: Record<number, string>;
}

export const useTeamStore = defineStore("team", {
	state: (): TeamState => ({
		teams: [],
		teams_by_user_id: [],
		teamTable: {
			loading: false,
			search: "",
			teams: [],
			pageCount: 0,
			total: 0,
			itemsPerPage: 10,
			page: 1,
		},
		teamEditor: {
			dialog: false,
			type: "create",
			team: defaultTeam,
		},
		teamAvatar: {},
	}),
	actions: {
		$resetTeamEditor() {
			this.teamEditor.team = useCloneDeep(defaultTeam);
		},
		async loadTeamTable({ page, itemsPerPage, sortBy }: any) {
			this.teamTable.loading = true;
			interface Response {
				code: number;
				data: Array<any>;
				pages: number;
				total: number;
			}
			let url = "";
			if (sortBy.length > 0) {
				url = `/teams/?is_detailed=1&sort_by=${sortBy[0]?.key}&sort_by=${sortBy[0]?.order}&page=${page}&size=${itemsPerPage}`;
			} else {
				url = `/teams/?is_detailed=1&page=${page}&size=${itemsPerPage}`;
			}
			if (this.teamTable.search) {
				url += `&name=${this.teamTable.search}`;
			}
			const { data: res } = await useAuthFetch(url, {
				method: "GET",
			});
			const resObj = res.value as Response;
			if (resObj?.code === 200) {
				this.teamTable.teams = resObj.data ? resObj.data : [];
				this.teamTable.pageCount = resObj.pages;
				this.teamTable.total = resObj.total;
			}
			this.teamTable.loading = false;
		},
		async getTeamsRelatedToCurrentUser() {
			interface Response {
				code: number;
				data: Array<Team>;
			}
			const authStore = useAuthStore();
			const teamIds = authStore.teams.map((team) => team.id);
			const queryString = teamIds
				.map(function (id) {
					return "id=" + id;
				})
				.join("&");
			const { data: res } = await useAuthFetch(
				`/teams/batch?${queryString}`,
				{
					method: "GET",
				}
			);
			const resObj = res.value as Response;
			if (resObj?.code === 200) {
				this.teams = resObj?.data;
			}
		},
		async getAllTeams() {
			const configStore = useConfigStore();
			interface Response {
				code: number;
				data: Array<Team>;
			}
			const { data: res } = await useFetch(
				configStore.apiUrl + "/teams/",
				{
					method: "GET",
				}
			);
			const resObj = res.value as Response;
			this.teams = resObj?.data;
		},
		loadTeamsByUserId() {
			const authStore = useAuthStore();
			this.teams_by_user_id = [];
			this.teams.forEach((team) => {
				if (team.users.includes(authStore.id)) {
					this.teams_by_user_id.push(team);
				}
			});
		},
		async saveTeam() {
			const snackBarStore = useSnackBarStore();
			interface Response {
				code: number;
				msg: string;
			}
			const { data: res } = await useAuthFetch(`/teams/`, {
				method: this.teamEditor.type === "create" ? "POST" : "PUT",
				body: this.teamEditor.team,
			});
			const resObj = res.value as Response;
			if (resObj.code === 200) {
				const text =
					this.teamEditor.type === "create"
						? "团队创建成功"
						: "团队更新成功";
				snackBarStore.showSnackbar(text, "success");
				this.teamEditor.dialog = false;
			} else {
				const text =
					this.teamEditor.type === "create"
						? "团队创建失败"
						: "团队更新失败";
				snackBarStore.showSnackbar(`${text}\n` + resObj?.msg, "error");
				const obj = useCloneDeep(this.teamEditor.team);
				this.$resetTeamEditor();
				this.teamEditor.team = obj;
			}
			await this.loadTeamTable({
				page: this.teamTable.page,
				itemsPerPage: this.teamTable.itemsPerPage,
				sortBy: [],
			});
		},
		async getTeamAvatar(id: number) {
			if (this.teamAvatar[id]) {
				return this.teamAvatar[id];
			}
			const { data: res } = await useAuthFetch(
				`/media/teams/avatar/${id}`,
				{
					method: "GET",
				}
			);
			const resObj = res.value as any;
			if (resObj && resObj?.code !== 404) {
				this.teamAvatar[id] = URL.createObjectURL(resObj);
			} else {
				this.teamAvatar[id] = "";
			}
		},
		deleteTeamAvatar(id: number) {
			if (this.teamAvatar[id]) {
				URL.revokeObjectURL(this.teamAvatar[id]);
				delete this.teamAvatar[id];
			}
		},
		async updateTeamAvatar(id: number) {
			this.deleteTeamAvatar(id);
			await this.getTeamAvatar(id);
		},
	},
});
