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
		<div>
			<div style="padding: 3% 10%">
				<div class="d-flex justify-center">
					{{ user }}
				</div>
			</div>
		</div>
		<CornerIcon icon="mdi-account" />
	</div>
</template>

<script setup lang="ts">
import { useConfigStore } from "@/store/config";
import CornerIcon from "@/components/ui/CornerIcon.vue";
import type { User } from "@/types/user";
const configStore = useConfigStore();

const user = ref({} as User);

onMounted(async () => {
	await getUser();
	useHead({
		title: `${user.value.nickname} - ${configStore.pltCfg.site.title}`,
	});
});

async function getUser() {
	interface Response {
		code: number;
		data: Array<User>;
	}
	const { data: res } = await useAuthFetch(
		`/users/?id=${useRoute().params.id}`
	);
	const resObj = res.value as Response;
	if (resObj.code === 200) {
		user.value = resObj.data[0];
	}
}
</script>
