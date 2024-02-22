<template>
	<div>
		<v-avatar
			v-if="mediaStore.userAvatarBlobs[userId]"
			:size="size"
			color="primary"
			:image="mediaStore.userAvatarBlobs[userId]"
		/>
		<v-avatar
			v-if="!mediaStore.userAvatarBlobs[userId]"
			:size="size"
			color="primary"
		>
			<v-icon icon="mdi-account" :size="size * 0.6"></v-icon>
		</v-avatar>
	</div>
</template>

<script setup lang="ts">
import { useMediaStore } from "@/store/media";

const mediaStore = useMediaStore();

interface Props {
	userId: number;
	size: number;
}

const props = defineProps<Props>();
mediaStore.getUserAvatar(props.userId);
</script>
