<template>
	<div class="d-flex justify-center align-center pa-10">
		<v-sheet style="min-width: 100%; min-height: 80vh">
			<div class="d-flex justify-between align-center">
				<v-icon
					icon="mdi-check-decagram"
					size="35"
					color="primary"
				></v-icon>
				<v-chip :label="true" class="mx-2" color="primary">
					<span class="font-weight-bold text-h6">提交记录管理</span>
				</v-chip>
			</div>
			<v-card variant="flat">
				<v-divider class="mt-10"></v-divider>
				<v-data-table-server
					v-model:items-per-page="
						submissionStore.submissionTable.itemsPerPage
					"
					v-model:search="submissionStore.submissionTable.search"
					:loading="submissionStore.submissionTable.loading"
					loading-text="加载中"
					:items="submissionStore.submissionTable.submissions"
					:items-length="submissionStore.submissionTable.total"
					:headers="headers"
					:page="submissionStore.submissionTable.page"
					no-data-text="暂无数据"
					items-per-page-text="每页显示"
					:items-per-page-options="[10, 20, 30, 40, 50]"
					@update:page="updatePage"
					@update:options="loadSubmissionTable"
				>
					<template #[`item.user.nickname`]="{ item }">
						<v-sheet class="d-flex justify-center align-center">
							<div class="mx-2">
								<IAvatar :user-id="item.user_id" :size="30" />
							</div>
							<v-chip :label="true" color="primary">
								{{ item.user.nickname }}
							</v-chip>
						</v-sheet>
					</template>

					<template #[`item.team.name`]="{ item }">
						<v-sheet
							v-if="item.team_id"
							class="d-flex justify-center align-center"
						>
							<div class="mx-2">
								<TAvatar :team-id="item.team_id" :size="30" />
							</div>
							<v-chip :label="true" color="primary">
								{{ item.team.name }}
							</v-chip>
						</v-sheet>
						<v-sheet v-else>
							<v-chip :label="true" color="orange"> 个人 </v-chip>
						</v-sheet>
					</template>

					<template #[`item.game.title`]="{ item }">
						<v-sheet
							v-if="item.game_id"
							class="d-flex align-center"
						>
							<v-chip :label="true" size="x-small" color="teal">
								{{ item.game_id }}
							</v-chip>
							<div class="mx-2">
								{{ item.game.title }}
							</div>
						</v-sheet>
						<v-sheet v-else>
							<v-chip :label="true" color="teal"> 无 </v-chip>
						</v-sheet>
					</template>

					<template #[`item.challenge.title`]="{ item }">
						<div class="d-flex align-center">
							<v-chip :label="true" size="x-small" color="teal">
								{{ item.challenge_id }}
							</v-chip>
							<div class="mx-2">
								{{ item.challenge.title }}
							</div>
						</div>
					</template>

					<template #[`item.flag`]="{ item }">
						<div
							style="
								max-width: 50 vh;
								overflow: hidden;
								white-space: nowrap;
								text-overflow: ellipsis;
							"
						>
							{{ item.flag }}
							<v-tooltip
								activator="parent"
								location="top center"
								>{{ item.flag }}</v-tooltip
							>
						</div>
					</template>

					<template #[`item.status`]="{ item }">
						<v-chip
							v-if="item.status === 1"
							:label="true"
							color="red"
						>
							错误
						</v-chip>
						<v-chip
							v-else-if="item.status === 2"
							:label="true"
							color="success"
						>
							正确
						</v-chip>
						<v-chip
							v-else-if="item.status === 3"
							:label="true"
							color="orange"
						>
							作弊
						</v-chip>
						<v-chip
							v-else-if="item.status === 4"
							:label="true"
							color="blue"
						>
							重复
						</v-chip>
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
							class="d-flex"
						>
							<DeleteBtn
								:item="item"
								@finished="
									loadSubmissionTable({
										page: submissionStore.submissionTable
											.page,
										itemsPerPage:
											submissionStore.submissionTable
												.itemsPerPage,
										sortBy: [],
									})
								"
							/>
						</v-list>
					</template>
				</v-data-table-server>
			</v-card>
		</v-sheet>
	</div>
</template>

<script setup lang="ts">
import { useConfigStore } from "@/store/config";
import { useSubmissionStore } from "@/store/submission";
import DeleteBtn from "@/components/admin/submissions/actions/DeleteBtn.vue";
import IAvatar from "@/components/images/IAvatar.vue";
import TAvatar from "@/components/images/TAvatar.vue";

const configStore = useConfigStore();
const submissionStore = useSubmissionStore();

definePageMeta({
	layout: "admin",
});
useHead({
	title: `提交记录管理 - ${configStore.pltCfg.site.title}`,
});

// 数据表
const searchField = ref("");
const headers = ref([
	{ title: "ID", align: "center", key: "id" },
	{ title: "用户", align: "center", key: "user.nickname", sortable: false },
	{ title: "团队", align: "center", key: "team.name", sortable: false },
	{ title: "比赛", align: "center", key: "game.title", sortable: false },
	{ title: "题目", align: "start", key: "challenge.title", sortable: false },
	{ title: "提交内容", align: "start", key: "flag", sortable: false },
	{ title: "得分", align: "center", key: "pts", sortable: false },
	{ title: "判定结果", align: "center", key: "status", sortable: false },
	{ title: "更新时间", align: "center", key: "updated_at" },
	{ title: "操作", align: "center", key: "actions", sortable: false },
]);
function updatePage(p: number) {
	submissionStore.submissionTable.page = p;
}

async function loadSubmissionTable({ page, itemsPerPage, sortBy }: any) {
	submissionStore.submissionTable.loading = true;
	interface Response {
		code: number;
		data: Array<any>;
		pages: number;
		total: number;
	}
	let url = "";
	if (sortBy.length > 0) {
		url = `/submissions/?is_detailed=1&sort_by=${sortBy[0]?.key}&sort_by=${sortBy[0]?.order}&page=${page}&size=${itemsPerPage}`;
	} else {
		url = `/submissions/?is_detailed=1&page=${page}&size=${itemsPerPage}`;
	}
	if (submissionStore.submissionTable.search) {
		url += `&title=${submissionStore.submissionTable.search}`;
	}
	const { data: res } = await useAuthFetch(url, {
		method: "GET",
	});
	const resObj = res.value as Response;
	if (resObj?.code === 200) {
		submissionStore.submissionTable.submissions = resObj.data
			? resObj.data
			: [];
		submissionStore.submissionTable.pageCount = resObj.pages;
		submissionStore.submissionTable.total = resObj.total;
	}
	submissionStore.submissionTable.loading = false;
}
</script>
