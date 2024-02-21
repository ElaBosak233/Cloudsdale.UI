<template>
  <v-list-item base-color="teal" @click="dialog = true">
    <v-icon icon="mdi-play-circle" />
    <v-tooltip activator="parent" location="top center"> 预览 </v-tooltip>
  </v-list-item>
  <ChallengeDialog
    v-model="dialog"
    :challenge-id="item?.id"
    :description="item?.description"
    :category="item?.category"
    :title="item?.title"
    :pts="item?.pts"
    :is-dynamic="item?.is_dynamic"
    :has-attachment="item?.has_attachment"
    :duration="item?.duration"
    :difficulty="item?.difficulty"
  />
</template>

<script setup lang="ts">
import ChallengeDialog from "@/components/challenges/ChallengeDialog.vue";

interface Props {
  item: Challenge;
}
defineProps<Props>();

const dialog = ref(false);
</script>
