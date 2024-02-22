<template>
	<v-dialog width="100vh" :persistent="true">
		<v-card class="pa-8">
			<div class="d-flex justify-between align-center">
				<v-icon
					:icon="
						challengeStore.challengeEditor.type === 'edit'
							? 'mdi-book-edit'
							: 'mdi-book-plus'
					"
					size="35"
					color="primary"
				></v-icon>
				<v-chip :label="true" class="mx-2" color="primary">
					<span
						v-if="challengeStore.challengeEditor.type === 'edit'"
						class="font-weight-bold text-h6"
					>
						题目编辑
					</span>
					<span
						v-if="challengeStore.challengeEditor.type === 'create'"
						class="font-weight-bold text-h6"
					>
						题目创建
					</span>
				</v-chip>
			</div>
			<div class="pt-5">
				<v-text-field
					v-model="challengeStore.challengeEditor.challenge.title"
					label="标题"
					prepend-icon="mdi-format-title"
					density="comfortable"
				></v-text-field>
				<div class="d-flex">
					<v-select
						v-model="
							challengeStore.challengeEditor.challenge.category
						"
						label="分类"
						:items="['misc', 'web', 'reverse', 'crypto', 'pwn']"
						prepend-icon="mdi-shape"
						density="comfortable"
					></v-select>
					<v-select
						v-model="
							challengeStore.challengeEditor.challenge.is_dynamic
						"
						label="类型"
						:items="types"
						item-title="label"
						item-value="value"
						class="pl-5"
						prepend-icon="mdi-shape"
						density="comfortable"
					></v-select>
				</div>
				<div class="d-flex">
					<v-switch
						v-model="
							challengeStore.challengeEditor.challenge
								.has_attachment
						"
						label="是否有附件"
						color="primary"
						prepend-icon="mdi-file-upload"
					></v-switch>
					<v-switch
						v-model="
							challengeStore.challengeEditor.challenge
								.is_practicable
						"
						label="练习场是否可见"
						color="primary"
						prepend-icon="mdi-eye"
					></v-switch>
					<v-input
						prepend-icon="mdi-lightbulb-variant"
						density="comfortable"
					>
						<v-sheet class="d-flex align-center" height="50">
							<v-rating
								v-model.number="
									challengeStore.challengeEditor.challenge
										.difficulty
								"
								:hover="true"
								:length="5"
								:size="25"
								active-color="blue-darken-3"
							/>
							<div style="color: grey" class="pl-2">难度</div>
						</v-sheet>
					</v-input>
					<v-text-field
						v-if="
							challengeStore.challengeEditor.challenge
								?.is_practicable
						"
						v-model.number="
							challengeStore.challengeEditor.challenge
								.practice_pts
						"
						label="练习场奖励分数"
						prepend-icon="mdi-gift"
						type="number"
						density="comfortable"
					></v-text-field>
				</div>
				<div class="d-flex">
					<v-textarea
						v-model="
							challengeStore.challengeEditor.challenge.description
						"
						label="描述"
						prepend-icon="mdi-lifebuoy"
					></v-textarea>
				</div>
				<v-text-field
					v-if="!challengeStore.challengeEditor.challenge?.is_dynamic"
					v-model="challengeStore.challengeEditor.challenge.flag"
					label="Flag"
					prepend-icon="mdi-flag"
					density="comfortable"
				></v-text-field>
				<div
					v-if="challengeStore.challengeEditor.challenge?.is_dynamic"
					class="d-flex"
				>
					<v-text-field
						v-model="
							challengeStore.challengeEditor.challenge.flag_env
						"
						label="Flag 环境变量名"
						prepend-icon="mdi-variable"
						density="comfortable"
					></v-text-field>
					<v-text-field
						v-model="
							challengeStore.challengeEditor.challenge.flag_fmt
						"
						label="Flag 格式"
						prepend-icon="mdi-flag"
						density="comfortable"
						class="pl-2"
					></v-text-field>
				</div>
				<div
					v-if="challengeStore.challengeEditor.challenge?.is_dynamic"
					class="d-flex"
				>
					<v-text-field
						v-model="challengeStore.challengeEditor.challenge.image"
						label="镜像名"
						prepend-icon="mdi-docker"
						density="comfortable"
					></v-text-field>
					<v-text-field
						v-model.number="
							challengeStore.challengeEditor.challenge
								.exposed_port
						"
						label="容器暴露端口号"
						prepend-icon="mdi-serial-port"
						density="comfortable"
						type="number"
						class="pl-2"
					></v-text-field>
				</div>
				<div
					v-if="challengeStore.challengeEditor.challenge?.is_dynamic"
					class="d-flex"
				>
					<v-text-field
						v-model.number="
							challengeStore.challengeEditor.challenge
								.memory_limit
						"
						label="内存限制（MB）"
						prepend-icon="mdi-memory"
						density="comfortable"
						type="number"
					></v-text-field>
					<v-text-field
						v-model.number="
							challengeStore.challengeEditor.challenge.cpu_limit
						"
						label="CPU限制（核）"
						prepend-icon="mdi-cpu-64-bit"
						density="comfortable"
						type="number"
						class="pl-2"
					></v-text-field>
					<v-text-field
						v-model.number="
							challengeStore.challengeEditor.challenge.duration
						"
						label="持续时间（秒）"
						prepend-icon="mdi-timer"
						density="comfortable"
						type="number"
						class="pl-2"
					></v-text-field>
				</div>
			</div>
			<div class="d-flex justify-end">
				<v-btn
					variant="flat"
					color="error"
					class="mx-1"
					@click="challengeStore.challengeEditor.dialog = false"
					>取消</v-btn
				>
				<v-btn
					variant="flat"
					color="primary"
					class="mx-1"
					@click="challengeStore.saveChallenge()"
				>
					<span v-if="challengeStore.challengeEditor.type === 'edit'"
						>保存</span
					>
					<span v-else>创建</span>
				</v-btn>
			</div>
		</v-card>
	</v-dialog>
</template>

<script setup lang="ts">
import { useChallengeStore } from "@/store/challenge";

const challengeStore = useChallengeStore();

const types = ref([
	{ label: "动态", value: true },
	{ label: "静态", value: false },
]);
</script>
