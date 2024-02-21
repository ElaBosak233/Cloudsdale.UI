<template>
	<v-dialog width="600">
		<v-card min-height="300" class="pa-5">
			<div class="d-flex justify-space-between">
				<div class="d-flex">
					<v-icon
						:color="challenge.category.color"
						:icon="`mdi-${challenge.category.icon}`"
					/>
					<div
						class="font-weight-bold ml-2"
						style="
							width: 20rem;
							white-space: nowrap;
							text-overflow: ellipsis;
							overflow: hidden;
						"
					>
						{{ challenge.title }}
					</div>
				</div>
				<div class="d-flex">
					<v-tooltip
						v-if="challenge.submissions?.length > 0"
						location="top"
					>
						<template #activator="{ props: p }">
							<v-icon
								v-bind="p"
								icon="mdi-hexagon-slice-6"
								color="#fcc419"
							></v-icon>
						</template>
						一血：{{ challenge.submissions[0].user.nickname }}
					</v-tooltip>
					<v-tooltip
						v-if="challenge.submissions?.length > 1"
						location="top"
					>
						<template #activator="{ props: p }">
							<v-icon
								v-bind="p"
								icon="mdi-hexagon-slice-4"
								color="#a6a6a6"
							></v-icon>
						</template>
						二血：{{ challenge.submissions[1].user.nickname }}
					</v-tooltip>
					<v-tooltip
						v-if="challenge.submissions?.length > 2"
						location="top"
					>
						<template #activator="{ props: p }">
							<v-icon
								v-bind="p"
								icon="mdi-hexagon-slice-2"
								color="#f98539"
							></v-icon>
						</template>
						三血：{{ challenge.submissions[2].user.nickname }}
					</v-tooltip>
				</div>
			</div>
			<v-divider class="my-3" />
			<div class="d-flex justify-space-between">
				<div class="description flex-1-0">
					<Markdown :content="challenge.description" />
				</div>
				<div>
					<v-list-item
						v-if="challenge.has_attachment"
						variant="tonal"
						:nav="true"
						:base-color="challenge.category.color"
						class="d-flex align-center justify-center"
						@click="downloadAttachment()"
					>
						<v-icon icon="mdi-download" />
						<v-tooltip activator="parent" location="bottom center"
							>下载附件</v-tooltip
						>
					</v-list-item>
				</div>
			</div>
			<v-spacer class="my-5" />
			<div v-if="challenge.is_dynamic">
				<v-list lines="two">
					<v-list-item v-for="i in instances?.length" :key="i">
						<template #title>
							<v-icon icon="mdi-package-variant-closed"></v-icon>
							<span class="mx-2">容器 {{ i }}</span>
						</template>
						<div
							v-for="nat in instances[i - 1]?.nats"
							:key="nat.id"
						>
							<v-text-field
								v-model="nat.entry"
								prepend-inner-icon="mdi-server-network"
								hide-details
								density="compact"
								placeholder="容器实例地址"
								:single-line="true"
								:readonly="true"
								variant="solo-filled"
								:flat="true"
								class="my-1"
							>
								{{ nat.src_port }} →&nbsp;
								<template v-if="nat.entry" #append-inner>
									<v-tooltip
										location="top center"
										text="打开"
									>
										<template #activator="{ props: prop }">
											<v-icon
												icon="mdi-open-in-new"
												v-bind="prop"
												@click="redirectTo(nat.entry)"
											></v-icon>
										</template>
									</v-tooltip>
								</template>
							</v-text-field>
						</div>
					</v-list-item>
				</v-list>
				<div class="d-flex justify-space-between align-end my-3">
					<div>
						<div class="font-weight-bold text-caption">
							本题为动态容器题目，解题需开启容器实例
						</div>
						<div
							v-if="!podRunning"
							class="font-weight-thin text-caption"
						>
							本题容器时间 {{ challenge.duration }}s
						</div>
						<div
							v-if="podRunning"
							class="font-weight-thin text-caption"
						>
							本题容器剩余时间 {{ timeLeft }}s
						</div>
					</div>
					<div class="d-flex">
						<v-btn
							v-show="podRunning"
							:disabled="podRemovePending"
							:loading="podRenewPending"
							color="blue"
							variant="flat"
							class="ml-2"
							@click="renewPod()"
						>
							<span class="font-weight-bold">延长时间</span>
						</v-btn>
						<v-btn
							v-show="podRunning"
							color="red-darken-2"
							variant="flat"
							class="ml-2"
							:loading="podRemovePending"
							@click="removePod()"
						>
							<span class="font-weight-bold">销毁实例</span>
						</v-btn>
						<v-btn
							v-show="!podRunning"
							:color="challenge.category.color"
							variant="flat"
							class="ml-2"
							:loading="podCreatePending"
							@click="createPod()"
						>
							<span class="font-weight-bold">开启实例</span>
						</v-btn>
					</div>
				</div>
			</div>
			<v-divider class="my-3" />
			<div class="d-flex align-center">
				<v-text-field
					v-model="flag"
					prepend-inner-icon="mdi-flag"
					hide-details
					density="compact"
					placeholder="Flag"
					:clearable="true"
				/>
				<v-btn
					:color="challenge.category.color"
					variant="flat"
					class="ml-2"
					@click="submit()"
				>
					<span class="font-weight-bold">提交</span>
				</v-btn>
			</div>
		</v-card>
	</v-dialog>
</template>

<script setup lang="ts">
import { saveAs } from "file-saver";
import Markdown from "@/components/utils/Markdown.vue";
import { createSubmission } from "@/api/submission";
import {
	createPod as createPodApi,
	removePod as removePodApi,
	renewPod as renewPodApi,
	getPod as getPodApi,
} from "@/api/pod";
import { useSnackBarStore } from "@/store/snackBar";
import { usePodStore } from "@/store/pod";
import { useChallengeStore } from "@/store/challenge";
import type { Challenge } from "@/types/challenge";
import type { PodCreateResponse, PodRenewResponse } from "@/types/pod";
import {
	getChallengeAttachment,
	getChallengeAttachmentInfo,
} from "@/api/media";
import { ref, watch } from "vue";

const snackBarStore = useSnackBarStore();
const podStore = usePodStore();
const challengeStore = useChallengeStore();

interface Props {
	challenge: Challenge;
}
const props = defineProps<Props>();

const podRunning = ref(false);
const podRemovePending = ref(false);
const podCreatePending = ref(false);
const podRenewPending = ref(false);
const podID = ref(0);
const podRemovedAt = ref(0);

const instances = ref(Array<any>());

const timeLeft = ref(0);

const flag = ref("");

watch(podStore.existPods, () => {
	if (props.challenge.id in podStore.existPods) {
		podRunning.value = true;
		podID.value = podStore.existPods[props.challenge.id]?.id;
		instances.value = podStore.existPods[props.challenge.id]?.instances;
		podRemovedAt.value = podStore.existPods[props.challenge.id]?.removed_at;
	}
});

function redirectTo(url: string) {
	window.open(`http://${url}`, "_blank");
}

async function submit() {
	const response = await createSubmission({
		challenge_id: props.challenge.id,
		flag: flag.value,
		team_id: null,
		game_id: null,
	});
	if (response?.code === 200) {
		if (response?.status === 1) {
			snackBarStore.warning("答案错误");
		} else if (response?.status === 2) {
			for (let i = 0; i < challengeStore.challenges.length; i++) {
				if (challengeStore.challenges[i].id === props.challenge.id) {
					challengeStore.challenges[i].is_solved = true;
				}
			}
			snackBarStore.success("答案正确");
			flag.value = "";
			challengeStore.refreshChallenges();
		} else if (response?.status === 3) {
			snackBarStore.error("作弊");
		} else if (response?.status === 4) {
			for (let i = 0; i < challengeStore.challenges.length; i++) {
				if (challengeStore.challenges[i].id === props.challenge.id) {
					challengeStore.challenges[i].is_solved = true;
				}
			}
			snackBarStore.info("你已经做出过这道题了");
			flag.value = "";
		}
	} else {
		snackBarStore.error(response.msg);
	}
}

async function createPod() {
	podCreatePending.value = true;
	const { pending, data: res } = await createPodApi({
		challenge_id: props.challenge.id,
	});
	podCreatePending.value = pending.value;
	watch(pending, (newVal) => {
		podCreatePending.value = newVal;
	});
	const resObj = res.value as PodCreateResponse;
	if (resObj?.code === 200) {
		podID.value = resObj?.id;
		instances.value = resObj?.instances;
		podRemovedAt.value = resObj?.removed_at;
		podRunning.value = true;
		snackBarStore.success("容器实例已开启");
	} else {
		snackBarStore.error("容器实例开启失败\n" + resObj?.msg);
	}
}

async function removePod() {
	podRemovePending.value = true;
	const instanceStatus = await getPodById();
	if (instanceStatus === "running") {
		interface Response {
			code: number;
			msg: string;
		}
		const { pending, data: res } = await removePodApi({
			id: podID.value,
		});
		podRemovePending.value = pending.value;
		watch(pending, (newVal) => {
			podRemovePending.value = newVal;
		});
		const resObj = res.value as Response;
		if (resObj?.code === 200) {
			podRunning.value = false;
			instances.value = [];
			snackBarStore.success("容器实例移除成功");
		} else {
			snackBarStore.error("容器实例移除失败\n" + resObj?.msg);
		}
	} else {
		podRemovePending.value = false;
		podRunning.value = false;
		instances.value = [];
		snackBarStore.warning("容器实例已被移除");
	}
}

async function renewPod() {
	podRenewPending.value = true;
	const instanceStatus = await getPodById();
	if (instanceStatus === "running") {
		const { pending, data: res } = await renewPodApi({
			id: podID.value,
		});
		const resObj = res.value as PodRenewResponse;
		podRenewPending.value = pending.value;
		watch(pending, (newVal) => {
			podRenewPending.value = newVal;
		});
		if (resObj?.code === 200) {
			podRemovedAt.value = resObj?.removed_at;
			snackBarStore.success("容器实例续期成功");
		} else {
			snackBarStore.error("容器实例续期失败\n" + resObj?.msg);
		}
	} else {
		podRenewPending.value = false;
		podRunning.value = false;
		snackBarStore.warning("容器实例已被移除，无法续期");
	}
}

async function getPodById() {
	const response = await getPodApi(`id=${podID.value}`);
	if (response?.code === 200) {
		if (response?.data[0]?.status === "running") {
			podRunning.value = true;
			return "running";
		} else if (response?.data[0]?.status === "removed") {
			podRunning.value = false;
			return "removed";
		}
	}
}

async function downloadAttachment() {
	const info = await getChallengeAttachmentInfo(props.challenge.id);
	if (info.code === 200) {
		const b = await getChallengeAttachment(props.challenge.id);
		const blob = new Blob([b as BlobPart], {
			type: "application/octet-stream",
		});
		saveAs(blob, info.file_name);
	} else {
		snackBarStore.error("附件获取失败，请检查附件是否存在");
	}
}

function updateTime() {
	const timeNow = new Date().getTime();
	timeLeft.value = Math.round(podRemovedAt.value - timeNow / 1000);
	if (timeLeft.value <= 0) {
		podRunning.value = false;
	}
}

updateTime();
setInterval(updateTime, 1000);
</script>
