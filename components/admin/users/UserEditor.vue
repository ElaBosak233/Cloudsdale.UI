<template>
  <v-dialog width="100vh" :persistent="true">
    <v-card class="pa-8">
      <div class="d-flex justify-between align-center">
        <v-icon
          :icon="
            userStore.userEditor.type === 'edit' ? 'mdi-account-edit' : 'mdi-account-plus'
          "
          size="35"
          color="primary"
        ></v-icon>
        <v-chip :label="true" class="mx-2" color="primary">
          <span
            v-if="userStore.userEditor.type === 'edit'"
            class="font-weight-bold text-h6"
          >
            用户编辑
          </span>
          <span
            v-if="userStore.userEditor.type === 'create'"
            class="font-weight-bold text-h6"
          >
            用户创建
          </span>
        </v-chip>
      </div>
      <div class="pt-5">
        <div class="d-flex">
          <v-text-field
            v-model="userStore.userEditor.user.username"
            label="用户名"
            prepend-icon="mdi-account"
            density="comfortable"
          ></v-text-field>
          <v-text-field
            v-model="userStore.userEditor.user.nickname"
            label="昵称"
            prepend-icon="mdi-duck"
            density="comfortable"
            class="pl-2"
          ></v-text-field>
        </div>
        <div class="d-flex">
          <v-text-field
            v-model="userStore.userEditor.user.email"
            label="邮箱"
            prepend-icon="mdi-email"
            density="comfortable"
          ></v-text-field>
          <v-text-field
            v-model.lazy.number="userStore.userEditor.user.group_id"
            :rules="[rules.role]"
            label="权限"
            prepend-icon="mdi-key-chain"
            density="comfortable"
            type="number"
            class="pl-2"
          ></v-text-field>
        </div>
        <v-text-field
          v-model="userStore.userEditor.user.password"
          label="密码"
          prepend-icon="mdi-lock"
          density="comfortable"
          type="password"
        ></v-text-field>
      </div>
      <div class="d-flex justify-end">
        <v-btn
          variant="flat"
          color="error"
          class="mx-1"
          @click="userStore.userEditor.dialog = false"
          >取消</v-btn
        >
        <v-btn variant="flat" color="primary" class="mx-1" @click="userStore.saveUser()">
          <span v-if="userStore.userEditor.type === 'edit'">保存</span>
          <span v-else>创建</span>
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useUserStore } from "~/store/user";

const userStore = useUserStore();

const rules = {
  role: (v: number) => {
    if (v >= 1 && v <= 5) {
      return true;
    }
    return "权限值必须介于 1 和 5 之间";
  },
};
</script>
