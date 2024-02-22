<template>
	<v-list-item base-color="teal" @click="dialog = true">
		<v-icon icon="mdi-play-circle" />
		<v-tooltip activator="parent" location="top center"> 预览 </v-tooltip>
	</v-list-item>
	<ChallengeDialog v-model="dialog" :challenge="item" />
</template>

<script setup lang="ts">
import ChallengeDialog from "@/components/modals/ChallengeDialog.vue";
import type { Challenge } from "@/types/challenge";

interface Props {
	item: Challenge;
}
defineProps<Props>();

const dialog = ref(false);
</script>
