<template>
	<div class="d-flex justify-center align-center">
		<v-sheet class="pa-10" style="min-width: 100%">
			<div class="d-flex justify-between align-center">
				<v-icon icon="mdi-web" size="35" color="primary"></v-icon>
				<v-chip :label="true" class="mx-2" color="primary">
					<span class="font-weight-bold text-h6 no-select"
						>全局设置</span
					>
				</v-chip>
			</div>
			<div class="mt-5 mb-2 text-h6 font-weight-bold no-select">
				平台设置
			</div>
			<v-divider />
			<div class="mt-5">
				<v-text-field
					v-model="platform.site.title"
					label="站点标题"
					prepend-icon="mdi-format-title"
				></v-text-field>
			</div>
			<div class="d-flex justify-space-between">
				<v-text-field
					v-model="platform.site.description"
					density="comfortable"
					label="站点简介"
					prepend-icon="mdi-information"
				></v-text-field>
			</div>
			<div class="mt-5 mb-2 text-h6 font-weight-bold no-select">
				容器设置
			</div>
			<v-divider />
			<div class="mt-5 d-flex justify-space-between">
				<v-text-field
					v-model.number="platform.container.parallel_limit"
					density="comfortable"
					label="容器并行数量（仅限练习场）"
					prepend-icon="mdi-road-variant"
					type="number"
				></v-text-field>
				<v-text-field
					v-model.number="platform.container.request_limit"
					density="comfortable"
					label="容器请求时间限制（秒）"
					prepend-icon="mdi-progress-clock"
					class="ml-2"
					type="number"
				></v-text-field>
			</div>
			<div class="mt-5 mb-2 text-h6 font-weight-bold no-select">
				用户策略
			</div>
			<v-divider />
			<div class="mt-2 d-flex">
				<v-switch
					v-model="platform.user.allow_registration"
					color="primary"
					label="允许新用户注册"
				></v-switch>
				<v-switch color="primary" label="注册后需要邮箱确认"></v-switch>
				<v-switch color="primary" label="使用谷歌验证码"></v-switch>
			</div>
			<div>
				<v-text-field
					label="允许注册的邮箱列表（使用'/'隔开，留空即不限）"
					density="comfortable"
					prepend-icon="mdi-email-seal"
				></v-text-field>
			</div>
			<div class="text-end">
				<v-btn
					class="text-none"
					color="primary"
					variant="flat"
					width="90"
					@click="save()"
				>
					保存
				</v-btn>
			</div>
		</v-sheet>
	</div>
</template>

<script setup lang="ts">
import { useConfigStore } from "~/store/config";
import { useSnackBarStore } from "~/store/snackBar";

const configStore = useConfigStore();
const snackBarStore = useSnackBarStore();

const platform = ref(useCloneDeep(configStore.pltCfg));

definePageMeta({
	layout: "admin",
});

useHead({
	title: `全局设置 - ${configStore.pltCfg.site.title}`,
});

function save() {
	interface Response {
		code: number;
		msg: string;
	}
	const { data: res } = useAuthFetch("/configs/", {
		method: "PUT",
		body: {
			platform: {
				title: platform.value.site.title,
				description: platform.value.site.description,
			},
			container: {
				parallel_limit: platform.value.container.parallel_limit,
				request_limit: platform.value.container.request_limit,
			},
			user: {
				allow_registration: platform.value.user.allow_registration,
			},
		},
	});
	const resObj = res.value as Response;
	if (resObj.code === 200) {
		snackBarStore.showSnackbar("保存成功，刷新即可查看变化", "success");
	} else {
		snackBarStore.showSnackbar("保存失败，请重试", "error");
	}
}
</script>
