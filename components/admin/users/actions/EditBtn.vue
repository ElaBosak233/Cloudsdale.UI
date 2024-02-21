<template>
  <v-list-item base-color="primary" @click="openDialog()">
    <v-icon icon="mdi-account-edit" />
    <v-tooltip activator="parent" location="top center"> 编辑 </v-tooltip>
  </v-list-item>
</template>

<script setup lang="ts">
import { useUserStore } from "~/store/user";

const userStore = useUserStore();

interface Props {
  item: User;
}
const props = defineProps<Props>();

function openDialog() {
  userStore.$resetUserEditor();
  userStore.userEditor.user = useCloneDeep(props.item);
  userStore.userEditor.type = "edit";
  userStore.userEditor.dialog = true;
}
</script>
