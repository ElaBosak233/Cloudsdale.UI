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
					<IAvatar
						:user-id="authStore?.user?.id"
						:size="90"
						class="mx-5"
					/>
					<v-btn
						color="primary"
						variant="tonal"
						density="comfortable"
						class="ma-2"
						@click="openDialog()"
					>
						管理头像
					</v-btn>
					<v-dialog
						v-model="dialog"
						min-width="50vh"
						max-width="50vh"
					>
						<v-card class="pa-5">
							<div class="d-flex justify-between align-center">
								<v-icon
									icon="mdi-image-edit"
									size="35"
									color="primary"
								></v-icon>
								<v-chip
									:label="true"
									class="mx-2"
									color="primary"
								>
									<span class="font-weight-bold text-h6"
										>头像管理</span
									>
								</v-chip>
							</div>
							<v-sheet class="d-flex justify-space-between mt-5">
								<div
									class="d-flex justify-center align-center pa-3"
								>
									<IAvatar :size="80" :user-id="user.id" />
								</div>
								<v-sheet class="flex-1-0" max-width="35vh">
									<v-btn
										prepend-icon="mdi-attachment-remove"
										:flat="true"
										color="warning"
										variant="tonal"
										:block="true"
										@click="deleteAttachment()"
										>清除已有头像</v-btn
									>
									<div class="d-flex align-center mt-5">
										<v-file-input
											v-model="files"
											density="compact"
											label="更新头像"
											variant="solo-filled"
											hide-details
											:single-line="true"
											:flat="true"
											style="overflow: hidden"
										></v-file-input>
										<v-btn
											:flat="true"
											class="ml-3"
											color="primary"
											@click="uploadAttachment()"
											>上传</v-btn
										>
									</div>
								</v-sheet>
							</v-sheet>
						</v-card>
					</v-dialog>
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
import type { Ref } from "vue";
import { useConfigStore } from "@/store/config";
import { useAuthStore } from "@/store/auth";
import CornerIcon from "@/components/ui/CornerIcon.vue";
import IAvatar from "@/components/images/IAvatar.vue";
import { useSnackBarStore } from "@/store/snackBar";
import { useMediaStore } from "@/store/media";
import type { User } from "@/types/user";

const configStore = useConfigStore();
const authStore = useAuthStore();
const snackBarStore = useSnackBarStore();
const mediaStore = useMediaStore();

const user = ref({} as User);
const password = ref("");
const passwordConfirm = ref("");

const dialog = ref(false);
const files: Ref<Array<File>> = ref([]);

onMounted(async () => {
	await getUser();
});

async function getUser() {
	interface Response {
		code: number;
		data: Array<User>;
	}
	const { data: res } = await useAuthFetch(
		`/users/?id=${authStore.user?.id}`
	);
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
			id: authStore.user?.id,
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

async function deleteAttachment() {
	const success = await mediaStore.deleteUserAvatar(user.value.id);
	if (success) {
		snackBarStore.success("头像清除成功");
	} else {
		snackBarStore.error("头像清除失败");
	}
}

async function uploadAttachment() {
	if (files.value[0]) {
		const success = await mediaStore.setUserAvatar(
			user.value.id,
			files.value[0]
		);
		if (success) {
			snackBarStore.success("头像上传成功");
		} else {
			snackBarStore.error("头像上传失败");
		}
	} else {
		snackBarStore.error("请选择文件再上传");
	}
}

function openDialog() {
	files.value = [];
	dialog.value = true;
}

useHead({
	title: `用户设置 - ${configStore.pltCfg.site.title}`,
});
</script>
