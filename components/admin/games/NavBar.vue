<template>
  <div class="d-flex justify-space-between align-center">
    <div class="d-flex">
      <v-icon icon="mdi-flag" size="35" color="primary"></v-icon>
      <v-chip :label="true" class="mx-2" color="primary" style="max-width: 70vh">
        <span class="font-weight-bold text-h6">{{ title }}</span>
      </v-chip>
    </div>
    <div style="width: 50%">
      <v-toolbar color="primary" :rounded="true" density="comfortable">
        <v-spacer />
        <v-toolbar-items>
          <v-btn
            prepend-icon="mdi-web"
            @click="$router.push(`/admin/games/${useRoute().params.id}`)"
          >
            全局设置
          </v-btn>
          <v-btn
            prepend-icon="mdi-book-multiple"
            @click="$router.push(`/admin/games/${useRoute().params.id}/challenges`)"
          >
            题库设置
          </v-btn>
          <v-btn
            prepend-icon="mdi-check-decagram"
            @click="$router.push(`/admin/games/${useRoute().params.id}/submissions`)"
          >
            提交记录
          </v-btn>
          <v-btn
            prepend-icon="mdi-account-multiple"
            @click="$router.push(`/admin/games/${useRoute().params.id}/teams`)"
          >
            参赛团队
          </v-btn>
        </v-toolbar-items>
        <v-spacer />
      </v-toolbar>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string;
}
defineProps<Props>();
</script>
