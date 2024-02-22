import { useAuthFetch } from "@/composables/useAuthFetch";
import { useSnackBarStore } from "@/store/snackBar";
import type { User } from "@/types/user";

interface UserTable {
	loading: boolean;
	search: string;
	users: Array<User>;
	pageCount: number;
	total: number;
	itemsPerPage: number;
	page: number;
}

interface UserEditor {
	dialog: boolean;
	type: "create" | "edit";
	user: User | null;
}

export interface UserState {
	userTable: UserTable;
	userEditor: UserEditor;
}

export const useUserStore = defineStore("user", {
	state: (): UserState => ({
		userTable: {
			loading: false,
			search: "",
			users: [],
			pageCount: 1,
			total: 1,
			itemsPerPage: 10,
			page: 1,
		},
		userEditor: {
			dialog: false,
			type: "create",
			user: null,
		},
	}),
	actions: {
		$resetUserEditor() {
			this.userEditor.user = useCloneDeep(null);
		},
		async loadUserTable({ page, itemsPerPage, sortBy }: any) {
			this.userTable.loading = true;
			interface Response {
				code: number;
				data: Array<any>;
				pages: number;
				total: number;
			}
			let url = "";
			if (sortBy.length > 0) {
				url = `/users/?sort_by=${sortBy[0]?.key}&sort_by=${sortBy[0]?.order}&page=${page}&size=${itemsPerPage}`;
			} else {
				url = `/users/?page=${page}&size=${itemsPerPage}`;
			}
			if (this.userTable.search) {
				url += `&name=${this.userTable.search}`;
			}
			const { data: res } = await useAuthFetch(url, {
				method: "GET",
			});
			const resObj = res.value as Response;
			if (resObj?.code === 200) {
				this.userTable.users = resObj.data ? resObj.data : [];
				this.userTable.pageCount = resObj.pages;
				this.userTable.total = resObj.total;
			}
			this.userTable.loading = false;
		},
		async saveUser() {
			const snackBarStore = useSnackBarStore();
			interface Response {
				code: number;
				msg: string;
			}
			const { data: res } = await useAuthFetch(`/users/`, {
				method: this.userEditor.type === "create" ? "POST" : "PUT",
				body: this.userEditor.user,
			});
			const resObj = res.value as Response;
			if (resObj.code === 200) {
				const text =
					this.userEditor.type === "create"
						? "用户创建成功"
						: "用户更新成功";
				snackBarStore.showSnackbar(text, "success");
				this.userEditor.dialog = false;
			} else {
				const text =
					this.userEditor.type === "create"
						? "用户创建失败"
						: "用户更新失败";
				snackBarStore.showSnackbar(`${text}\n` + resObj?.msg, "error");
				// 下面三行是为了修一个邪门的 Bug，说来也很离谱，但必须在这里当日记记下来
				// 如果我第一次点击提交，返回是失败的，如果 userEditor 不得到 reset，那么你接下来每输入一个字符，都会莫名其妙的向后端提交
				const obj = useCloneDeep(this.userEditor.user);
				this.$resetUserEditor();
				this.userEditor.user = obj;
			}
			await this.loadUserTable({
				page: this.userTable.page,
				itemsPerPage: this.userTable.itemsPerPage,
				sortBy: [],
			});
		},
	},
});
