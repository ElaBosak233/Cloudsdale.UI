<template>
	<v-img
		:width="width"
		:height="height"
		:draggable="false"
		:cover="true"
		:src="gameStore.gameCover[gameId]"
	/>
</template>

<script setup lang="ts">
import { useGameStore } from "@/store/game";

interface Props {
	gameId: number;
	width: number | string | undefined;
	height: number | string | undefined;
}
const props = defineProps<Props>();

const gameStore = useGameStore();

gameStore.getGameCover(props.gameId);
</script>
