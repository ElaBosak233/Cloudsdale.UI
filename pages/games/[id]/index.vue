<template>
	<div>
		<v-sheet
			:height="350"
			min-width="100%"
			color="teal-darken-1"
			class="d-flex justify-center align-center"
			style="z-index: -1; background-size: cover"
		>
			<div
				class="d-flex justify-center align-center no-select"
				style="min-width: 100%"
			>
				<div>
					<GameCover
						:width="400"
						:height="(400 * 16) / 9"
						:game-id="Number(useRoute().params.id)"
						class="rounded-lg"
						max-height="250"
					/>
				</div>
				<div class="ml-5" style="width: 30%">
					<div class="d-flex ma-2">
						<v-chip class="ma-1"
							>{{
								game.member_limit_min === 1 &&
								game.member_limit_max == 1
									? "单"
									: "多"
							}}人赛</v-chip
						>
						<v-chip class="ma-1"
							>{{
								Math.floor(
									(new Date(game.ended_at).getTime() -
										new Date(game.started_at).getTime()) /
										3600000
								)
							}}
							小时</v-chip
						>
					</div>
					<p class="text-h4 font-weight-bold">{{ game.title }}</p>
					<p class="text-caption">13 支队伍已报名</p>
					<div class="d-flex justify-space-between mt-2">
						<div>
							<p class="text-caption">开始时间</p>
							<p class="font-weight-bold">
								{{ new Date(game.started_at).toLocaleString() }}
							</p>
						</div>
						<div>
							<p class="text-caption">结束时间</p>
							<p class="font-weight-bold">
								{{ new Date(game.ended_at).toLocaleString() }}
							</p>
						</div>
					</div>
					<v-progress-linear
						:model-value="getProgress()"
						color="teal-lighten-3"
						height="10"
						:rounded="true"
						:striped="true"
					></v-progress-linear>
					<div class="d-flex mt-4">
						<v-btn
							color="teal"
							prepend-icon="mdi-account-check"
							variant="flat"
						>
							申请参赛
						</v-btn>
						<v-btn
							color="teal"
							class="ml-2"
							prepend-icon="mdi-clipboard-list-outline"
							variant="flat"
						>
							查看榜单
						</v-btn>
						<v-btn
							color="teal"
							class="ml-2"
							prepend-icon="mdi-flag"
							variant="flat"
							@click="
								$router.push(
									`/games/${$route.params.id}/challenges`
								)
							"
						>
							进入赛场
						</v-btn>
					</div>
				</div>
			</div>
		</v-sheet>
		<div class="d-flex justify-center">
			<v-sheet class="pt-5" width="50%">
				<Markdown :content="game.description" />
			</v-sheet>
		</div>
	</div>
</template>

<script setup lang="ts">
import GameCover from "@/components/avatar/GameCover.vue";
import { useConfigStore } from "~/store/config";
import Markdown from "@/components/utils/Markdown.vue";

const configStore = useConfigStore();

const game = ref({} as Game);

onMounted(async () => {
	await loadGameInfo();
	useHead({
		title: `${game.value.title} - ${configStore.pltCfg.site.title}`,
	});
});

function getProgress() {
	const now = new Date().getTime();
	const passed = now - new Date(game.value.started_at).getTime();
	return (
		(passed /
			(new Date(game.value.ended_at).getTime() -
				new Date(game.value.started_at).getTime())) *
		100
	);
}

async function loadGameInfo() {
	interface Response {
		code: number;
		data: Array<Game>;
	}
	const { data: res } = await useAuthFetch(
		`/games/?id=${useRoute().params.id}`,
		{
			method: "GET",
		}
	);
	const resObj = res.value as Response;
	if (resObj.code === 200 && resObj.data) {
		game.value = resObj.data[0];
	}
}
</script>
