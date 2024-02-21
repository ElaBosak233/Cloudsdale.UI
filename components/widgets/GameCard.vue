<template>
  <v-card class="game-card no-select d-flex" elevation="3">
    <GameCover
      :width="300"
      :height="(300 / 16) * 9"
      :game-id="item.id"
      class="game-cover"
    />
    <div class="pa-3 d-flex" style="width: 100%">
      <div>
        <div class="d-flex ma-2">
          <v-chip class="ma-1" density="comfortable"
            >{{
              item.member_limit_min === 1 && item.member_limit_max == 1 ? "单" : "多"
            }}人赛</v-chip
          >
          <v-chip class="ma-1" density="comfortable"
            >{{
              Math.floor(
                (new Date(item.ended_at).getTime() -
                  new Date(item.started_at).getTime()) /
                  3600000
              )
            }}
            小时</v-chip
          >
        </div>
        <div
          class="ml-2 mt-2 text-h5 font-weight-bold"
          style="
            width: 30rem;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
          "
        >
          {{ item.title }}
        </div>
        <div
          class="ml-2 mt-2 text-caption"
          style="width: 35rem; height: 2.5rem; overflow: hidden"
        >
          {{ item.bio }}
        </div>
      </div>
    </div>
    <v-badge
      v-if="
        new Date() > new Date(item.started_at) && new Date() < new Date(item.ended_at)
      "
      color="green"
      :inline="true"
      style="position: absolute; right: 10px; top: 12px"
    >
      <v-tooltip activator="parent" location="top center">
        <div>进行中</div>
      </v-tooltip>
    </v-badge>
    <v-badge
      v-if="new Date() < new Date(item.started_at)"
      color="orange"
      :inline="true"
      style="position: absolute; right: 10px; top: 12px"
    >
      <v-tooltip activator="parent" location="top center">
        <div>未开始</div>
      </v-tooltip>
    </v-badge>
    <v-badge
      v-if="new Date() > new Date(item.ended_at)"
      color="red"
      :inline="true"
      style="position: absolute; right: 10px; top: 12px"
    >
      <v-tooltip activator="parent" location="top center">
        <div>已结束</div>
      </v-tooltip>
    </v-badge>
    <v-icon
      size="200"
      style="position: absolute; right: 10px; bottom: -25px; z-index: -1; opacity: 0.1"
      icon="mdi-flag"
    />
  </v-card>
</template>

<script setup lang="ts">
import GameCover from "@/components/avatar/GameCover.vue";

interface Props {
  item: Game;
}
const props = defineProps<Props>();

const gameCoverUrl =
  "http://mao.ctf.homes/assets/345e07bc931e95eb94b15ff7951c84a5df16ed9fc6987344445f8b5108307e92/poster";
const gameCoverCss = `url(${gameCoverUrl})`;
</script>

<style lang="scss">
.game-card {
  height: 10rem;
  min-width: 60rem;
  max-width: 60rem;
}
</style>
