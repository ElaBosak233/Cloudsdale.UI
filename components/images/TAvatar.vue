<template>
  <v-avatar :size="size" color="primary" :image="teamStore.teamAvatar[teamId]">
    <v-icon icon="mdi-account-multiple" :size="size * 0.4"></v-icon>
  </v-avatar>
</template>

<script setup lang="ts">
import { useAuthFetch } from "@/composables/useAuthFetch";
import { useTeamStore } from "~/store/team";

const teamStore = useTeamStore();

interface Props {
  teamId: number;
  size: number;
}
const props = defineProps<Props>();
const { teamId } = toRefs(props);

teamStore.getTeamAvatar(props.teamId);
</script>
