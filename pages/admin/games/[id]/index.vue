<template>
	<div class="d-flex justify-center align-center py-10">
		<v-sheet
			elevation="10"
			class="pa-10"
			rounded="lg"
			style="min-width: 90%; max-width: 90%; min-height: 85vh"
		>
			<NavBar :title="game.title" />
			<v-card variant="flat" class="mt-5">
				<div class="mx-10 d-flex justify-space-between">
					<div class="flex-1-1">
						<v-text-field
							v-model="game.title"
							label="标题"
							prepend-icon="mdi-format-title"
						></v-text-field>
						<v-textarea
							v-model="game.bio"
							label="简述"
							prepend-icon="mdi-lightbulb"
						></v-textarea>
						<v-textarea
							v-model="game.description"
							label="详情描述"
							prepend-icon="mdi-lifebuoy"
						></v-textarea>
						<div class="d-flex">
							<v-text-field
								v-model.number="game.member_limit_min"
								density="comfortable"
								label="团队所需最少人数"
								prepend-icon="mdi-account-multiple"
								type="number"
							></v-text-field>
							<v-text-field
								v-model.number="game.member_limit_max"
								density="comfortable"
								label="团队所需最大人数"
								prepend-icon="mdi-account-multiple"
								type="number"
								class="ml-2"
							></v-text-field>
							<v-text-field
								v-model.number="game.parallel_container_limit"
								density="comfortable"
								label="团队并行容器数"
								prepend-icon="mdi-road-variant"
								type="number"
								class="ml-2"
							></v-text-field>
						</div>
						<div class="d-flex">
							<v-text-field
								v-model.number="game.first_blood_reward_ratio"
								density="comfortable"
								label="一血奖励（%）"
								type="number"
							>
								<template #prepend>
									<v-icon
										color="#fcc419"
										icon="mdi-hexagon-slice-6"
									></v-icon>
								</template>
							</v-text-field>
							<v-text-field
								v-model.number="game.second_blood_reward_ratio"
								density="comfortable"
								label="二血奖励（%）"
								type="number"
								class="ml-2"
							>
								<template #prepend>
									<v-icon
										color="##a6a6a6"
										icon="mdi-hexagon-slice-4"
									></v-icon>
								</template>
							</v-text-field>
							<v-text-field
								v-model.number="game.third_blood_reward_ratio"
								density="comfortable"
								label="三血奖励（%）"
								type="number"
								class="ml-2"
							>
								<template #prepend>
									<v-icon
										color="#f98539"
										icon="mdi-hexagon-slice-2"
									></v-icon>
								</template>
							</v-text-field>
						</div>
					</div>
					<div class="mx-10" style="min-width: 50vh; max-width: 50vh">
						<GameCover
							:width="500"
							:height="(500 / 16) * 9"
							:game-id="Number(useRoute().params.id)"
							class="rounded"
						/>
						<v-btn
							variant="tonal"
							:block="true"
							:flat="true"
							color="primary"
							class="mt-2"
							>管理封面</v-btn
						>
						<div class="d-flex justify-space-between">
							<v-switch
								v-model="game.is_public"
								color="primary"
								label="是否为公开赛"
								:inline="true"
								:hide-details="true"
								:flat="true"
							></v-switch>
							<v-switch
								v-model="game.is_need_write_up"
								color="primary"
								label="是否需要 WP"
								:inline="true"
								:hide-details="true"
								:flat="true"
								class="ml-2"
							></v-switch>
							<v-switch
								v-model="game.is_enabled"
								color="primary"
								label="是否启用比赛"
								:inline="true"
								:hide-details="true"
								:flat="true"
								class="ml-2"
							></v-switch>
						</div>
						<v-text-field
							v-if="!game.is_public"
							v-model="game.password"
							label="密码（若为内部赛）"
							prepend-icon="mdi-lock"
							density="comfortable"
							type="password"
							class="mt-5"
						></v-text-field>
						<div class="text-caption">开始时间</div>
						<VueDatePicker
							v-model="game.started_at"
							locale="zh-CN"
							:auto-apply="true"
							:enable-seconds="true"
							:partial-flow="true"
							:flow="['calendar', 'time']"
						>
						</VueDatePicker>
						<div class="mt-2 text-caption">结束时间</div>
						<VueDatePicker
							v-model="game.ended_at"
							locale="zh-CN"
							:auto-apply="true"
							:enable-seconds="true"
							:partial-flow="true"
							:flow="['calendar', 'time']"
						>
						</VueDatePicker>
					</div>
				</div>
			</v-card>
			<div class="mt-10 d-flex justify-end">
				<v-btn variant="flat" color="primary" @click="saveGame()">
					<span>保存</span>
				</v-btn>
			</div>
		</v-sheet>
	</div>
</template>

<script setup lang="ts">
import VueDatePicker from "@vuepic/vue-datepicker";
import { useConfigStore } from "~/store/config";
import { useGameStore } from "~/store/game";
import { useSnackBarStore } from "~/store/snackBar";
import GameCover from "@/components/avatar/GameCover.vue";
import NavBar from "@/components/admin/games/NavBar.vue";

const configStore = useConfigStore();
const gameStore = useGameStore();
const snackBarStore = useSnackBarStore();

const game = ref({} as Game);

definePageMeta({
	layout: "admin",
});

onMounted(async () => {
	await loadGameInfo();
	useHead({
		title: `${game.value.title} - 比赛管理 - ${configStore.pltCfg.site.title}`,
	});
});

async function loadGameInfo() {
	interface Response {
		code: number;
		data: Array<Game>;
	}
	const { data: res } = await useAuthFetch(
		`/games/?is_enabled=-1&id=${useRoute().params.id}`,
		{
			method: "GET",
		}
	);
	const resObj = res.value as Response;
	if (resObj.code === 200 && resObj.data) {
		game.value = resObj.data[0];
	}
}

async function saveGame() {
	interface Response {
		code: number;
		msg: string;
	}
	const gameBody = useCloneDeep(game.value);
	gameBody.started_at = Math.floor(
		new Date(game.value.started_at).getTime() / 1000
	);
	gameBody.ended_at = Math.floor(
		new Date(game.value.ended_at).getTime() / 1000
	);
	const { data: res } = await useAuthFetch(`/games/`, {
		method: "PUT",
		body: gameBody,
	});
	const resObj = res.value as Response;
	if (resObj.code === 200) {
		snackBarStore.showSnackbar("保存成功", "success");
	} else {
		snackBarStore.showSnackbar("保存失败\n" + resObj.msg, "error");
	}
}
</script>
