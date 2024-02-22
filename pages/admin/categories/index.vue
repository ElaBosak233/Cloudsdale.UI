<template>
	<div class="d-flex justify-center align-center">
		<v-sheet class="pa-10" style="min-width: 100%">
			<div class="d-flex justify-between align-center">
				<v-icon icon="mdi-package-variant" size="35" color="primary"></v-icon>
				<v-chip :label="true" class="mx-2" color="primary">
					<span class="font-weight-bold text-h6 no-select">分类管理</span>
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
							search = searchField
						"
						@keyup.enter="
							search = searchField
						"
					></v-text-field>
<!--					<v-btn-->
<!--						variant="flat"-->
<!--						color="primary"-->
<!--						prepend-icon="mdi-book-plus"-->
<!--						class="ml-2"-->
<!--						@click="createChallenge()"-->
<!--					>-->
<!--						添加题目-->
<!--					</v-btn>-->
				</v-card-title>
				<v-divider></v-divider>
				<v-data-table-server
					v-model:items-per-page="itemsPerPage"
					v-model:search="search"
					:loading="loading"
					loading-text="加载中"
					:items="categories"
					:items-length="total"
					:page="page"
					:headers="headers"
					no-data-text="暂无题目"
					items-per-page-text="每页显示"
					:items-per-page-options="[10, 20, 30, 40, 50]"
					@update:page="updatePage"
					@update:options="loadCategoryTable"
				>
					<template #[`item.name`]="{ item }">
						<span :style="`color: ${item.color}`">
							{{ item.name }}
						</span>
					</template>

					<template #[`item.color`]="{ item }">
						<v-chip :color="item.color" class="white--text">
							{{ item.color }}
						</v-chip>
					</template>

					<template #[`item.icon`]="{ item }">
						<div class="d-flex align-center">
							<v-icon
								:color="item.color"
								:icon="`mdi-${item.icon}`"
								size="24"
							/>
							<span class="pl-2" :style="`color: ${item.color};`">
								{{ item.icon }}
							</span>
						</div>
					</template>

					<template #[`item.updated_at`]="{ item }">
						<v-chip size="small" :label="true">
							{{ new Date(item.updated_at).toLocaleString() }}
						</v-chip>
					</template>
				</v-data-table-server>
			</v-card>
		</v-sheet>
	</div>
</template>

<script setup lang="ts">
import type { Category } from "@/types/category";
import { useConfigStore } from "@/store/config";
import { getCategory } from "@/api/category";

const configStore = useConfigStore();

const categories = ref(Array<Category>());

const headers = ref([
	{ title: "ID", key: "id" },
	{ title: "名称", key: "name", sortable: false },
	{ title: "描述", key: "description", sortable: false },
	{ title: "颜色", key: "color", sortable: false },
	{ title: "图标", key: "icon", sortable: false },
	{ title: "更新时间", key: "updated_at", sortable: false },
	{ title: "操作", key: "actions", sortable: false },
]);

const searchField = ref("");
const lastParams = ref({ page: 1, itemsPerPage: 10, sortBy: [] });
const loading = ref(false);
const search = ref("");
const itemsPerPage = ref(10);
const page = ref(1);
const total = ref(0);

async function loadCategoryTable({ page, itemsPerPage, sortBy }: any) {
	lastParams.value = { page, itemsPerPage, sortBy };
	loading.value = true;
	let url = "";
	if (sortBy.length > 0) {
		url = `is_detailed=1&sort_by=${sortBy[0]?.key}&sort_by=${sortBy[0]?.order}&page=${page}&size=${itemsPerPage}`;
	} else {
		url = `is_detailed=1&page=${page}&size=${itemsPerPage}`;
	}
	if (search.value) {
		url += `&title=${search.value}`;
	}
	const response = await getCategory(url);
	if (response?.code === 200) {
		categories.value = response.data ? response.data : [];
		total.value = response.total ? response.total : 0;
	}
	loading.value = false;
}

function updatePage(p: number) {
	page.value = p;
}

definePageMeta({
	layout: "admin",
});

useHead({
	title: `分类管理 - ${configStore.pltCfg.site.title}`,
});
</script>

<style scoped lang="scss"></style>
