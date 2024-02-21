<template>
	<v-avatar
		:size="size"
		color="primary"
		:image="mediaStore.userAvatarBlobs[userId]"
	>
		<v-icon icon="mdi-account" :size="size * 0.6"></v-icon>
	</v-avatar>
</template>

<script setup lang="ts">
import { useMediaStore } from "@/store/media";

const mediaStore = useMediaStore();

interface Props {
	userId: number;
	size: number;
}

const props = defineProps<Props>();
const { userId } = props;
mediaStore.getUserAvatar(props.userId);
</script>
