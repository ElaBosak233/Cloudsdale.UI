<template>
	<div>
		<v-sheet
			:height="200"
			min-width="100%"
			color="blue-darken-2"
			class="d-flex justify-center align-center"
			style="z-index: -1; background-size: cover"
		>
			<div class="text-h4">比赛</div>
		</v-sheet>
		<div>
			<div style="padding: 3% 10%">
				<div class="d-flex justify-center">
					<v-tabs direction="vertical" style="min-width: 200px">
						<v-tab color="blue" @click="console.log('all')">
							<v-icon :start="true" icon="mdi-flag" />
							所有比赛
						</v-tab>
						<v-tab color="indigo">
							<v-icon :start="true" icon="mdi-earth" />
							公开赛
						</v-tab>
						<v-tab color="teal">
							<v-icon :start="true" icon="mdi-account-lock" />
							内部赛
						</v-tab>
						<v-tab color="teal">
							<v-icon :start="true" icon="mdi-clock-fast" />
							正在进行
						</v-tab>
						<v-tab color="teal">
							<v-icon :start="true" icon="mdi-flag-checkered" />
							已结束
						</v-tab>
						<v-tab color="teal">
							<v-icon :start="true" icon="mdi-calendar-clock" />
							待开始
						</v-tab>
					</v-tabs>
					<v-divider :vertical="true" />
					<div style="padding-left: 50px; width: 65%">
						<div v-for="game in gameStore.games" :key="game.id">
							<GameCard
								:item="game"
								class="my-3"
								@click="$router.push(`/games/${game.id}`)"
							/>
						</div>
						<v-pagination class="my-4" :length="2"></v-pagination>
					</div>
				</div>
			</div>
		</div>
		<CornerIcon icon="mdi-flag" />
	</div>
</template>

<script setup lang="ts">
import GameCard from "@/components/games/GameCard.vue";
import { useGameStore } from "~/store/game";
import { useConfigStore } from "~/store/config";
import CornerIcon from "@/components/CornerIcon.vue";
const configStore = useConfigStore();
const gameStore = useGameStore();

gameStore.loadGames(1, "");

useHead({
	title: `比赛 - ${configStore.pltCfg.site.title}`,
});
</script>
