<template>
  <v-card width="20rem" height="25rem">
    <v-tabs
      v-model="tab"
      bg-color="blue-darken-3"
      density="compact"
      :center-active="true"
    >
      <v-tab value="all">全部</v-tab>
      <v-tab value="notifications">通知</v-tab>
      <v-tab value="updates">动态</v-tab>
      <v-tab value="challenges">题目</v-tab>
    </v-tabs>

    <v-card-text> 111 </v-card-text>
  </v-card>
</template>
<script setup lang="ts">
const tab = ref("all");
</script>
