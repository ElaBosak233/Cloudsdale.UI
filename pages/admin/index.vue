<template>
	<div>
		<div class="d-flex flex-column justify-center align-center mt-4">
			<img
				src="https://img.buuoj.cn/buugirl/img.php"
				alt=""
				width="400"
			/>
			{{ configStore.apiUrl }}
		</div>
	</div>
</template>

<script setup lang="ts">
import { useConfigStore } from "~/store/config";

const configStore = useConfigStore();

definePageMeta({
	layout: "admin",
});
useHead({
	title: `管理主页 - ${configStore.pltCfg.site.title}`,
});
</script>
