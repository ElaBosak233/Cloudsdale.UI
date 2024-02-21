<template>
	<div>
		<v-sheet
			:height="200"
			min-width="100%"
			color="blue-darken-2"
			class="d-flex justify-center align-center no-select"
			style="z-index: -1; background-size: cover"
		>
			<div class="text-h4">{{ user.nickname }}</div>
			<v-chip size="large" :label="true" class="font-weight-bold mx-2">
				#{{ user.username }}
			</v-chip>
		</v-sheet>
		<div style="padding: 3% 25%">
			<div class="d-flex align-center">
				<div class="flex-1-1">
					<div class="d-flex">
						<v-text-field
							v-model="user.username"
							:readonly="true"
							label="用户名（只读）"
							prepend-icon="mdi-account"
						></v-text-field>
						<v-text-field
							v-model="user.nickname"
							label="昵称"
							prepend-icon="mdi-duck"
							class="ml-2"
						></v-text-field>
					</div>
					<div class="d-flex">
						<v-text-field
							v-model="user.email"
							label="邮箱"
							prepend-icon="mdi-email"
						></v-text-field>
					</div>
				</div>
				<div class="d-flex flex-column">
					<IAvatar :user-id="authStore.id" :size="90" class="mx-5" />
					<AvatarArea :item="user" />
				</div>
			</div>
			<div class="d-flex">
				<v-text-field
					v-model="password"
					label="密码（若需修改密码）"
					prepend-icon="mdi-lock"
					type="password"
				></v-text-field>
			</div>
			<div v-if="password" class="d-flex">
				<v-text-field
					v-model="passwordConfirm"
					label="确认密码"
					prepend-icon="mdi-lock"
					type="password"
				></v-text-field>
			</div>
			<div class="d-flex justify-end">
				<v-btn
					variant="flat"
					color="primary"
					class="mx-1"
					@click="saveUser()"
				>
					<span>保存</span>
				</v-btn>
			</div>
		</div>
		<CornerIcon icon="mdi-account" />
	</div>
</template>

<script setup lang="ts">
import { useConfigStore } from "~/store/config";
import { useAuthStore } from "~/store/auth";
import CornerIcon from "@/components/CornerIcon.vue";
import type { User } from "@/utils";
import AvatarArea from "@/components/user/settings/AvatarArea.vue";
import IAvatar from "@/components/avatar/IAvatar.vue";
import { useSnackBarStore } from "~/store/snackBar";

const configStore = useConfigStore();
const authStore = useAuthStore();
const snackBarStore = useSnackBarStore();

const user = ref({} as User);
const password = ref("");
const passwordConfirm = ref("");

onMounted(async () => {
	await getUser();
});

async function getUser() {
	interface Response {
		code: number;
		data: Array<User>;
	}
	const { data: res } = await useAuthFetch(`/users/?id=${authStore.id}`);
	const resObj = res.value as Response;
	if (resObj.code === 200) {
		user.value = resObj.data[0];
	}
}

async function saveUser() {
	if (password.value !== passwordConfirm.value) {
		snackBarStore.showSnackbar("密码不一致", "error");
		return;
	}
	interface Response {
		code: number;
		msg: string;
	}
	const { data: res } = await useAuthFetch(`/users/`, {
		method: "PUT",
		body: {
			id: authStore.id,
			nickname: user.value.nickname,
			email: user.value.email,
			password: password.value,
		},
	});
	const resObj = res.value as Response;
	if (resObj.code === 200) {
		snackBarStore.showSnackbar("保存成功", "success");
	} else {
		snackBarStore.showSnackbar("保存失败\n" + resObj.msg, "error");
	}
}

useHead({
	title: `用户设置 - ${configStore.pltCfg.site.title}`,
});
</script>
