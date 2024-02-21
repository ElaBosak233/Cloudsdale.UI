<template>
	<div>
		<v-sheet
			:height="150"
			min-width="100%"
			color="teal-darken-1"
			class="d-flex justify-center align-center"
			style="z-index: -1; background-size: cover"
		>
			<div
				class="d-flex justify-center no-select"
				style="min-width: 100%"
			>
				<div class="text-h4 font-weight-bold">
					第六届浙江省大学生网络与信息安全竞赛初赛
				</div>
			</div>
		</v-sheet>
		<div>
			<div style="padding: 3% 5%" class="d-flex justify-center">
				<div class="d-flex">
					<div>
						<div class="d-flex justify-center">
							<v-btn
								prepend-icon="mdi-cloud-upload"
								variant="flat"
								color="blue-darken-3"
							>
								提交 Write Up
							</v-btn>
						</div>
						<v-divider class="ma-2" />
						<v-tabs direction="vertical" style="min-width: 200px">
							<v-tab color="blue" @click="console.log('all')">
								<v-icon
									:start="true"
									icon="mdi-book-multiple"
								/>
								All
							</v-tab>
							<v-tab :color="configStore.categoryColors['misc']">
								<v-icon
									:start="true"
									:icon="configStore.categoryIcons['misc']"
								/>
								Misc
							</v-tab>
							<v-tab :color="configStore.categoryColors['web']">
								<v-icon
									:start="true"
									:icon="configStore.categoryIcons['web']"
								/>
								Web
							</v-tab>
							<v-tab
								:color="configStore.categoryColors['reverse']"
							>
								<v-icon
									:start="true"
									:icon="configStore.categoryIcons['reverse']"
								/>
								Reverse
							</v-tab>
							<v-tab
								:color="configStore.categoryColors['crypto']"
							>
								<v-icon
									:start="true"
									:icon="configStore.categoryIcons['crypto']"
								/>
								Crypto
							</v-tab>
							<v-tab :color="configStore.categoryColors['pwn']">
								<v-icon
									:start="true"
									:icon="configStore.categoryIcons['pwn']"
								/>
								Pwn
							</v-tab>
						</v-tabs>
					</div>
					<v-divider :vertical="true" />
					<div>
						<div
							class="d-flex flex-wrap"
							style="
								margin-left: 25px;
								margin-right: 25px;
								width: 55rem;
							"
						>
							<ChallengeCard
								title="ezphp"
								category="web"
								pts="200"
								solved-times="1"
								class="ma-2 pa-2"
								solved
							/>
							<ChallengeCard
								title="ezphp"
								category="web"
								pts="200"
								solved-times="1"
								class="ma-2 pa-2"
								solved
							/>
							<ChallengeCard
								title="ezphp"
								category="web"
								pts="200"
								solved-times="1"
								class="ma-2 pa-2"
								solved
							/>
							<ChallengeCard
								title="ezphp"
								category="web"
								pts="200"
								solved-times="1"
								class="ma-2 pa-2"
								solved
							/>
							<ChallengeCard
								title="ezphp"
								category="web"
								pts="200"
								solved-times="1"
								class="ma-2 pa-2"
								solved
							/>
							<ChallengeCard
								title="ezphp"
								category="web"
								pts="200"
								solved-times="1"
								class="ma-2 pa-2"
								solved
							/>
							<ChallengeCard
								title="ezphp"
								category="web"
								pts="200"
								solved-times="1"
								class="ma-2 pa-2"
								solved
							/>
							<ChallengeCard
								title="ezphp"
								category="web"
								pts="200"
								solved-times="1"
								class="ma-2 pa-2"
								solved
							/>
							<ChallengeCard
								title="ezphp"
								category="web"
								pts="200"
								solved-times="1"
								class="ma-2 pa-2"
								solved
							/>
						</div>
						<v-pagination class="mt-12" :length="5"></v-pagination>
					</div>
					<v-divider :vertical="true" />
					<div style="padding-left: 45px">
						<TeamInfoCard />
						<NotificationCard class="my-5" />
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useConfigStore } from "~/store/config";
import TeamInfoCard from "@/components/games/TeamInfoCard.vue";
import ChallengeCard from "@/components/challenges/ChallengeCard.vue";
import NotificationCard from "@/components/games/NotificationCard.vue";
const configStore = useConfigStore();
</script>

<style lang="scss"></style>
