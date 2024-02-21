<template>
	<div class="d-flex justify-center align-center pa-10">
		<v-sheet style="min-width: 100%; min-height: 80vh">
			<div class="d-flex justify-between align-center">
				<v-icon
					icon="mdi-account-multiple"
					size="35"
					color="primary"
				></v-icon>
				<v-chip :label="true" class="mx-2" color="primary">
					<span class="font-weight-bold text-h6">团队管理</span>
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
							teamStore.teamTable.search = searchField
						"
						@keyup.enter="teamStore.teamTable.search = searchField"
					></v-text-field>
					<v-btn
						variant="flat"
						color="primary"
						prepend-icon="mdi-account-multiple-plus"
						class="ml-2"
						@click="createTeam()"
					>
						创建团队
					</v-btn>
				</v-card-title>
				<v-divider></v-divider>
				<v-data-table-server
					v-model:items-per-page="teamStore.teamTable.itemsPerPage"
					v-model:search="teamStore.teamTable.search"
					:loading="teamStore.teamTable.loading"
					loading-text="加载中"
					:items="teamStore.teamTable.teams"
					:items-length="teamStore.teamTable.total"
					:headers="headers"
					:page="teamStore.teamTable.page"
					no-data-text="暂无用户"
					items-per-page-text="每页显示"
					:items-per-page-options="[10, 20, 30, 40, 50]"
					@update:page="updatePage"
					@update:options="teamStore.loadTeamTable"
				>
					<template #[`item.name`]="{ item }">
						<v-sheet class="d-flex justify-start align-center">
							<div class="mx-2">
								<TAvatar :team-id="item.id" :size="30" />
							</div>
							<v-chip :label="true" color="teal">
								{{ item.name }}
							</v-chip>
						</v-sheet>
					</template>

					<template #[`item.captain.nickname`]="{ item }">
						<v-sheet class="d-flex justify-start align-center">
							<div class="mx-2">
								<IAvatar
									:user-id="item.captain_id"
									:size="30"
								/>
							</div>
							<v-chip :label="true" color="primary">
								{{ item.captain.nickname }}
							</v-chip>
						</v-sheet>
					</template>

					<template #[`item.users`]="{ item }">
						<div class="d-flex justify-start">
							<div
								v-for="user in item.users.slice(0, 7)"
								:key="user?.id"
							>
								<v-tooltip
									:text="user?.nickname"
									location="top center"
								>
									<template #activator="{ props: tooltip }">
										<IAvatar
											v-bind="tooltip"
											:user-id="user.id"
											:size="30"
											class="avatar-group-item"
										/>
									</template>
								</v-tooltip>
							</div>
						</div>
					</template>

					<template #[`item.description`]="{ item }">
						<div
							style="
								max-width: 20vh;
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
									teamStore.loadTeamTable({
										page: teamStore.teamTable.page,
										itemsPerPage:
											teamStore.teamTable.itemsPerPage,
										sortBy: [],
									})
								"
							/>
						</v-list>
					</template>
				</v-data-table-server>
			</v-card>
		</v-sheet>
		<TeamEditor v-model="teamStore.teamEditor.dialog" />
	</div>
</template>

<script setup lang="ts">
import { useTeamStore } from "~/store/team";
import { useConfigStore } from "~/store/config";
import DeleteBtn from "@/components/admin/teams/actions/DeleteBtn.vue";
import EditBtn from "@/components/admin/teams/actions/EditBtn.vue";
import IAvatar from "@/components/avatar/IAvatar.vue";
import AvatarSettingBtn from "@/components/admin/teams/avatar/AvatarSettingBtn.vue";
import TAvatar from "@/components/avatar/TAvatar.vue";
import TeamEditor from "@/components/admin/teams/TeamEditor.vue";

const configStore = useConfigStore();
const teamStore = useTeamStore();

definePageMeta({
	layout: "admin",
});
useHead({
	title: `团队管理 - ${configStore.pltCfg.site.title}`,
});

// 数据表
const searchField = ref("");
const headers = ref([
	{ title: "ID", align: "start", key: "id" },
	{ title: "团队名", align: "center", key: "name" },
	{ title: "团队简介", align: "start", key: "description", sortable: false },
	{
		title: "队长",
		align: "center",
		key: "captain.nickname",
		sortable: false,
	},
	{ title: "队员", align: "center", key: "users", sortable: false },
	{ title: "更新时间", align: "center", key: "updated_at" },
	{ title: "操作", align: "center", key: "actions", sortable: false },
]);

function createTeam() {
	teamStore.$resetTeamEditor();
	teamStore.teamEditor.type = "create";
	teamStore.teamEditor.dialog = true;
}
function updatePage(p: number) {
	teamStore.teamTable.page = p;
}
</script>

<style scoped lang="scss">
.avatar-group-item {
	border-radius: 50%;
	object-fit: cover;
	margin-right: -15px;
}
</style>
