<template>
  <v-dialog width="100vh" :persistent="true">
    <v-card class="pa-8">
      <div class="d-flex justify-between align-center">
        <v-icon
          :icon="
            teamStore.teamEditor.type === 'edit'
              ? 'mdi-file-document-edit'
              : 'mdi-account-multiple-plus'
          "
          size="35"
          color="primary"
        ></v-icon>
        <v-chip :label="true" class="mx-2" color="primary">
          <span
            v-if="teamStore.teamEditor.type === 'edit'"
            class="font-weight-bold text-h6"
          >
            团队编辑
          </span>
          <span
            v-if="teamStore.teamEditor.type === 'create'"
            class="font-weight-bold text-h6"
          >
            团队创建
          </span>
        </v-chip>
      </div>
      <div class="pt-5">
        <div class="d-flex">
          <v-text-field
            v-model="teamStore.teamEditor.team.name"
            label="团队名"
            prepend-icon="mdi-account"
            density="comfortable"
          ></v-text-field>
        </div>
        <div class="d-flex">
          <v-textarea
            v-model="teamStore.teamEditor.team.description"
            label="团队简介"
            prepend-icon="mdi-lifebuoy"
          ></v-textarea>
        </div>
        <div class="d-flex">
          <v-text-field
            v-model.number="teamStore.teamEditor.team.captain_id"
            label="队长 ID"
            prepend-icon="mdi-crown"
            density="comfortable"
            type="number"
          ></v-text-field>
        </div>
      </div>
      <div class="d-flex justify-end">
        <v-btn
          variant="flat"
          color="error"
          class="mx-1"
          @click="teamStore.teamEditor.dialog = false"
          >取消</v-btn
        >
        <v-btn variant="flat" color="primary" class="mx-1" @click="teamStore.saveTeam()">
          <span v-if="teamStore.teamEditor.type === 'edit'">保存</span>
          <span v-else>创建</span>
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useTeamStore } from "~/store/team";

const teamStore = useTeamStore();
</script>
