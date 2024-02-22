<template>
	<div>
		<NavBar id="navbar" />
		<main>
			<div>
				<slot />
			</div>
		</main>
	</div>
</template>

<script setup lang="ts">
import NavBar from "@/components/navigations/NavBar.vue";
</script>
