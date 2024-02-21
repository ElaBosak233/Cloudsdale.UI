<template>
	<div>
		<SideBar id="sidebar" />
		<main>
			<div>
				<slot />
			</div>
		</main>
		<CornerIcon icon="mdi-hammer-wrench" />
	</div>
</template>

<script setup lang="ts">
import SideBar from "@/components/admin/SideBar.vue";
import CornerIcon from "~/components/CornerIcon.vue";
</script>

<style scoped lang="scss">
#sidebar {
	position: fixed;
}
</style>
