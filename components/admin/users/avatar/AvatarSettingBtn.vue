<template>
	<v-list-item base-color="teal" @click="openDialog()">
		<v-icon icon="mdi-image-edit" />
		<v-tooltip activator="parent" location="top center">
			头像管理
		</v-tooltip>
	</v-list-item>
	<v-dialog v-model="dialog" min-width="50vh" max-width="50vh">
		<v-card class="pa-5">
			<div class="d-flex justify-between align-center">
				<v-icon icon="mdi-image-edit" size="35" color="teal"></v-icon>
				<v-chip :label="true" class="mx-2" color="teal">
					<span class="font-weight-bold text-h6">头像管理</span>
				</v-chip>
			</div>
			<v-sheet class="d-flex justify-space-between mt-5">
				<div class="d-flex justify-center align-center pa-3">
					<IAvatar ref="child" :size="80" :user-id="item.id" />
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
</template>

<script setup lang="ts">
import { useSnackBarStore } from "@/store/snackBar";
import { useUserStore } from "@/store/user";
import IAvatar from "@/components/images/IAvatar.vue";

const child = ref<PodType<typeof IAvatar>>();

const userStore = useUserStore();
const snackBarStore = useSnackBarStore();
const dialog = ref(false);
const files: Ref<Array<File>> = ref([]);

interface Props {
	item: User;
}
const props = defineProps<Props>();

function openDialog() {
	files.value = [];
	dialog.value = true;
}

async function deleteAttachment() {
	interface Response {
		code: number;
	}
	const { data: res } = await useAuthFetch(
		`/media/users/avatar/${props.item.id}`,
		{
			method: "DELETE",
		}
	);
	const resObj = res.value as Response;
	if (resObj.code === 200) {
		snackBarStore.showSnackbar("头像清除成功", "success");
		userStore.deleteUserAvatar(props.item.id);
	} else {
		snackBarStore.showSnackbar("头像清除失败", "error");
	}
}

async function uploadAttachment() {
	interface Response {
		code: number;
		msg: string;
	}
	if (files.value[0]) {
		const formData = new FormData();
		formData.append("avatar", files.value[0]);
		const { data: res } = await useAuthFetch(
			`/media/users/avatar/${props.item.id}`,
			{
				method: "POST",
				body: formData,
			}
		);
		const resObj = res.value as Response;
		if (resObj.code === 200) {
			snackBarStore.showSnackbar("头像上传成功", "success");
			userStore.updateUserAvatar(props.item.id);
		} else {
			snackBarStore.showSnackbar("头像上传失败\n" + resObj.msg, "error");
		}
	} else {
		snackBarStore.showSnackbar("请选择文件再上传", "error");
	}
}
</script>
