<template>
	<v-card
		class="challenge-card no-select"
		:variant="challenge.is_solved ? 'elevated' : 'tonal'"
		:color="challenge.category.color"
		elevation="3"
		@click="dialog = true"
	>
		<v-card-item>
			<div>
				<v-chip
					size="small"
					style="
						font-size: 0.75rem !important;
						font-weight: 500;
						line-height: 2rem;
						text-transform: capitalize !important;
						margin-bottom: 0.25rem;
					"
				>
					{{ challenge.category.name }}
				</v-chip>
				<div
					class="text-h6 my-1 font-weight-bold"
					style="
						width: 200px;
						white-space: nowrap;
						text-overflow: ellipsis;
						overflow: hidden;
					"
				>
					{{ challenge.title }}
				</div>
				<v-divider thickness="2" />
				<div class="d-flex flex-wrap justify-space-between">
					<div class="ma-2 pa-2 font-weight-bold">
						{{ challenge.pts }} pts
					</div>
					<div class="d-flex justify-center align-center">
						<v-rating
							:readonly="true"
							:length="5"
							:size="24"
							:model-value="challenge.difficulty"
						/>
					</div>
				</div>
			</div>
		</v-card-item>
		<v-tooltip text="已解决" location="top center">
			<template #activator="{ props: tooltip }">
				<v-icon
					v-show="challenge.is_solved"
					class="check"
					icon="mdi-check"
					style="position: absolute; right: 15px; top: 15px"
					v-bind="tooltip"
				/>
			</template>
		</v-tooltip>
		<v-icon
			size="200"
			style="
				position: absolute;
				right: -20px;
				bottom: -25px;
				z-index: -1;
				opacity: 0.2;
			"
			:icon="`mdi-${challenge.category.icon}`"
		/>
		<ChallengeDialog v-model="dialog" :challenge="challenge" />
	</v-card>
</template>

<script setup lang="ts">
import ChallengeDialog from "@/components/modals/ChallengeDialog.vue";
import type { Challenge } from "@/types/challenge";

const dialog = ref(false);
interface Props {
	challenge: Challenge;
}

const props = withDefaults(defineProps<Props>(), {
	challenge: null,
});
</script>

<style scoped lang="scss">
.challenge-card {
	width: 275px;
	height: 150px;
}
.container {
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}
</style>
