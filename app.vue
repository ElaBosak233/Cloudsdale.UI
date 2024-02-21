<template>
	<Body>
		<v-layout>
			<NavBar id="navbar" />
			<v-main>
				<NuxtLayout>
					<NuxtPage />
				</NuxtLayout>
			</v-main>
		</v-layout>
		<v-snackbar
			v-model="snackBarStore.snackbar"
			location="right bottom"
			color="transparent"
			variant="tonal"
			:timeout="2000"
		>
			<v-alert
				:text="snackBarStore.text"
				:type="snackBarStore.type"
			></v-alert>
		</v-snackbar>
		<WidthLimitOverlay v-if="isWidthTooSmall" />
	</Body>
</template>

<script lang="ts" setup>
import NavBar from "@/components/navigations/NavBar.vue";
import WidthLimitOverlay from "@/components/utils/WidthLimitOverlay.vue";
import { useSnackBarStore } from "@/store/snackBar";
import { useConfigStore } from "@/store/config";

const snackBarStore = useSnackBarStore();
const configStore = useConfigStore();

const isWidthTooSmall = ref(false);

configStore.loadGlobalConfig();

onMounted(() => {
	window.addEventListener("resize", checkWindowWidth);
	checkWindowWidth();
});

onBeforeUnmount(() => {
	window.removeEventListener("resize", checkWindowWidth);
});

function checkWindowWidth() {
	isWidthTooSmall.value = window.innerWidth < 1265;
}
</script>
