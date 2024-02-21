<template>
  <v-card class="challenge-card no-select" variant="tonal" color="teal" elevation="0">
    <v-card-item>
      <div>
        <div class="text-overline mb-1">{{ fileSize }} 字节</div>
        <div
          class="text-h6 my-1 font-weight-bold"
          style="
            width: 200px;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
          "
        >
          {{ fileName }}
        </div>
      </div>
    </v-card-item>
    <v-icon
      size="200"
      style="position: absolute; right: -10px; bottom: -70px; z-index: -1; opacity: 0.2"
      icon="mdi-attachment"
    />
  </v-card>
</template>

<script setup lang="ts">
interface Props {
  fileName: string;
  fileSize: number;
}
defineProps<Props>();
</script>
