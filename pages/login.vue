<template>
	<div>
		<v-sheet
			:height="200"
			min-width="100%"
			color="teal-darken-1"
			class="d-flex justify-center align-center"
			style="z-index: -1; background-size: cover"
		>
			<div class="text-h4">登录</div>
		</v-sheet>
		<div
			class="d-flex justify-center h-auto"
			style="padding-top: 5%; padding-bottom: 5%"
		>
			<v-sheet width="400" class="mx-auto" color="transparent">
				<v-divider class="mb-5" />
				<v-form
					:fast-fail="true"
					@submit.prevent="authStore.login(username, password)"
				>
					<v-text-field
						v-model="username"
						prepend-inner-icon="mdi-account"
						label="用户名"
					></v-text-field>
					<v-text-field
						v-model="password"
						prepend-inner-icon="mdi-pound"
						label="密码"
						:clearable="true"
						type="password"
					></v-text-field>
					<v-btn
						type="submit"
						size="large"
						color="blue-darken-3"
						:block="true"
						class="mt-2"
						>登录</v-btn
					>
				</v-form>
			</v-sheet>
		</div>
		<CornerIcon icon="mdi-login" />
	</div>
</template>
<script setup lang="ts">
import { useAuthStore } from "@/store/auth";
import CornerIcon from "@/components/CornerIcon.vue";

const authStore = useAuthStore();
const username = ref("");
const password = ref("");
</script>
