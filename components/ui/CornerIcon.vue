<template>
	<v-icon
		size="400"
		style="
			position: fixed;
			right: 10px;
			bottom: 10px;
			z-index: -1;
			opacity: 0.05;
		"
		:icon="icon"
	/>
</template>

<script setup lang="ts">
interface Props {
	icon: string;
}
withDefaults(defineProps<Props>(), {
	icon: "mdi-account-multiple",
});
</script>
