<template>
	<div class="d-flex justify-center align-center pa-10">
		<v-sheet style="min-width: 100%; min-height: 80vh">
			<div class="d-flex justify-between align-center">
				<v-icon
					icon="mdi-bookmark-box-multiple"
					size="35"
					color="primary"
				></v-icon>
				<v-chip :label="true" class="mx-2" color="primary">
					<span class="font-weight-bold text-h6">题库管理</span>
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
							challengeStore.challengeTable.search = searchField
						"
						@keyup.enter="
							challengeStore.challengeTable.search = searchField
						"
					></v-text-field>
					<v-btn
						variant="flat"
						color="primary"
						prepend-icon="mdi-book-plus"
						class="ml-2"
						@click="createChallenge()"
					>
						添加题目
					</v-btn>
				</v-card-title>
				<v-divider></v-divider>
				<v-data-table-server
					v-model:items-per-page="
						challengeStore.challengeTable.itemsPerPage
					"
					v-model:search="challengeStore.challengeTable.search"
					:loading="challengeStore.challengeTable.loading"
					loading-text="加载中"
					:items="challengeStore.challengeTable.challenges"
					:items-length="challengeStore.challengeTable.total"
					:headers="headers"
					:page="challengeStore.challengeTable.page"
					no-data-text="暂无题目"
					items-per-page-text="每页显示"
					:items-per-page-options="[10, 20, 30, 40, 50]"
					@update:page="updatePage"
					@update:options="challengeStore.loadChallengeTable"
				>
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

					<template #[`item.category`]="{ item }">
						<div class="d-flex align-center">
							<v-icon
								:icon="`mdi-${item?.category?.icon}`"
								:color="item?.category?.color"
							></v-icon>
							<v-chip
								class="mx-2"
								:color="item?.category?.color"
								style="text-transform: capitalize"
							>
								{{ item?.category?.name }}
							</v-chip>
						</div>
					</template>

					<template #[`item.is_dynamic`]="{ item }">
						<div class="d-flex align-center">
							<div v-if="item?.is_dynamic">
								<v-chip color="warning"> 动态 </v-chip>
							</div>
							<div v-if="!item?.is_dynamic">
								<v-chip color="blue"> 静态 </v-chip>
							</div>
						</div>
					</template>

					<template #[`item.updated_at`]="{ item }">
						<v-chip size="small" :label="true">
							{{ new Date(item.updated_at).toLocaleString() }}
						</v-chip>
					</template>

					<template #[`item.difficulty`]="{ item }">
						<v-rating
							:model-value="item?.difficulty"
							:color="item?.category?.color"
							density="compact"
							size="20"
							:readonly="true"
						></v-rating>
					</template>

					<template #[`item.is_practicable`]="{ item }">
						<v-switch
							v-model="item.is_practicable"
							:inline="true"
							:hide-details="true"
							:flat="true"
							color="primary"
							@change="
								switchChallengeIsPracticable(
									item,
									item.is_practicable
								)
							"
						></v-switch>
					</template>

					<template #[`item.attachment`]="{ item }">
						<div class="d-flex justify-center">
							<v-list
								v-if="item?.has_attachment"
								:nav="true"
								density="compact"
								:lines="false"
								class="d-flex"
							>
								<AttachmentSettingBtn :item="item" />
							</v-list>
							<v-chip v-if="!item?.has_attachment" color="error">
								无
							</v-chip>
						</div>
					</template>

					<template #[`item.actions`]="{ item }">
						<v-list
							:nav="true"
							density="compact"
							:lines="false"
							class="d-flex justify-center"
						>
							<EditBtn :item="item" />
							<DeleteBtn
								:item="item"
								@finished="
									challengeStore.loadChallengeTable({
										page: challengeStore.challengeTable
											.page,
										itemsPerPage:
											challengeStore.challengeTable
												.itemsPerPage,
										sortBy: [],
									})
								"
							/>
							<PreviewBtn :item="item" />
						</v-list>
					</template>
				</v-data-table-server>
			</v-card>
		</v-sheet>
		<ChallengeEditor v-model="challengeStore.challengeEditor.dialog" />
	</div>
</template>

<script setup lang="ts">
import { useConfigStore } from "@/store/config";
import { useChallengeStore } from "@/store/challenge";
import { useSnackBarStore } from "@/store/snackBar";
import PreviewBtn from "@/components/admin/challenges/actions/PreviewBtn.vue";
import DeleteBtn from "@/components/admin/challenges/actions/DeleteBtn.vue";
import EditBtn from "@/components/admin/challenges/actions/EditBtn.vue";
import AttachmentSettingBtn from "@/components/admin/challenges/attachment/AttachmentSettingBtn.vue";
import ChallengeEditor from "@/components/admin/challenges/ChallengeEditor.vue";

const configStore = useConfigStore();
const challengeStore = useChallengeStore();
const snackBarStore = useSnackBarStore();

// 数据表
const searchField = ref("");
const headers = ref([
	{ title: "ID", align: "start", key: "id" },
	{ title: "标题", align: "start", key: "title" },
	{ title: "描述", align: "start", key: "description", sortable: false },
	{ title: "分类", align: "start", key: "category", sortable: false },
	{ title: "难度", align: "start", key: "difficulty" },
	{ title: "类型", align: "start", key: "is_dynamic" },
	{ title: "练习题", align: "start", key: "is_practicable" },
	{ title: "更新时间", align: "start", key: "updated_at" },
	{ title: "附件", align: "center", key: "attachment", sortable: false },
	{ title: "操作", align: "center", key: "actions", sortable: false },
]);

definePageMeta({
	layout: "admin",
});
useHead({
	title: `题库管理 - ${configStore.pltCfg.site.title}`,
});

function createChallenge() {
	challengeStore.$resetChallengeEditor();
	challengeStore.challengeEditor.type = "create";
	challengeStore.challengeEditor.dialog = true;
}

function updatePage(p: number) {
	challengeStore.challengeTable.page = p;
}

async function switchChallengeIsPracticable(
	item: Challenge,
	isPracticable: boolean
) {
	interface Response {
		code: number;
		msg: string;
	}
	const { data: res } = await useAuthFetch(`/challenges/`, {
		method: "PUT",
		data: {
			id: item.id,
			is_practicable: isPracticable,
		},
	});
	const resObj = res.value as Response;
	if (resObj.code === 200) {
		snackBarStore.showSnackbar(
			"题目已" + (isPracticable ? "启用" : "禁用"),
			"success"
		);
	} else {
		snackBarStore.showSnackbar("操作失败\n" + resObj.msg, "error");
	}
	challengeStore.loadChallengeTable({
		page: challengeStore.challengeTable.lastParams.page || 1,
		itemsPerPage:
			challengeStore.challengeTable.lastParams.itemsPerPage || 10,
		sortBy: challengeStore.challengeTable.lastParams.sortBy || [],
	});
}
</script>
