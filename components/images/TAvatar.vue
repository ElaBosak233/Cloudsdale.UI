<template>
	<div>
		<v-avatar
			v-if="mediaStore.teamAvatarBlobs[teamId]"
			:size="size"
			color="primary"
			:image="mediaStore.teamAvatarBlobs[teamId]"
		/>
		<v-avatar
			v-if="!mediaStore.teamAvatarBlobs[teamId]"
			:size="size"
			color="primary"
		>
			<v-icon icon="mdi-account-multiple" :size="size * 0.6"></v-icon>
		</v-avatar>
	</div>
</template>

<script setup lang="ts">
import { useMediaStore } from "@/store/media";

const mediaStore = useMediaStore();

interface Props {
	teamId: number;
	size: number;
}
const props = defineProps<Props>();

mediaStore.getTeamAvatar(props.teamId);
</script>
