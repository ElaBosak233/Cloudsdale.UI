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
		<CornerIcon icon="mdi-home" />
	</div>
</template>

<script setup lang="ts">
import { useConfigStore } from "@/store/config";
import CornerIcon from "@/components/ui/CornerIcon.vue";
const configStore = useConfigStore();

useHead({
	title: configStore.pltCfg.site.title,
});
</script>
