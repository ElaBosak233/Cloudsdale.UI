<template>
	<div class="d-flex justify-center align-center pa-10">
		<v-sheet style="min-width: 100%; min-height: 80vh">
			<div class="d-flex justify-between align-center">
				<v-icon icon="mdi-account" size="35" color="primary"></v-icon>
				<v-chip :label="true" class="mx-2" color="primary">
					<span class="font-weight-bold text-h6">用户管理</span>
				</v-chip>
			</div>
			<v-card variant="flat">
				<v-card-title class="d-flex align-center pe-2">
					<v-spacer></v-spacer>
					<v-text-field
						v-model.lazy="searchField"
						prepend-inner-icon="mdi-magnify"
						density="compact"
						label="搜索"
						:single-line="true"
						:flat="true"
						:clearable="true"
						hide-details
						variant="solo-filled"
						@click:prepend-inner="
							userStore.userTable.search = searchField
						"
						@keyup.enter="userStore.userTable.search = searchField"
					></v-text-field>
					<v-btn
						variant="flat"
						color="primary"
						prepend-icon="mdi-account-plus"
						class="ml-2"
						@click="createUser()"
					>
						创建用户
					</v-btn>
				</v-card-title>
				<v-divider></v-divider>
				<v-data-table-server
					v-model:items-per-page="userStore.userTable.itemsPerPage"
					v-model:search="userStore.userTable.search"
					:loading="userStore.userTable.loading"
					loading-text="加载中"
					:items="userStore.userTable.users"
					:items-length="userStore.userTable.total"
					:headers="headers"
					:page="userStore.userTable.page"
					no-data-text="暂无用户"
					items-per-page-text="每页显示"
					:items-per-page-options="[10, 20, 30, 40, 50]"
					@update:page="updatePage"
					@update:options="userStore.loadUserTable"
				>
					<template #[`item.username`]="{ item }">
						<v-sheet class="d-flex justify-center">
							<div class="mx-2">
								<IAvatar :user-id="item.id" :size="30" />
							</div>
							<v-chip :label="true" color="teal">
								{{ item.username }}
							</v-chip>
						</v-sheet>
					</template>

					<template #[`item.nickname`]="{ item }">
						<v-sheet class="d-flex align-center">
							<v-chip :label="true" color="primary">
								{{ item.nickname }}
							</v-chip>
						</v-sheet>
					</template>

					<template #[`item.description`]="{ item }">
						<div
							style="
								max-width: 30vh;
								white-space: nowrap;
								text-overflow: ellipsis;
								overflow: hidden;
							"
						>
							{{ item?.description }}
						</div>
					</template>

					<template #[`item.teams`]="{ item }">
						<v-sheet max-width="30vh">
							<v-chip
								v-if="item.teams"
								:label="true"
								color="blue"
							>
								{{ item.teams.length }} 团队
								<v-tooltip
									activator="parent"
									location="top center"
									>{{
										item.teams
											.map((i) => i?.name)
											.join(", ")
									}}</v-tooltip
								>
							</v-chip>
							<v-chip
								v-if="!item.teams"
								:label="true"
								color="red"
							>
								无团队
							</v-chip>
						</v-sheet>
					</template>

					<template #[`item.updated_at`]="{ item }">
						<v-chip size="small" :label="true">
							{{ new Date(item.updated_at).toLocaleString() }}
						</v-chip>
					</template>

					<template #[`item.actions`]="{ item }">
						<v-list
							:nav="true"
							density="compact"
							:lines="false"
							class="d-flex justify-center"
						>
							<AvatarSettingBtn :item="item" />
							<EditBtn :item="item" />
							<DeleteBtn
								:item="item"
								@finished="
									userStore.loadUserTable({
										page: userStore.userTable.page,
										itemsPerPage:
											userStore.userTable.itemsPerPage,
										sortBy: [],
									})
								"
							/>
						</v-list>
					</template>
				</v-data-table-server>
			</v-card>
		</v-sheet>
		<UserEditor v-model="userStore.userEditor.dialog" />
	</div>
</template>

<script setup lang="ts">
import { useUserStore } from "~/store/user";
import { useConfigStore } from "~/store/config";
import DeleteBtn from "@/components/admin/users/actions/DeleteBtn.vue";
import EditBtn from "@/components/admin/users/actions/EditBtn.vue";
import UserEditor from "@/components/admin/users/UserEditor.vue";
import IAvatar from "@/components/avatar/IAvatar.vue";
import AvatarSettingBtn from "@/components/admin/users/avatar/AvatarSettingBtn.vue";

const configStore = useConfigStore();
const userStore = useUserStore();

definePageMeta({
	layout: "admin",
});
useHead({
	title: `用户管理 - ${configStore.pltCfg.site.title}`,
});

// 数据表
const searchField = ref("");
const headers = ref([
	{ title: "ID", align: "start", key: "id" },
	{ title: "用户名", align: "center", key: "username" },
	{ title: "昵称", align: "start", key: "nickname", sortable: false },
	{ title: "邮箱", align: "start", key: "email", sortable: false },
	{ title: "团队", align: "center", key: "teams", sortable: false },
	{ title: "权限", align: "start", key: "group.name", sortable: false },
	{ title: "更新时间", align: "center", key: "updated_at" },
	{ title: "操作", align: "center", key: "actions", sortable: false },
]);

function createUser() {
	userStore.$resetUserEditor();
	userStore.userEditor.type = "create";
	userStore.userEditor.dialog = true;
}
function updatePage(p: number) {
	userStore.userTable.page = p;
}
</script>
