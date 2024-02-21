<template>
  <v-list-item base-color="primary" @click="openDialog()">
    <v-icon icon="mdi-file-edit" />
    <v-tooltip activator="parent" location="top center"> 编辑 </v-tooltip>
  </v-list-item>
</template>

<script setup lang="ts">
import { useChallengeStore } from "~/store/challenge";

const challengeStore = useChallengeStore();

interface Props {
  item: Challenge;
}
const props = defineProps<Props>();

function openDialog() {
  challengeStore.$resetChallengeEditor();
  challengeStore.challengeEditor.challenge = useCloneDeep(props.item);
  challengeStore.challengeEditor.type = "edit";
  challengeStore.challengeEditor.dialog = true;
}
</script>
