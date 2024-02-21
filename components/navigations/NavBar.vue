<template>
	<v-app-bar color="primary" :elevation="0" class="no-select">
		<v-app-bar-title class="pl-2">
			<v-chip
				class="font-weight-bold"
				:ripple="false"
				size="large"
				variant="text"
				@click="$router.push('/')"
			>
				<img
					src="/favicon.ico"
					width="30"
					alt="logo"
					draggable="false"
				/>
				<span class="mx-2">{{ configStore.pltCfg.site.title }}</span>
			</v-chip>
		</v-app-bar-title>
		<v-toolbar-items>
			<v-btn prepend-icon="mdi-gamepad" to="/challenges" :active="false">
				练习场
			</v-btn>
			<v-btn prepend-icon="mdi-flag" to="/games" :active="false">
				比赛
			</v-btn>
			<v-btn
				prepend-icon="mdi-file-document"
				to="/articles"
				:active="false"
			>
				文章
			</v-btn>
			<v-btn
				prepend-icon="mdi-account-multiple"
				to="/teams"
				:active="false"
			>
				团队
			</v-btn>
		</v-toolbar-items>
		<v-btn
			v-if="authStore.user.level <= 2 && authStore.user.level != 0"
			icon
			to="/admin"
			:active="false"
		>
			<v-icon icon="mdi-hammer-wrench" />
			<v-tooltip activator="parent" location="bottom center"
				>管理</v-tooltip
			>
		</v-btn>
		<v-menu
			v-if="authStore?.pgsToken"
			min-width="200px"
			rounded
			:close-on-content-click="false"
		>
			<template #activator="{ props }">
				<v-btn icon v-bind="props">
					<v-icon icon="mdi-account-circle" />
				</v-btn>
			</template>
			<v-card class="no-select rounded-lg">
				<v-card
					class="mx-auto d-flex justify-center align-center mt-2 py-4"
					elevation="0"
					@click="$router.push(`/user/${authStore.user.id}`)"
				>
					<div class="mx-2">
						<IAvatar :size="40" :user-id="authStore?.user.id" />
					</div>
					<v-chip :label="true" color="primary">
						<span
							style="
								max-width: 100px;
								white-space: nowrap;
								text-overflow: ellipsis;
								overflow: hidden;
								font-size: 0.85rem;
							"
							>{{ authStore?.user.nickname }}</span
						>
					</v-chip>
				</v-card>
				<v-divider />
				<div class="mx-auto text-center px-3 py-2">
					<div class="d-flex justify-center">
						<v-btn
							rounded
							variant="text"
							class="mx-2"
							prepend-icon="mdi-cog"
							color="blue-darken-3"
							@click="$router.push('/user/settings')"
						>
							设置
						</v-btn>
						<v-btn
							rounded
							variant="text"
							class="mx-2"
							prepend-icon="mdi-logout"
							color="error"
							@click="
								authStore.logout();
								$router.push('/');
							"
						>
							退出
						</v-btn>
					</div>
				</div>
			</v-card>
		</v-menu>
		<v-btn v-if="!authStore?.pgsToken" icon to="/login" :active="false">
			<v-icon icon="mdi-account-circle" />
		</v-btn>
	</v-app-bar>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/store/auth";
import { useConfigStore } from "@/store/config";
import IAvatar from "@/components/images/IAvatar.vue";
const authStore = useAuthStore();
const configStore = useConfigStore();
</script>

<style scoped lang="scss"></style>
