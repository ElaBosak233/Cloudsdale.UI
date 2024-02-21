<template>
	<div class="d-flex justify-center align-center pa-10">
		<v-sheet style="min-width: 100%; min-height: 80vh">
			<div class="d-flex justify-between align-center">
				<v-icon icon="mdi-flag" size="35" color="primary"></v-icon>
				<v-chip :label="true" class="mx-2" color="primary">
					<span class="font-weight-bold text-h6">比赛管理</span>
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
							gameStore.gameTable.search = searchField
						"
						@keyup.enter="gameStore.gameTable.search = searchField"
					></v-text-field>
					<v-btn
						variant="flat"
						color="primary"
						prepend-icon="mdi-flag-plus"
						class="ml-2"
						@click=""
					>
						创建比赛
					</v-btn>
				</v-card-title>
				<v-divider></v-divider>
				<v-data-table-server
					v-model:items-per-page="gameStore.gameTable.itemsPerPage"
					v-model:search="gameStore.gameTable.search"
					:loading="gameStore.gameTable.loading"
					loading-text="加载中"
					:items="gameStore.gameTable.games"
					:items-length="gameStore.gameTable.total"
					:headers="headers"
					:page="gameStore.gameTable.page"
					no-data-text="暂无数据"
					items-per-page-text="每页显示"
					:items-per-page-options="[10, 20, 30, 40, 50]"
					@update:page="updatePage"
					@update:options="loadGameTable"
				>
					<template #[`item.title`]="{ item }">
						<v-sheet class="d-flex align-center">
							<div class="mr-2">
								<GameCover
									:game-id="item.id"
									:width="100"
									:height="(100 / 16) * 9"
								/>
							</div>
							<v-chip :label="true" color="primary">
								{{ item.title }}
							</v-chip>
						</v-sheet>
					</template>

					<template #[`item.status`]="{ item }">
						<div class="d-flex align-center">
							<div>
								<v-chip
									v-if="
										new Date() >
											new Date(item.started_at) &&
										new Date() < new Date(item.ended_at)
									"
									color="green"
									:inline="true"
								>
									进行中
								</v-chip>
								<v-chip
									v-if="
										new Date() < new Date(item.started_at)
									"
									color="orange"
									:inline="true"
								>
									未开始
								</v-chip>
								<v-chip
									v-if="new Date() > new Date(item.ended_at)"
									color="red"
									:inline="true"
								>
									已结束
								</v-chip>
							</div>
							<div class="ml-2 text-caption">
								<div>
									{{
										new Date(
											item.started_at
										).toLocaleString()
									}}
								</div>
								<v-divider />
								<div>
									{{
										new Date(item.ended_at).toLocaleString()
									}}
								</div>
							</div>
						</div>
					</template>

					<template #[`item.is_enabled`]="{ item }">
						<v-switch
							v-model="item.is_enabled"
							:inline="true"
							:hide-details="true"
							:flat="true"
							color="primary"
							@change="switchGameIsEnabled(item, item.is_enabled)"
						></v-switch>
					</template>

					<template #[`item.actions`]="{ item }">
						<v-list
							:nav="true"
							density="compact"
							:lines="false"
							class="d-flex"
						>
							<DeleteBtn
								:item="item"
								@finished="
									loadGameTable({
										page: gameStore.gameTable.page,
										itemsPerPage:
											gameStore.gameTable.itemsPerPage,
										sortBy: [],
									})
								"
							/>
							<v-list-item
								base-color="teal"
								@click="$router.push(`/admin/games/${item.id}`)"
							>
								<v-icon icon="mdi-login"></v-icon>
								<v-tooltip
									activator="parent"
									location="top center"
								>
									进入
								</v-tooltip>
							</v-list-item>
						</v-list>
					</template>
				</v-data-table-server>
			</v-card>
		</v-sheet>
	</div>
</template>

<script setup lang="ts">
import { useConfigStore } from "~/store/config";
import { useGameStore } from "~/store/game";
import { useSnackBarStore } from "~/store/snackBar";
import DeleteBtn from "@/components/admin/submissions/actions/DeleteBtn.vue";
import GameCover from "@/components/avatar/GameCover.vue";

const configStore = useConfigStore();
const gameStore = useGameStore();
const snackBarStore = useSnackBarStore();

definePageMeta({
	layout: "admin",
});
useHead({
	title: `比赛管理 - ${configStore.pltCfg.site.title}`,
});

// 数据表
const searchField = ref("");
const headers = ref([
	{ title: "ID", align: "center", key: "id" },
	{ title: "标题", align: "start", key: "title", sortable: false },
	{ title: "简介", align: "start", key: "bio", sortable: false },
	{ title: "状态", align: "start", key: "status", sortable: false },
	{ title: "是否启用", align: "start", key: "is_enabled", sortable: false },
	{ title: "操作", align: "center", key: "actions", sortable: false },
]);
function updatePage(p: number) {
	gameStore.gameTable.page = p;
}

const lastParams = ref({});
async function loadGameTable({ page, itemsPerPage, sortBy }: any) {
	lastParams.value = { page, itemsPerPage, sortBy };
	gameStore.gameTable.loading = true;
	interface Response {
		code: number;
		data: Array<any>;
		pages: number;
		total: number;
	}
	let url = "";
	if (sortBy.length > 0) {
		url = `/games/?is_enabled=-1&sort_by=${sortBy[0]?.key}&sort_by=${sortBy[0]?.order}&page=${page}&size=${itemsPerPage}`;
	} else {
		url = `/games/?is_enabled=-1&page=${page}&size=${itemsPerPage}`;
	}
	if (gameStore.gameTable.search) {
		url += `&title=${gameStore.gameTable.search}`;
	}
	const { data: res } = await useAuthFetch(url, {
		method: "GET",
	});
	const resObj = res.value as Response;
	if (resObj?.code === 200) {
		gameStore.gameTable.games = resObj.data ? resObj.data : [];
		gameStore.gameTable.pageCount = resObj.pages;
		gameStore.gameTable.total = resObj.total;
	}
	gameStore.gameTable.loading = false;
}

async function switchGameIsEnabled(item: Game, isEnabled: boolean) {
	interface Response {
		code: number;
		msg: string;
	}
	const { data: res } = await useAuthFetch(`/games/`, {
		method: "PUT",
		body: {
			id: item.id,
			is_enabled: isEnabled,
		},
	});
	const resObj = res.value as Response;
	if (resObj.code === 200) {
		snackBarStore.showSnackbar(
			"比赛已" + (isEnabled ? "启用" : "禁用"),
			"success"
		);
	} else {
		snackBarStore.showSnackbar("操作失败\n" + resObj.msg, "error");
	}
	loadGameTable({
		page: lastParams.value.page || 1,
		itemsPerPage: lastParams.value.itemsPerPage || 10,
		sortBy: lastParams.value.sortBy || [],
	});
}
</script>
