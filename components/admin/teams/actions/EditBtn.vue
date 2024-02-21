<template>
  <v-list-item base-color="primary" @click="openDialog()">
    <v-icon icon="mdi-file-document-edit" />
    <v-tooltip activator="parent" location="top center"> 编辑 </v-tooltip>
  </v-list-item>
</template>

<script setup lang="ts">
import { useTeamStore } from "~/store/team";

const teamStore = useTeamStore();

interface Props {
  item: Team;
}
const props = defineProps<Props>();

function openDialog() {
  teamStore.$resetTeamEditor();
  teamStore.teamEditor.team = useCloneDeep(props.item);
  teamStore.teamEditor.type = "edit";
  teamStore.teamEditor.dialog = true;
}
</script>
