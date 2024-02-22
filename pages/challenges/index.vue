<template>
	<div>
		<v-sheet
			:height="200"
			min-width="100%"
			color="blue-darken-2"
			class="d-flex justify-center align-center"
			style="z-index: -1; background-size: cover"
		>
			<div class="text-h4">练习场</div>
		</v-sheet>
		<div>
			<div style="padding: 3% 5%">
				<div class="d-flex w-full">
					<v-tabs
						v-model="tab"
						direction="vertical"
						style="min-width: 200px"
					>
						<div class="d-flex justify-center px-3">
							<v-text-field
								v-model="searchInput"
								density="compact"
								variant="solo-filled"
								label="搜索"
								:single-line="true"
								:flat="true"
								prepend-inner-icon="mdi-magnify"
								:hide-details="true"
								:clearable="true"
								@click:prepend-inner="search()"
								@keydown.enter="search()"
							></v-text-field>
						</div>
						<v-divider class="ma-2" />
						<v-tab
							class="category-tab"
							value="all"
							color="blue"
							@click="
								challengeStore.loadChallenges(
									1,
									'is_practicable=1'
								)
							"
						>
							<v-icon :start="true" icon="mdi-book-multiple" />
							All
						</v-tab>
						<v-tab
							v-for="category in categoryStore.categories"
							:key="category.id"
							class="category-tab"
							:value="category.id"
							:color="category.color"
							@click="
								challengeStore.loadChallenges(
									1,
									`is_practicable=1&category_id=${category.id}`
								)
							"
						>
							<v-icon
								:start="true"
								:icon="`mdi-${category.icon}`"
							/>
							{{ category.name }}
						</v-tab>
					</v-tabs>
					<v-divider :vertical="true" />
					<div class="d-flex flex-column flex-1-1">
						<div class="d-flex flex-wrap" style="margin-left: 50px">
							<div
								v-for="challenge in challengeStore.challenges"
								:key="challenge?.id"
							>
								<ChallengeCard
									:challenge="challenge"
									class="ma-2 pa-2"
								/>
							</div>
						</div>
						<div class="d-flex justify-center mt-5">
							<v-pagination
								v-model="challengeStore.current_page"
								class="my-4"
								:length="challengeStore.pages"
								total-visible="5"
								@click="pagination()"
							></v-pagination>
						</div>
					</div>
				</div>
			</div>
		</div>
		<CornerIcon icon="mdi-gamepad" />
	</div>
</template>

<script setup lang="ts">
import { useConfigStore } from "@/store/config";
import { useChallengeStore } from "@/store/challenge";
import { useCategoryStore } from "@/store/category";
import ChallengeCard from "@/components/widgets/ChallengeCard.vue";
import CornerIcon from "@/components/ui/CornerIcon.vue";

const configStore = useConfigStore();
const challengeStore = useChallengeStore();
const categoryStore = useCategoryStore();

useHead({
	title: `题库 - ${configStore.pltCfg.site.title}`,
});

const tab = ref("");
const searchInput = ref("");

categoryStore.loadCategories();
challengeStore.loadChallenges(1, `is_practicable=1`);

function search() {
	let filters = `is_practicable=1&`;
	if (tab.value !== "all") {
		filters += searchInput.value
			? `category=${tab.value}&title=${searchInput.value}`
			: `category=${tab.value}`;
		challengeStore.loadChallenges(1, filters);
	} else {
		filters += searchInput.value ? `title=${searchInput.value}` : ``;
		challengeStore.loadChallenges(1, filters);
	}
}

function pagination() {
	challengeStore.loadChallenges(
		challengeStore.current_page,
		challengeStore.last_filters
	);
}
</script>

<style scoped lang="scss">
.category-tab {
	letter-spacing: 1px;
	text-transform: capitalize;
}
</style>
